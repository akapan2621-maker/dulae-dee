'use client'

interface WeeklyStats {
  medicationAdherence: number // 0-100
  checkinPercentage: number   // 0-100
  emergencyCount: number
  medicationTaken: number
  medicationTotal: number
  checkinCount: number
  checkinTotal: number
}

interface WeeklySummaryProps {
  stats: WeeklyStats
}

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  )
}

function getAdherenceColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500'
  if (pct >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function getAdherenceLabel(pct: number): string {
  if (pct >= 80) return 'ดีมาก'
  if (pct >= 50) return 'ปานกลาง'
  return 'ต้องปรับปรุง'
}

export default function WeeklySummary({ stats }: WeeklySummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#1A202C] mb-4">
        📊 สรุปรายสัปดาห์
      </h3>

      {/* Medication Adherence */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#4A5568]">💊 อัตรากินยา</span>
          <span className="text-sm font-bold text-[#1A202C]">
            {stats.medicationAdherence}%
            <span className="text-xs font-normal ml-1 text-[#4A5568]">
              ({getAdherenceLabel(stats.medicationAdherence)})
            </span>
          </span>
        </div>
        <ProgressBar
          percentage={stats.medicationAdherence}
          color={getAdherenceColor(stats.medicationAdherence)}
        />
        <p className="text-xs text-[#A0AEC0] mt-1">
          กินแล้ว {stats.medicationTaken} / {stats.medicationTotal} ครั้ง
        </p>
      </div>

      {/* Check-in Percentage */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#4A5568]">✅ อัตราเช็คอิน</span>
          <span className="text-sm font-bold text-[#1A202C]">
            {stats.checkinPercentage}%
          </span>
        </div>
        <ProgressBar
          percentage={stats.checkinPercentage}
          color="bg-[#1565C0]"
        />
        <p className="text-xs text-[#A0AEC0] mt-1">
          เช็คอินแล้ว {stats.checkinCount} / {stats.checkinTotal} วัน
        </p>
      </div>

      {/* Emergency Count */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚨</span>
          <span className="text-sm font-medium text-[#4A5568]">เหตุฉุกเฉิน</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#1A202C]">
            {stats.emergencyCount}
          </span>
          <span className="text-xs text-[#A0AEC0]">ครั้ง</span>
        </div>
      </div>
    </div>
  )
}
