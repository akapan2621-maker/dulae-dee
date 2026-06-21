'use client'

import { useState } from 'react'
import type { Appointment } from '@/lib/types'
import { LABELS } from '@/lib/constants'

interface AppointmentFormProps {
  appointment?: Appointment | null
  onSubmit: (data: {
    hospital: string
    department: string
    doctor_name: string
    appointment_date: string
    reminder_days_before: number
    notes: string
  }) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function AppointmentForm({
  appointment,
  onSubmit,
  onCancel,
  isLoading = false,
}: AppointmentFormProps) {
  const [hospital, setHospital] = useState(appointment?.hospital || '')
  const [department, setDepartment] = useState(appointment?.department || '')
  const [doctorName, setDoctorName] = useState(appointment?.doctor_name || '')
  const [appointmentDate, setAppointmentDate] = useState(
    appointment?.appointment_date || ''
  )
  const [reminderDays, setReminderDays] = useState(
    appointment?.reminder_days_before ?? 1
  )
  const [notes, setNotes] = useState(appointment?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hospital.trim() || !appointmentDate) return
    onSubmit({
      hospital: hospital.trim(),
      department: department.trim(),
      doctor_name: doctorName.trim(),
      appointment_date: appointmentDate,
      reminder_days_before: reminderDays,
      notes: notes.trim(),
    })
  }

  const isValid = hospital.trim() && appointmentDate

  // Get minimum date (today) for the date picker
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hospital */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.appointmentHospital} *
        </label>
        <input
          type="text"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          placeholder="เช่น โรงพยาบาลศิริราช"
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.appointmentDepartment}
        </label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="เช่น แผนกหัวใจ"
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
        />
      </div>

      {/* Doctor Name */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.appointmentDoctor}
        </label>
        <input
          type="text"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          placeholder="เช่น นพ. สมชาย ใจดี"
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
        />
      </div>

      {/* Appointment Date */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.appointmentDate} *
        </label>
        <input
          type="date"
          value={appointmentDate}
          min={today}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
        />
      </div>

      {/* Reminder Days */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.appointmentReminder}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={7}
            value={reminderDays}
            onChange={(e) => setReminderDays(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1565C0]"
          />
          <span className="text-base font-medium text-[#1A202C] min-w-[60px] text-right">
            {reminderDays} วัน
          </span>
        </div>
        <div className="flex justify-between text-xs text-[#A0AEC0] mt-1 px-0.5">
          <span>ไม่แจ้ง</span>
          <span>7 วัน</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.appointmentNotes}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="หมายเหตุ เช่น เตรียมเอกสาร, อดอาหารก่อนตรวจ..."
          rows={2}
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-lg border border-[#E2E8F0] text-[#4A5568] font-medium text-base hover:bg-gray-50 transition-colors min-h-[48px]"
        >
          {LABELS.cancel}
        </button>
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 py-3 px-4 rounded-lg bg-[#1565C0] text-white font-medium text-base hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
        >
          {isLoading ? LABELS.loading : LABELS.save}
        </button>
      </div>
    </form>
  )
}
