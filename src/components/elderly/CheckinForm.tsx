'use client';

import { useState } from 'react';

/**
 * CheckinForm Component
 * 
 * Daily check-in form with symptom selection.
 * WCAG AAA compliant with Thai-only interface.
 * 
 * Symptoms (all in Thai):
 * - ปวดหัว (headache)
 * - หน้ามืด (dizziness)
 * - คลื่นไส้ (nausea)
 * - ปวดขา (leg pain)
 * - แน่นหน้าอก (chest pain)
 * - เหนื่อยง่าย (fatigue)
 */

interface Symptom {
  id: string;
  label: string;
  emoji: string;
}

const SYMPTOMS: Symptom[] = [
  { id: 'headache', label: 'ปวดหัว', emoji: '🤕' },
  { id: 'dizziness', label: 'หน้ามืด', emoji: '😵' },
  { id: 'nausea', label: 'คลื่นไส้', emoji: '🤢' },
  { id: 'leg-pain', label: 'ปวดขา', emoji: '🦵' },
  { id: 'chest-pain', label: 'แน่นหน้าอก', emoji: '💔' },
  { id: 'fatigue', label: 'เหนื่อยง่าย', emoji: '😫' },
];

interface CheckinFormProps {
  onSubmit: (symptoms: string[]) => void;
  onCancel: () => void;
}

export default function CheckinForm({ onSubmit, onCancel }: CheckinFormProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Small delay to show submission state
    setTimeout(() => {
      onSubmit(selectedSymptoms);
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-white overflow-y-auto">
      {/* Back button - WCAG AAA compliant */}
      <button
        onClick={onCancel}
        className="
          absolute top-4 left-4 
          min-w-[64px] min-h-[64px] 
          bg-gray-200 hover:bg-gray-300 
          text-gray-800 text-xl font-bold 
          rounded-full 
          flex items-center justify-center
          focus:outline-none focus:ring-4 focus:ring-gray-400
          touch-manipulation
        "
        aria-label="กลับไปเมนูหลัก"
      >
        ← กลับ
      </button>

      {/* Main content */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 pt-16">
          <div className="mb-4" aria-hidden="true">
            <span className="text-6xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            สบายดี
          </h2>
          <p className="text-xl text-gray-600 font-semibold">
            วันนี้เป็นอย่างไรบ้าง?
          </p>
        </div>

        {/* Symptom selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            มีอาการอะไรบ้าง?
          </h3>
          <p className="text-lg text-gray-500 mb-4 text-center">
            กดเลือกถ้ามีอาการ (ไม่เลือกก็ได้)
          </p>

          {/* Symptom buttons grid */}
          <div 
            className="grid grid-cols-2 gap-4" 
            role="group" 
            aria-label="เลือกอาการ"
          >
            {SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`
                    min-h-[100px] 
                    rounded-2xl 
                    border-4
                    ${isSelected
                      ? 'bg-[#2E7D32] border-[#1B5E20] text-white'
                      : 'bg-white border-gray-300 text-gray-800 hover:border-[#2E7D32]'
                    }
                    flex flex-col items-center justify-center gap-2
                    transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2
                    active:scale-95
                    touch-manipulation
                  `}
                  aria-pressed={isSelected}
                  aria-label={`${symptom.label}${isSelected ? ' - ได้เลือกแล้ว' : ''}`}
                  role="checkbox"
                >
                  <span className="text-4xl" aria-hidden="true">
                    {symptom.emoji}
                  </span>
                  <span className="text-xl font-bold">
                    {symptom.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* No symptoms message */}
        {selectedSymptoms.length === 0 && (
          <div className="text-center mb-6 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
            <p className="text-xl text-[#2E7D32] font-bold">
              🎉 ไม่มีอาการ ดีมาก!
            </p>
          </div>
        )}

        {/* Selected symptoms count */}
        {selectedSymptoms.length > 0 && (
          <div className="text-center mb-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
            <p className="text-xl text-yellow-700 font-bold">
              เลือก {selectedSymptoms.length} อาการ
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="
            w-full min-h-[100px] 
            bg-[#2E7D32] hover:bg-[#1B5E20] 
            disabled:bg-gray-400
            text-white 
            text-2xl font-bold 
            rounded-2xl 
            shadow-lg 
            transition-all duration-200 
            flex items-center justify-center gap-3
            focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2
            active:scale-95
            touch-manipulation
          "
          aria-label={isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลสุขภาพ'}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="text-3xl" aria-hidden="true">⏳</span>
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <span className="text-3xl" aria-hidden="true">💾</span>
              <span>บันทึก</span>
            </>
          )}
        </button>

        {/* Cancel link */}
        <button
          onClick={onCancel}
          className="
            mt-4 w-full text-xl text-gray-500 hover:text-gray-700 
            underline font-semibold
            min-h-[44px]
            focus:outline-none focus:ring-4 focus:ring-gray-300
          "
          aria-label="ยกเลิก กลับไปเมนูหลัก"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
