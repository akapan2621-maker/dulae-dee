'use client'

import { useEffect, useState } from 'react'
import DashboardHeader from '@/components/family/DashboardHeader'
import StatusCard from '@/components/family/StatusCard'
import WeeklySummary from '@/components/family/WeeklySummary'
import NextAppointment from '@/components/family/NextAppointment'
import QuickActions from '@/components/family/QuickActions'
import type { FamilyMember, Medication, Appointment, Checkin } from '@/lib/types'

// ============================================================
// Mock data for demo — replace with Supabase queries
// ============================================================

const MOCK_MEMBER: FamilyMember = {
  id: 'mock-1',
  family_id: 'family-1',
  name: 'สมศักดิ์',
  role: 'elderly',
  age: 72,
  phone: '081-234-5678',
  line_user_id: null,
  telegram_id: null,
  created_at: new Date().toISOString(),
}

const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    family_member_id: 'mock-1',
    name: 'พาราเซตามอล',
    dosage: '500 มก. 1 เม็ด',
    times: ['08:00', '20:00'],
    before_after_food: 'after',
    notes: 'กินหลังอาหาร',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'med-2',
    family_member_id: 'mock-1',
    name: 'เมตฟอร์มิน',
    dosage: '500 มก. 1 เม็ด',
    times: ['08:00', '18:00'],
    before_after_food: 'with',
    notes: 'กินพร้อมอาหาร',
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

const MOCK_APPOINTMENT: Appointment = {
  id: 'apt-1',
  family_member_id: 'mock-1',
  hospital: 'โรงพยาบาลศิริราช',
  department: 'แผนกหัวใจ',
  doctor_name: 'สมชาย ใจดี',
  appointment_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  reminder_days_before: 1,
  notes: 'เตรียมเอกสารผลเลือดย้อนหลัง 3 เดือน',
  created_at: new Date().toISOString(),
}

function getCheckinStatusText(status: string): string {
  switch (status) {
    case 'good':
      return 'สบายดี 😊'
    case 'not_good':
      return 'ไม่ค่อยสบาย 😟'
    case 'emergency':
      return 'ฉุกเฉิน 🚨'
    default:
      return 'ยังไม่ได้เช็คอิน'
  }
}

function getCheckinStatusVariant(status: string): 'good' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'good':
      return 'good'
    case 'not_good':
      return 'warning'
    case 'emergency':
      return 'danger'
    default:
      return 'info'
  }
}

function getMedicationStatusText(meds: Medication[]): string {
  const activeCount = meds.filter((m) => m.is_active).length
  return `${activeCount} รายการ`
}

function getMedicationStatusVariant(meds: Medication[]): 'good' | 'warning' | 'info' {
  const activeCount = meds.filter((m) => m.is_active).length
  if (activeCount > 0) return 'good'
  return 'info'
}

export default function FamilyDashboardPage() {
  const [member, setMember] = useState<FamilyMember>(MOCK_MEMBER)
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS)
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(MOCK_APPOINTMENT)
  const [todayCheckin, setTodayCheckin] = useState<Checkin | null>(null)

  // In production, fetch from Supabase using LINe user ID
  // useEffect(() => { ... }, [])

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <DashboardHeader
        memberName={member.name}
        familyName="ครอบครัวของเรา"
      />

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Status Cards */}
        <section>
          <h2 className="text-base font-bold text-[#1A202C] mb-3">
            สถานะวันนี้
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <StatusCard
              title="เช็คอินวันนี้"
              value={
                todayCheckin
                  ? getCheckinStatusText(todayCheckin.status)
                  : 'ยังไม่ได้เช็คอิน'
              }
              subtitle={
                todayCheckin?.notes || 'รอการเช็คอินประจำวัน'
              }
              icon={todayCheckin?.status === 'good' ? '✅' : '📋'}
              status={
                todayCheckin
                  ? getCheckinStatusVariant(todayCheckin.status)
                  : 'info'
              }
              time="09:00"
            />

            <StatusCard
              title="สถานะกินยา"
              value={getMedicationStatusText(medications)}
              subtitle={
                medications.filter((m) => m.is_active).length > 0
                  ? `กำหนดกิน ${medications.filter((m) => m.is_active).reduce((acc, m) => acc + m.times.length, 0)} ครั้ง/วัน`
                  : 'ไม่มียาที่ต้องกิน'
              }
              icon="💊"
              status={getMedicationStatusVariant(medications)}
            />

            <StatusCard
              title="เวลาล่าสุด"
              value={new Date().toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              subtitle="อัปเดตอัตโนมัติ"
              icon="🕐"
              status="info"
            />
          </div>
        </section>

        {/* Weekly Summary */}
        <WeeklySummary
          stats={{
            medicationAdherence: 85,
            checkinPercentage: 71,
            emergencyCount: 0,
            medicationTaken: 11,
            medicationTotal: 14,
            checkinCount: 5,
            checkinTotal: 7,
          }}
        />

        {/* Next Appointment */}
        <NextAppointment appointment={nextAppointment} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Bottom spacing for mobile nav */}
        <div className="h-20" />
      </main>
    </div>
  )
}
