// ============================================================
// DulaeDee - App Constants
// Colors, Thai labels, UX rules
// ============================================================

// ============================================================
// COLOR SCHEME
// ============================================================

export const COLORS = {
  // Primary brand
  primary: '#4A90D9',        // Trustworthy blue
  primaryLight: '#7AB3EF',
  primaryDark: '#2E6DB3',

  // Accent
  accent: '#FF6B35',         // Warm orange for CTAs
  accentLight: '#FF8F66',
  accentDark: '#CC5529',

  // Status colors
  success: '#4CAF50',        // Green - confirmed/good
  warning: '#FFC107',        // Amber - pending/attention
  danger: '#F44336',         // Red - missed/emergency
  dangerLight: '#FF6659',
  info: '#2196F3',           // Blue - informational

  // Neutral palette
  white: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF2F7',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#A0AEC0',
  textInverse: '#FFFFFF',

  // Elderly-friendly high contrast
  elderlyPrimary: '#2D3748',
  elderlyBackground: '#FFFFFF',
  elderlyAccent: '#D69E2E',  // Gold for elderly UI
} as const

// ============================================================
// THAI LABELS
// ============================================================

export const LABELS = {
  // App
  appName: 'ดูแลดี',
  appTagline: 'ดูแลคนที่คุณรัก',

  // Roles
  roleElderly: 'ผู้สูงอายุ',
  roleFamily: 'สมาชิกในครอบครัว',
  roleCaregiver: 'ผู้ดูแล',

  // Navigation
  navHome: 'หน้าแรก',
  navMedication: 'ยา',
  navCheckin: 'เช็คอิน',
  navAppointments: 'นัดหมาย',
  navFamily: 'ครอบครัว',
  navSettings: 'ตั้งค่า',

  // Medications
  medTitle: 'รายการยา',
  medAdd: 'เพิ่มยา',
  medEdit: 'แก้ไขยา',
  medDelete: 'ลบยา',
  medName: 'ชื่อยา',
  medDosage: 'ขนาดยา',
  medTime: 'เวลากินยา',
  medBeforeFood: 'กินก่อนอาหาร',
  medAfterFood: 'กินหลังอาหาร',
  medWithFood: 'กินพร้อมอาหาร',
  medNotes: 'หมายเหตุ',
  medActive: 'ใช้งาน',
  medInactive: 'หยุดใช้',
  medConfirmTake: 'ยืนยันกินยาแล้ว',
  medSkipped: 'ข้าม',
  medPending: 'รอ确认',
  medConfirmed: 'กินแล้ว',
  medMissed: 'พลาด',
  medSchedule: 'ตารางยา',

  // Check-ins
  checkinTitle: 'เช็คอินสุขภาพ',
  checkinSubtitle: 'วันนี้รู้สึกอย่างไร?',
  checkinGood: 'สบายดี',
  checkinNotGood: 'ไม่ค่อยสบาย',
  checkinEmergency: 'ฉุกเฉิน',
  checkinSymptoms: 'อาการ',
  checkinNotes: 'หมายเหตุ',
  checkinHistory: 'ประวัติเช็คอิน',

  // Symptoms
  symptomHeadache: 'ปวดหัว',
  symptomDizziness: 'หน้ามืด',
  symptomTired: 'เหนื่อย',
  symptomFever: 'มีไข้',
  symptomCough: 'ไอ',
  symptomStomachache: 'ปวดท้อง',
  symptomChestPain: 'แน่นหน้าอก',
  symptomWeakness: 'อ่อนเพลีย',
  symptomInsomnia: 'นอนไม่หลับ',
  symptomNausea: 'คลื่นไส้',
  symptomSwelling: 'บวม',
  symptomBlurryVision: 'ตามัว',

  // Emergencies
  emergencyTitle: 'เหตุฉุกเฉิน',
  emergencyActive: 'ฉุกเฉิน - กำลังดำเนินการ',
  emergencyResolved: 'แก้ไขแล้ว',
  emergencyCall1669: 'โทร 1669',
  emergencyCallHospital: 'โทรโรงพยาบาล',
  emergencyNotifyFamily: 'แจ้งครอบครัว',

  // Appointments
  appointmentTitle: 'นัดหมายแพทย์',
  appointmentAdd: 'เพิ่มนัดหมาย',
  appointmentEdit: 'แก้ไขนัดหมาย',
  appointmentHospital: 'โรงพยาบาล',
  appointmentDepartment: 'แผนก',
  appointmentDoctor: 'แพทย์',
  appointmentDate: 'วันที่นัด',
  appointmentReminder: 'แจ้งเตือนล่วงหน้า',
  appointmentNotes: 'หมายเหตุ',
  appointmentDaysBefore: 'วันก่อนนัด',

  // Family
  familyTitle: 'ครอบครัว',
  familyAdd: 'เพิ่มสมาชิก',
  familyEdit: 'แก้ไขสมาชิก',
  familyRemove: 'ลบสมาชิก',
  familyName: 'ชื่อ',
  familyPhone: 'เบอร์โทร',
  familyAge: 'อายุ',

  // Common
  save: 'บันทึก',
  cancel: 'ยกเลิก',
  delete: 'ลบ',
  edit: 'แก้ไข',
  confirm: 'ยืนยัน',
  back: 'กลับ',
  next: 'ถัดไป',
  loading: 'กำลังโหลด...',
  error: 'เกิดข้อผิดพลาด',
  success: 'สำเร็จ',
  noData: 'ไม่มีข้อมูล',
  today: 'วันนี้',
  yesterday: 'เมื่อวาน',
  tomorrow: 'พรุ่งนี้',

  // Notifications
  notifMedReminder: 'แจ้งเตือนกินยา',
  notifCheckinReminder: 'แจ้งเตือนเช็คอิน',
  notifAppointmentReminder: 'แจ้งเตือนนัดหมาย',
  notifEmergencyAlert: 'แจ้งเหตุฉุกเฉิน',
  notifMedTaken: 'กินยาแล้ว',
  notifMedMissed: 'พลาดกินยา',
  notifCheckinGood: 'เช็คอิน - สบายดี',
  notifCheckinNotGood: 'เช็คอิน - ไม่ค่อยสบาย',
} as const

