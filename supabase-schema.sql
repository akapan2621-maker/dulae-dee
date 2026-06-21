-- ============================================================
-- DulaeDee - Complete Supabase Database Schema
-- Elderly care medication & health tracking platform
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- 1. Families
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  line_group_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE families IS 'Family units that group elderly members and caregivers';

-- 2. Family Members
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('elderly', 'family', 'caregiver')),
  age INT CHECK (age > 0 AND age < 150),
  phone TEXT,
  line_user_id TEXT,
  telegram_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE family_members IS 'Individual members of a family unit';

-- 3. Medications
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  times JSONB NOT NULL DEFAULT '[]'::JSONB,
  before_after_food TEXT CHECK (before_after_food IN ('before', 'after', 'with', NULL)),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE medications IS 'Medication prescriptions for elderly family members';
COMMENT ON COLUMN medications.times IS 'Array of scheduled times, e.g. ["08:00", "12:00", "20:00"]';

-- 4. Medication Logs
CREATE TABLE medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'missed', 'skipped'))
);

COMMENT ON TABLE medication_logs IS 'Tracks medication intake for each scheduled dose';

-- 5. Check-ins
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('good', 'not_good', 'emergency')),
  symptoms JSONB DEFAULT '[]'::JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE checkins IS 'Daily health check-ins from elderly members';
COMMENT ON COLUMN checkins.symptoms IS 'Array of symptom strings, e.g. ["headache", "dizzy", "tired"]';

-- 6. Emergencies
CREATE TABLE emergencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE emergencies IS 'Emergency alerts triggered by check-ins or manual triggers';

-- 7. Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  hospital TEXT NOT NULL,
  department TEXT,
  doctor_name TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  reminder_days_before INT NOT NULL DEFAULT 1 CHECK (reminder_days_before >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE appointments IS 'Medical appointments for family members';

-- 8. Notification Logs
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending'))
);

COMMENT ON TABLE notification_logs IS 'Audit log of all notifications sent';

-- ============================================================
-- INDEXES
-- ============================================================

-- Families
CREATE INDEX idx_families_created_by ON families(created_by);
CREATE INDEX idx_families_line_group_id ON families(line_group_id);

-- Family Members
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_role ON family_members(role);
CREATE INDEX idx_family_members_line_user_id ON family_members(line_user_id);
CREATE INDEX idx_family_members_telegram_id ON family_members(telegram_id);

-- Medications
CREATE INDEX idx_medications_family_member_id ON medications(family_member_id);
CREATE INDEX idx_medications_is_active ON medications(is_active);

-- Medication Logs
CREATE INDEX idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX idx_medication_logs_family_member_id ON medication_logs(family_member_id);
CREATE INDEX idx_medication_logs_scheduled_time ON medication_logs(scheduled_time);
CREATE INDEX idx_medication_logs_status ON medication_logs(status);

-- Check-ins
CREATE INDEX idx_checkins_family_member_id ON checkins(family_member_id);
CREATE INDEX idx_checkins_date ON checkins(date);
CREATE INDEX idx_checkins_status ON checkins(status);

-- Emergencies
CREATE INDEX idx_emergencies_family_member_id ON emergencies(family_member_id);
CREATE INDEX idx_emergencies_status ON emergencies(status);

-- Appointments
CREATE INDEX idx_appointments_family_member_id ON appointments(family_member_id);
CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date);

