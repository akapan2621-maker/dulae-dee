-- ============================================================
-- DulaeDee - Database Schema (dulae_dee schema)
-- ============================================================

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS dulae_dee;

-- 2. Enable UUID extension (in dulae_dee schema)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA dulae_dee;

-- 3. Create tables in dulae_dee schema
CREATE TABLE dulae_dee.families (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  line_group_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dulae_dee.family_members (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES dulae_dee.families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('elderly', 'family', 'caregiver')),
  age INT CHECK (age > 0 AND age < 150),
  phone TEXT,
  line_user_id TEXT,
  telegram_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dulae_dee.medications (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES dulae_dee.family_members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  times JSONB NOT NULL DEFAULT '[]'::JSONB,
  before_after_food TEXT CHECK (before_after_food IN ('before', 'after', 'with', NULL)),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dulae_dee.medication_logs (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  medication_id UUID NOT NULL REFERENCES dulae_dee.medications(id) ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES dulae_dee.family_members(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'missed', 'skipped'))
);

CREATE TABLE dulae_dee.checkins (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES dulae_dee.family_members(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('good', 'not_good', 'emergency')),
  symptoms JSONB DEFAULT '[]'::JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dulae_dee.emergencies (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES dulae_dee.family_members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dulae_dee.appointments (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES dulae_dee.family_members(id) ON DELETE CASCADE,
  hospital TEXT NOT NULL,
  department TEXT,
  doctor_name TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  reminder_days_before INT NOT NULL DEFAULT 1 CHECK (reminder_days_before >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dulae_dee.notification_logs (
  id UUID PRIMARY KEY DEFAULT dulae_dee.uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES dulae_dee.family_members(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending'))
);

-- 4. Indexes
CREATE INDEX idx_dd_families_created_by ON dulae_dee.families(created_by);
CREATE INDEX idx_dd_family_members_family_id ON dulae_dee.family_members(family_id);
CREATE INDEX idx_dd_family_members_line_user_id ON dulae_dee.family_members(line_user_id);
CREATE INDEX idx_dd_medications_family_member_id ON dulae_dee.medications(family_member_id);
CREATE INDEX idx_dd_medication_logs_medication_id ON dulae_dee.medication_logs(medication_id);
CREATE INDEX idx_dd_medication_logs_family_member_id ON dulae_dee.medication_logs(family_member_id);
CREATE INDEX idx_dd_checkins_family_member_id ON dulae_dee.checkins(family_member_id);
CREATE INDEX idx_dd_checkins_date ON dulae_dee.checkins(date);
CREATE INDEX idx_dd_emergencies_family_member_id ON dulae_dee.emergencies(family_member_id);
CREATE INDEX idx_dd_appointments_family_member_id ON dulae_dee.appointments(family_member_id);

-- 5. Seed data
INSERT INTO dulae_dee.families (id, name, created_by, line_group_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Family', '00000000-0000-0000-0000-000000000099', 'LINE_DEMO_GROUP_001');

INSERT INTO dulae_dee.family_members (id, family_id, name, role, age, phone, line_user_id, telegram_id)
VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'ยายสมศรี', 'elderly', 78, '0812345678', 'LINE_USER_DEMO_010', 'TG_DEMO_010'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'คุณแดง', 'family', 52, '0898765432', 'LINE_USER_DEMO_011', 'TG_DEMO_011');

INSERT INTO dulae_dee.medications (id, family_member_id, name, dosage, times, before_after_food, notes)
VALUES
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Amlodipine 5mg', '1 เม็ด', '["08:00"]'::JSONB, 'after', 'ยาลดความดัน'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', 'Metformin 500mg', '1 เม็ด', '["08:00", "18:00"]'::JSONB, 'after', 'ยาคุมน้ำตาล');

-- 6. Grant permissions
GRANT USAGE ON SCHEMA dulae_dee TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA dulae_dee TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA dulae_dee TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dulae_dee
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dulae_dee
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

