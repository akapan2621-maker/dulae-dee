'use client'

import { useState } from 'react'
import Link from 'next/link'
import AppointmentForm from '@/components/family/AppointmentForm'
import type { Appointment } from '@/lib/types'
import { LABELS } from '@/lib/constants'

// ============================================================
// Mock data — replace with Supabase queries
// ============================================================

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    family_member_id: 'mock-1',
    hospital: 'โรงพยาบาลศิริราช',
    department: 'แผนกหัวใจ',
    doctor_name: 'นพ. สมชาย ใจดี',
    appointment_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminder_days_before: 1,
    notes: 'เตรียมเอกสารผลเลือดย้อนหลัง 3 เดือน',
    created_at: new Date().toISOString(),
  },
  {
    id: 'apt-2',
    family_member_id: 'mock-1',
    hospital: 'โรงพยาบาลจุฬาลงกรณ์',
    department: 'แผนกตา',
    doctor_name: 'นพญ. สมหญิง รักดี',
    appointment_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminder_days_before: 2,
    notes: 'ตรวจสายตาประจำปี',
    created_at: new Date().toISOString(),
  },
  {
    id: 'apt-3',
    family_member_id: 'mock-1',
    hospital: 'โรงพยาบาลรามาธิบดี',
    department: 'แผนกกระดูก',
    doctor_name: null,
    appointment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminder_days_before: 1,
    notes: null,
    created_at: new Date().toISOString(),
  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const buddhistYear = date.getFullYear() + 543
  const day = date.getDate()
  const months = [
    'ม.ค.', 'ก.ค.',
    'ก.พ.', 'ส.ค.',
    'มี.ค.', 'ก.ย.',
    'เม.ย.', 'ต.ค.',
    'พ.ค.', 'พ.ย.',
    'มิ.ย.', 'ธ.ค.',
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

function getUrgencyBadge(days: number) {
  if (days < 0) {
    return { text: 'ผ่านแล้ว', style: 'bg-gray-100 text-gray-500' }
  }
  if (days === 0) {
    return { text: 'วันนี้!', style: 'bg-red-100 text-red-700' }
  }
  if (days <= 3) {
    return { text: `อีก ${days} วัน`, style: 'bg-amber-100 text-amber-700' }
  }
  return { text: `อีก ${days} วัน`, style: 'bg-blue-100 text-blue-700' }
}

function getCardBorder(days: number): string {
  if (days < 0) return 'border-gray-200'
  if (days <= 3) return 'border-amber-300'
  return 'border-[#E2E8F0]'
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [showForm, setShowForm] = useState(false)
  const [editingApt, setEditingApt] = useState<Appointment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Separate upcoming and past
  const upcoming = appointments
    .filter((a) => getDaysUntil(a.appointment_date) >= 0)
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())

  const past = appointments
    .filter((a) => getDaysUntil(a.appointment_date) < 0)
    .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())

  const handleAdd = (data: {
    hospital: string
    department: string
    doctor_name: string
    appointment_date: string
    reminder_days_before: number
    notes: string
  }) => {
    setIsSubmitting(true)
    setTimeout(() => {
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        family_member_id: 'mock-1',
        ...data,
        created_at: new Date().toISOString(),
      }
      setAppointments((prev) => [newApt, ...prev])
      setShowForm(false)
      setIsSubmitting(false)
    }, 500)
  }

  const handleEdit = (data: {
    hospital: string
    department: string
    doctor_name: string
    appointment_date: string
    reminder_days_before: number
    notes: string
  }) => {
    if (!editingApt) return
    setIsSubmitting(true)
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingApt.id ? { ...a, ...data } : a
        )
      )
      setEditingApt(null)
      setShowForm(false)
      setIsSubmitting(false)
    }, 500)
  }

  const handleDelete = (id: string) => {
    if (!confirm('คุณต้องการลบนัดหมายนี้ใช่หรือไม่?')) return
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1565C0] text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/family"
            className="flex items-center gap-2 text-white hover:text-blue-100"
          >
            <span className="text-xl">←</span>
            <span className="text-sm">{LABELS.back}</span>
          </Link>
          <h1 className="text-lg font-bold">{LABELS.appointmentTitle}</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-[#1A202C] mb-4">
              {editingApt ? LABELS.appointmentEdit : LABELS.appointmentAdd}
            </h2>
            <AppointmentForm
              appointment={editingApt}
              onSubmit={editingApt ? handleEdit : handleAdd}
              onCancel={() => {
                setShowForm(false)
                setEditingApt(null)
              }}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#1565C0] text-white font-medium text-base hover:bg-[#0D47A1] transition-colors flex items-center justify-center gap-2 mb-6 min-h-[48px]"
          >
            <span className="text-xl">+</span>
            {LABELS.appointmentAdd}
          </button>
        )}

        {/* Upcoming Appointments */}
        {upcoming.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-[#1A202C] mb-3">
              📅 นัดหมายที่กำลังจะมาถึง ({upcoming.length})
            </h2>
            <div className="space-y-3">
              {upcoming.map((apt) => {
                const days = getDaysUntil(apt.appointment_date)
                const badge = getUrgencyBadge(days)
                return (
                  <div
                    key={apt.id}
                    className={`bg-white rounded-xl border p-4 shadow-sm transition-all duration-200 ${getCardBorder(days)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#1A202C]">
                          {apt.hospital}
                        </h3>
                        {apt.department && (
                          <p className="text-sm text-[#4A5568]">{apt.department}</p>
                        )}
                        {apt.doctor_name && (
                          <p className="text-sm text-[#4A5568]">
                            {apt.doctor_name}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${badge.style}`}>
                        {badge.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[#4A5568] mb-3">
                      <span className="flex items-center gap-1">
                        📆 {formatDate(apt.appointment_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        🔔 ก่อน {apt.reminder_days_before} วัน
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-[#A0AEC0] mb-3">📝 {apt.notes}</p>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                      <button
                        onClick={() => {
                          setEditingApt(apt)
                          setShowForm(true)
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#1565C0] hover:bg-blue-50 transition-colors min-h-[36px]"
                      >
                        {LABELS.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors min-h-[36px]"
                      >
                        {LABELS.delete}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Past Appointments */}
        {past.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-[#1A202C] mb-3">
              📋 นัดหมายที่ผ่านมา ({past.length})
            </h2>
            <div className="space-y-3">
              {past.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm opacity-70"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[#1A202C]">
                        {apt.hospital}
                      </h3>
                      {apt.department && (
                        <p className="text-sm text-[#4A5568]">{apt.department}</p>
                      )}
                      {apt.doctor_name && (
                        <p className="text-sm text-[#4A5568]">{apt.doctor_name}</p>
                      )}
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-500 whitespace-nowrap">
                      ผ่านแล้ว
                    </span>
                  </div>
                  <p className="text-sm text-[#4A5568]">
                    📆 {formatDate(apt.appointment_date)}
                  </p>
                  <div className="flex items-center gap-2 pt-2 mt-2 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => {
                        setEditingApt(apt)
                        setShowForm(true)
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#1565C0] hover:bg-blue-50 transition-colors min-h-[36px]"
                    >
                      {LABELS.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors min-h-[36px]"
                    >
                      {LABELS.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {appointments.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-[#A0AEC0]">{LABELS.noData}</p>
          </div>
        )}
      </main>
    </div>
  )
}
