'use client'

import { useState } from 'react'
import type { Medication, MedicationSchedule } from '@/lib/types'
import { LABELS, MED_TIMES_PRESETS } from '@/lib/constants'

interface MedicationFormProps {
  medication?: Medication | null
  onSubmit: (data: {
    name: string
    dosage: string
    times: string[]
    before_after_food: MedicationSchedule | null
    notes: string
    is_active: boolean
  }) => void
  onCancel: () => void
  isLoading?: boolean
}

const foodScheduleOptions: { value: MedicationSchedule; label: string }[] = [
  { value: 'before', label: LABELS.medBeforeFood },
  { value: 'after', label: LABELS.medAfterFood },
  { value: 'with', label: LABELS.medWithFood },
]

export default function MedicationForm({
  medication,
  onSubmit,
  onCancel,
  isLoading = false,
}: MedicationFormProps) {
  const [name, setName] = useState(medication?.name || '')
  const [dosage, setDosage] = useState(medication?.dosage || '')
  const [times, setTimes] = useState<string[]>(medication?.times || [])
  const [foodSchedule, setFoodSchedule] = useState<MedicationSchedule | null>(
    medication?.before_after_food || null
  )
  const [notes, setNotes] = useState(medication?.notes || '')
  const [isActive, setIsActive] = useState(medication?.is_active ?? true)

  const toggleTime = (time: string) => {
    setTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time].sort()
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !dosage.trim() || times.length === 0) return
    onSubmit({
      name: name.trim(),
      dosage: dosage.trim(),
      times,
      before_after_food: foodSchedule,
      notes: notes.trim(),
      is_active: isActive,
    })
  }

  const isValid = name.trim() && dosage.trim() && times.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Medication Name */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.medName} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น พาราเซตามอล"
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
        />
      </div>

      {/* Dosage */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.medDosage} *
        </label>
        <input
          type="text"
          value={dosage}
         onChange={(e) => setDosage(e.target.value)}
          placeholder="เช่น 500 มก. 1 เม็ด"
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
        />
      </div>

      {/* Times */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-2">
          {LABELS.medTime} *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MED_TIMES_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => toggleTime(preset.value)}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 min-h-[48px] ${
                times.includes(preset.value)
                  ? 'bg-[#1565C0] text-white border-[#1565C0]'
                  : 'bg-white text-[#4A5568] border-[#E2E8F0] hover:border-[#1565C0]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        {times.length > 0 && (
          <p className="text-xs text-[#A0AEC0] mt-1.5">
            เลือกแล้ว: {times.join(', ')}
          </p>
        )}
      </div>

      {/* Food Schedule */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-2">
          กินกับอาหาร
        </label>
        <div className="space-y-2">
          {foodScheduleOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                foodSchedule === option.value
                  ? 'bg-blue-50 border-[#1565C0]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#1565C0]'
              }`}
            >
              <input
                type="radio"
                name="foodSchedule"
                value={option.value}
                checked={foodSchedule === option.value}
                onChange={() => setFoodSchedule(option.value)}
                className="w-4 h-4 text-[#1565C0]"
              />
              <span className="text-sm text-[#1A202C]">{option.label}</span>
            </label>
          ))}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              foodSchedule === null
                ? 'bg-gray-50 border-gray-300'
                : 'bg-white border-[#E2E8F0] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="foodSchedule"
              checked={foodSchedule === null}
              onChange={() => setFoodSchedule(null)}
              className="w-4 h-4 text-[#1565C0]"
            />
            <span className="text-sm text-[#4A5568]">ไม่ระบุ</span>
          </label>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-[#1A202C] mb-1.5">
          {LABELS.medNotes}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="หมายเหตุเพิ่มเติม..."
          rows={2}
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-base focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent resize-none"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            isActive ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              isActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-[#1A202C]">
          {isActive ? LABELS.medActive : LABELS.medInactive}
        </span>
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
