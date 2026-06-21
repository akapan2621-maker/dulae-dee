'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MedicationForm from '@/components/family/MedicationForm'
import type { Medication, MedicationSchedule } from '@/lib/types'
import { LABELS, MED_TIMES_PRESETS } from '@/lib/constants'

// ============================================================
// Mock data — replace with Supabase queries
// ============================================================

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
  {
    id: 'med-3',
    family_member_id: 'mock-1',
    name: 'แอสไพริน',
    dosage: '80 มก. 1 เม็ด',
    times: ['08:00'],
    before_after_food: 'after',
    notes: 'ป้องกันลิ่มเลือด',
    is_active: false,
    created_at: new Date().toISOString(),
  },
]

function getFoodLabel(schedule: MedicationSchedule | null): string {
  switch (schedule) {
    case 'before': return LABELS.medBeforeFood
    case 'after': return LABELS.medAfterFood
    case 'with': return LABELS.medWithFood
    default: return '-'
  }
}

function getTimesLabels(times: string[]): string {
  return times
    .map((t) => {
      const preset = MED_TIMES_PRESETS.find((p) => p.value === t)
      return preset ? preset.label.split(' ')[0] : t
    })
    .join(', ')
}

export default function MedicationsPage() {
  const router = useRouter()
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS)
  const [showForm, setShowForm] = useState(false)
  const [editingMed, setEditingMed] = useState<Medication | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check URL for action=add
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('action') === 'add') {
      setShowForm(true)
    }
  }, [])

  const handleAdd = (data: {
    name: string
    dosage: string
    times: string[]
    before_after_food: MedicationSchedule | null
    notes: string
    is_active: boolean
  }) => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      const newMed: Medication = {
        id: `med-${Date.now()}`,
        family_member_id: 'mock-1',
        ...data,
        created_at: new Date().toISOString(),
      }
      setMedications((prev) => [newMed, ...prev])
      setShowForm(false)
      setIsSubmitting(false)
    }, 500)
  }

  const handleEdit = (data: {
    name: string
    dosage: string
    times: string[]
    before_after_food: MedicationSchedule | null
    notes: string
    is_active: boolean
  }) => {
    if (!editingMed) return
    setIsSubmitting(true)
    setTimeout(() => {
      setMedications((prev) =>
        prev.map((m) =>
          m.id === editingMed.id ? { ...m, ...data } : m
        )
      )
      setEditingMed(null)
      setShowForm(false)
      setIsSubmitting(false)
    }, 500)
  }

  const handleDelete = (id: string) => {
    if (!confirm('คุณต้องการลบยานี้ใช่หรือไม่?')) return
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, is_active: !m.is_active } : m
      )
    )
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
          <h1 className="text-lg font-bold">{LABELS.medTitle}</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-[#1A202C] mb-4">
              {editingMed ? LABELS.medEdit : LABELS.medAdd}
            </h2>
            <MedicationForm
              medication={editingMed}
              onSubmit={editingMed ? handleEdit : handleAdd}
              onCancel={() => {
                setShowForm(false)
                setEditingMed(null)
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
            {LABELS.medAdd}
          </button>
        )}

        {/* Medication List */}
        <div className="space-y-3">
          {medications.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
              <p className="text-3xl mb-2">💊</p>
              <p className="text-[#A0AEC0]">{LABELS.noData}</p>
            </div>
          ) : (
            medications.map((med) => (
              <div
                key={med.id}
                className={`bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm transition-all duration-200 ${
                  !med.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1A202C]">
                        {med.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          med.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {med.is_active ? LABELS.medActive : LABELS.medInactive}
                      </span>
                    </div>
                    <p className="text-sm text-[#4A5568] mt-1">{med.dosage}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-[#4A5568] mb-3">
                  <span className="flex items-center gap-1">
                    🕐 {getTimesLabels(med.times)}
                  </span>
                  <span className="flex items-center gap-1">
                    🍽️ {getFoodLabel(med.before_after_food)}
                  </span>
                </div>

                {med.notes && (
                  <p className="text-xs text-[#A0AEC0] mb-3">📝 {med.notes}</p>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => handleToggleActive(med.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#4A5568] hover:bg-gray-50 transition-colors min-h-[36px]"
                  >
                    {med.is_active ? LABELS.medInactive : LABELS.medActive}
                  </button>
                  <button
                    onClick={() => {
                      setEditingMed(med)
                      setShowForm(true)
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#1565C0] hover:bg-blue-50 transition-colors min-h-[36px]"
                  >
                    {LABELS.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors min-h-[36px]"
                  >
                    {LABELS.delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