// ============================================================
// UX RULES & CONSTANTS
// ============================================================

export const UX_RULES = {
  // Font sizes (accessibility - elderly-friendly)
  fontSizeSmall: '14px',
  fontSizeBase: '16px',
  fontSizeMedium: '18px',
  fontSizeLarge: '20px',
  fontSizeXL: '24px',
  fontSizeXXL: '32px',

  // Minimum touch target (WCAG 2.5.8)
  minTouchTarget: '48px',

  // Breakpoints
  mobileMax: '640px',
  tabletMin: '641px',
  tabletMax: '1024px',
  desktopMin: '1025px',

  // Medication reminder schedule defaults
  defaultReminderMinutes: 15,     // Remind N minutes before scheduled time
  missedMedFollowUpMinutes: 30,   // Follow up N minutes after missed dose
  maxReminderRetries: 3,          // Max times to retry notification

  // Check-in schedule
  checkinReminderHour: 9,         // 09:00 daily reminder
  checkinDeadlineHour: 12,        // By noon if no check-in, alert family
  emergencyAlertIntervalMinutes: 5,

  // Appointment reminder
  defaultReminderDaysBefore: 1,
  defaultReminderHoursBefore: 2,  // Also remind on the day

  // Activity timeout
  sessionTimeoutMinutes: 60,

  // Animation
  animationDuration: '200ms',
  animationDurationSlow: '400ms',
} as const

// ============================================================
// NOTIFICATION CHANNELS
// ============================================================

export const NOTIFICATION_CHANNELS = {
  LINE: 'line',
  TELEGRAM: 'telegram',
  IN_APP: 'in_app',
  SMS: 'sms',
  PUSH: 'push',
} as const

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS]

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export const NOTIFICATION_TYPES = {
  MED_REMINDER: 'med_reminder',
  MED_TAKEN: 'med_taken',
  MED_MISSED: 'med_missed',
  CHECKIN_REMINDER: 'checkin_reminder',
  CHECKIN_GOOD: 'checkin_good',
  CHECKIN_NOT_GOOD: 'checkin_not_good',
  EMERGENCY_ALERT: 'emergency_alert',
  EMERGENCY_RESOLVED: 'emergency_resolved',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  APPOINTMENT_TODAY: 'appointment_today',
} as const

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

// ============================================================
// DEFAULT SYMPTOMS LIST
// ============================================================

export const DEFAULT_SYMPTOMS = [
  { id: 'headache', label: LABELS.symptomHeadache, emoji: '🤕' },
  { id: 'dizziness', label: LABELS.symptomDizziness, emoji: '😵' },
  { id: 'tired', label: LABELS.symptomTired, emoji: '😴' },
  { id: 'fever', label: LABELS.symptomFever, emoji: '🌡️' },
  { id: 'cough', label: LABELS.symptomCough, emoji: '😷' },
  { id: 'stomachache', label: LABELS.symptomStomachache, emoji: '🤢' },
  { id: 'chest_pain', label: LABELS.symptomChestPain, emoji: '💔' },
  { id: 'weakness', label: LABELS.symptomWeakness, emoji: '😩' },
  { id: 'insomnia', label: LABELS.symptomInsomnia, emoji: '😔' },
  { id: 'nausea', label: LABELS.symptomNausea, emoji: '🤮' },
  { id: 'swelling', label: LABELS.symptomSwelling, emoji: '🫧' },
  { id: 'blurry_vision', label: LABELS.symptomBlurryVision, emoji: '👁️' },
] as const

// ============================================================
// MEDICATION SCHEDULE PRESETS
// ============================================================

export const MED_TIMES_PRESETS = [
  { label: 'เช้า (08:00)', value: '08:00' },
  { label: 'กลางวัน (12:00)', value: '12:00' },
  { label: 'เย็น (18:00)', value: '18:00' },
  { label: 'ก่อนนอน (20:00)', value: '20:00' },
] as const

// ============================================================
// ENV VARS (reference only - for documentation)
// ============================================================

export const ENV_KEYS = {
  NEXT_PUBLIC_SUPABASE_URL: 'NEXT_PUBLIC_SUPABASE_URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  SUPABASE_SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY',
  LINE_CHANNEL_ACCESS_TOKEN: 'LINE_CHANNEL_ACCESS_TOKEN',
  LINE_CHANNEL_SECRET: 'LINE_CHANNEL_SECRET',
  TELEGRAM_BOT_TOKEN: 'TELEGRAM_BOT_TOKEN',
  CRON_SECRET: 'CRON_SECRET',
} as const