-- Notification Logs
CREATE INDEX idx_notification_logs_family_member_id ON notification_logs(family_member_id);
CREATE INDEX idx_notification_logs_type ON notification_logs(type);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user belongs to a family
CREATE OR REPLACE FUNCTION public.user_belongs_to_family(target_family_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM family_members
    WHERE family_id = target_family_id
    AND (
      line_user_id = (SELECT line_user_id FROM family_members WHERE id = auth.uid()::text)
      OR telegram_id = (SELECT telegram_id FROM family_members WHERE id = auth.uid()::text)
    )
  ) OR EXISTS (
    SELECT 1 FROM families
    WHERE id = target_family_id
    AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: get user's family IDs
CREATE OR REPLACE FUNCTION public.get_user_family_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT fm.family_id
    FROM family_members fm
    WHERE fm.line_user_id = (SELECT line_user_id FROM family_members WHERE id = auth.uid()::text)
       OR fm.telegram_id = (SELECT telegram_id FROM family_members WHERE id = auth.uid()::text)
  UNION
  SELECT f.id
  FROM families f
  WHERE f.created_by = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ---- Families Policies ----
CREATE POLICY "Users can view their own families"
  ON families FOR SELECT
  USING (created_by = auth.uid() OR id IN (SELECT get_user_family_ids()));

CREATE POLICY "Authenticated users can create families"
  ON families FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Family creators can update their families"
  ON families FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Family creators can delete their families"
  ON families FOR DELETE
  USING (created_by = auth.uid());

-- ---- Family Members Policies ----
CREATE POLICY "Users can view members of their families"
  ON family_members FOR SELECT
  USING (family_id IN (SELECT get_user_family_ids()));

CREATE POLICY "Family members can add new members"
  ON family_members FOR INSERT
  WITH CHECK (family_id IN (SELECT get_user_family_ids()));

CREATE POLICY "Family members can update members"
  ON family_members FOR UPDATE
  USING (family_id IN (SELECT get_user_family_ids()));

CREATE POLICY "Family creators can delete members"
  ON family_members FOR DELETE
  USING (family_id IN (
    SELECT id FROM families WHERE created_by = auth.uid()
  ));

-- ---- Medications Policies ----
CREATE POLICY "Users can view medications of their family members"
  ON medications FOR SELECT
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "Family members can manage medications"
  ON medications FOR ALL
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

-- ---- Medication Logs Policies ----
CREATE POLICY "Users can view logs of their family members"
  ON medication_logs FOR SELECT
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "System can insert medication logs"
  ON medication_logs FOR INSERT
  WITH CHECK (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "Users can update medication logs for their family"
  ON medication_logs FOR UPDATE
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

-- ---- Check-ins Policies ----
CREATE POLICY "Users can view checkins of their family members"
  ON checkins FOR SELECT
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "Elderly members can create their own checkins"
  ON checkins FOR INSERT
  WITH CHECK (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

-- ---- Emergencies Policies ----
CREATE POLICY "Users can view emergencies of their family"
  ON emergencies FOR SELECT
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "Elderly or family can trigger emergencies"
  ON emergencies FOR INSERT
  WITH CHECK (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "Family can resolve emergencies"
  ON emergencies FOR UPDATE
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

-- ---- Appointments Policies ----
CREATE POLICY "Users can view appointments of their family"
  ON appointments FOR SELECT
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "Family members can manage appointments"
  ON appointments FOR ALL
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

-- ---- Notification Logs Policies ----
CREATE POLICY "Users can view notification logs of their family"
  ON notification_logs FOR SELECT
  USING (family_member_id IN (
    SELECT id FROM family_members WHERE family_id IN (SELECT get_user_family_ids())
  ));

CREATE POLICY "System can insert notification logs"
  ON notification_logs FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- SEED DATA (Development/Demo)
-- ============================================================

-- Demo family
INSERT INTO families (id, name, created_by, line_group_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Family (ตัวอย่างครอบครัว)',
  '00000000-0000-0000-0000-000000000099',
  'LINE_DEMO_GROUP_001'
);

-- Demo family members
INSERT INTO family_members (id, family_id, name, role, age, phone, line_user_id, telegram_id)
VALUES
  ('00000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000001',
   'ยายสมศรี', 'elderly', 78, '0812345678',
   'LINE_USER_DEMO_010', 'TG_DEMO_010'),
  ('00000000-0000-0000-0000-000000000011',
   '00000000-0000-0000-0000-000000000001',
   'คุณแดง', 'family', 52, '0898765432',
   'LINE_USER_DEMO_011', 'TG_DEMO_011'),
  ('00000000-0000-0000-0000-000000000012',
   '00000000-0000-0000-0000-000000000001',
   'พี่บัว', 'caregiver', 35, '0823456789',
   'LINE_USER_DEMO_012', 'TG_DEMO_012');

-- Demo medications for ยายสมศรี
INSERT INTO medications (id, family_member_id, name, dosage, times, before_after_food, notes)
VALUES
  ('00000000-0000-0000-0000-000000000020',
   '00000000-0000-0000-0000-000000000010',
   'Amlodipine 5mg', '1 เม็ด',
   '["08:00"]'::JSONB,
   'after', 'ยาลดความดันโลหิต'),
  ('00000000-0000-0000-0000-000000000021',
   '00000000-0000-0000-0000-000000000010',
   'Metformin 500mg', '1 เม็ด',
   '["08:00", "18:00"]'::JSONB,
   'after', 'ยาคุมน้ำตาล'),
  ('00000000-0000-0000-0000-000000000022',
   '00000000-0000-0000-0000-000000000010',
   'Aspirin 80mg', '1 เม็ด',
   '["08:00"]'::JSONB,
   'after', 'ละลายลิ่มเลือด');

-- Demo check-in
INSERT INTO checkins (family_member_id, date, status, symptoms)
VALUES
  ('00000000-0000-0000-0000-000000000010',
   CURRENT_DATE,
   'good',
   '[]'::JSONB);

-- Demo appointment
INSERT INTO appointments (family_member_id, hospital, department, doctor_name, appointment_date, reminder_days_before, notes)
VALUES
  ('00000000-0000-0000-0000-000000000010',
   'โรงพยาบาลรามาธิบดี',
   'อายุรกรรม',
   'นพ.วิชัย',
   NOW() + INTERVAL '7 days',
   1,
   'ตรวจเลือด ประจำปี');
