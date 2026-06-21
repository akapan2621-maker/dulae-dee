'use client'

import type { Appointment } from '@/lib/types'

interface NextAppointmentProps {
  appointment: Appointment | null
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const buddhistYear = date.getFullYear() + 543
  const day = date.getDate()
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
    'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
    'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ]
  return `${day} ${months[date.getMonth()]} ${buddhistYear}`
}

function getDaysUntil(dateStr: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getUrgencyColor(days: number): string {
  if (days <= 0) return 'text-red-600 bg-red-50 border-red-200'
  if (days <= 3) return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-[#1565C0] bg-blue-50 border-blue-200'
}

function getUrgencyLabel(days: number): string {
  if (days < 0) return 'เลยวันนัดแล้ว'
  if (days === 0) return 'วันนี้!'
  if (days === 1) return 'พรุ่งนี้'
  return `อีก ${days} วัน`
}

export default function NextAppointment({ appointment }: NextAppointmentProps) {
  if (!appointment) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <h3 className="text-lg font-bold text-[#1A202C] mb-3">
          📅 นัดหมายถัดไป
        </h3>
        <div className="text-center py-6">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-[#A0AEC0]">ไม่มีนัดหมายที่กำหนดไว้</p>
        </div>
      </div>
    )
  }

  const days = getDaysUntil(appointment.appointment_date)
  const urgency = getUrgencyColor(days)

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#1A202C] mb-3">
        📅 นัดหมายถัดไป
      </h3>

      <div className={`rounded-lg border p-4 ${urgency}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-base font-bold text-[#1A202C]">
              {appointment.hospital}
            </p>
            {appointment.department && (
              <p className="text-sm text-[#4A5568]">{appointment.department}</p>
            )}
            {appointment.doctor_name && (
              <p className="text-sm text-[#4A5568]">นพ./นพญ. {appointment.doctor_name}</p>
            )}
          </div>
          <span className="text-sm font-bold whitespace-nowrap ml-2">
            {getUrgencyLabel(days)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span>📆</span>
            <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
          </div>
        </div>

        {appointment.notes && (
          <p className="text-sm text-[#4A5568] mt-2 pt-2 border-t border-current/10">
            📝 {appointment.notes}
          </p>
        )}
      </div>
    </div>
  )
}
