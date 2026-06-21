// ============================================================
// DulaeDee TypeScript Database Types
// Auto-generated structure mirrors supabase-schema.sql
// ============================================================

export type UserRole = 'elderly' | 'family' | 'caregiver'
export type MedicationSchedule = 'before' | 'after' | 'with'
export type MedicationLogStatus = 'pending' | 'confirmed' | 'missed' | 'skipped'
export type CheckinStatus = 'good' | 'not_good' | 'emergency'
export type EmergencyStatus = 'active' | 'resolved'
export type NotificationStatus = 'sent' | 'failed' | 'pending'

export interface Family {
  id: string
  name: string
  created_by: string | null
  line_group_id: string | null
  created_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  name: string
  role: UserRole
  age: number | null
  phone: string | null
  line_user_id: string | null
  telegram_id: string | null
  created_at: string
}

export interface Medication {
  id: string
  family_member_id: string
  name: string
  dosage: string
  times: string[] // e.g. ["08:00", "12:00", "20:00"]
  before_after_food: MedicationSchedule | null
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface MedicationLog {
  id: string
  medication_id: string
  family_member_id: string
  scheduled_time: string
  confirmed_at: string | null
  status: MedicationLogStatus
}

export interface Checkin {
  id: string
  family_member_id: string
  date: string // YYYY-MM-DD
  status: CheckinStatus
  symptoms: string[] // e.g. ["headache", "dizzy"]
  notes: string | null
  created_at: string
}

export interface Emergency {
  id: string
  family_member_id: string
  status: EmergencyStatus
  resolved_by: string | null
  resolved_at: string | null
  notes: string | null
  created_at: string
}

export interface Appointment {
  id: string
  family_member_id: string
  hospital: string
  department: string | null
  doctor_name: string | null
  appointment_date: string
  reminder_days_before: number
  notes: string | null
  created_at: string
}

export interface NotificationLog {
  id: string
  family_member_id: string
  type: string
  channel: string
  message: string
  sent_at: string
  status: NotificationStatus
}

// ============================================================
// Supabase Database Type (for typed queries)
// ============================================================

export interface Database {
  public: {
    Tables: {
      families: {
        Row: Family
        Insert: Omit<Family, 'id' | 'created_at'>
        Update: Partial<Omit<Family, 'id' | 'created_at'>>
      }
      family_members: {
        Row: FamilyMember
        Insert: Omit<FamilyMember, 'id' | 'created_at'>
        Update: Partial<Omit<FamilyMember, 'id' | 'created_at'>>
      }
      medications: {
        Row: Medication
        Insert: Omit<Medication, 'id' | 'created_at'>
        Update: Partial<Omit<Medication, 'id' | 'created_at'>>
      }
      medication_logs: {
        Row: MedicationLog
        Insert: Omit<MedicationLog, 'id'>
        Update: Partial<Omit<MedicationLog, 'id'>>
      }
      checkins: {
        Row: Checkin
        Insert: Omit<Checkin, 'id' | 'created_at'>
        Update: Partial<Omit<Checkin, 'id' | 'created_at'>>
      }
      emergencies: {
        Row: Emergency
        Insert: Omit<Emergency, 'id' | 'created_at'>
        Update: Partial<Omit<Emergency, 'id' | 'created_at'>>
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, 'id' | 'created_at'>
        Update: Partial<Omit<Appointment, 'id' | 'created_at'>>
      }
      notification_logs: {
        Row: NotificationLog
        Insert: Omit<NotificationLog, 'id' | 'sent_at'>
        Update: Partial<Omit<NotificationLog, 'id' | 'sent_at'>>
      }
    }
    Views: Record<string, never>
    Functions: {
      user_belongs_to_family: {
        Args: { target_family_id: string }
        Returns: boolean
      }
      get_user_family_ids: {
        Args: Record<string, never>
        Returns: string[]
      }
    }
    Enums: {
      user_role: UserRole
      medication_schedule: MedicationSchedule
      medication_log_status: MedicationLogStatus
      checkin_status: CheckinStatus
      emergency_status: EmergencyStatus
      notification_status: NotificationStatus
    }
  }
}

// ============================================================
// Extended / Joined Types (for UI)
// ============================================================

export interface FamilyWithMembers extends Family {
  family_members: FamilyMember[]
}

export interface FamilyMemberWithMedications extends FamilyMember {
  medications: Medication[]
}

export interface MedicationWithLogs extends Medication {
  medication_logs: MedicationLog[]
}

export interface FamilyMemberWithCheckins extends FamilyMember {
  checkins: Checkin[]
}
