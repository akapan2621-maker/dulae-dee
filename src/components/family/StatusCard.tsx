'use client'

import type { CheckinStatus, MedicationLogStatus } from '@/lib/types'

interface StatusCardProps {
  title: string
  value: string
  subtitle?: string
  icon: string
  status?: 'good' | 'warning' | 'danger' | 'info'
  time?: string
}

const statusStyles: Record<string, string> = {
  good: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const statusDotColors: Record<string, string> = {
  good: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function StatusCard({
  title,
  value,
  subtitle,
  icon,
  status = 'info',
  time,
}: StatusCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${statusStyles[status]} transition-all duration-200 hover:shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium opacity-70">{title}</span>
          </div>
          <p className="text-base font-bold text-[#1A202C]">{value}</p>
          {subtitle && (
            <p className="text-sm text-[#4A5568] mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-2xl">{icon}</span>
          {time && (
            <span className="text-xs text-[#4A5568]">{time}</span>
          )}
          <span className={`w-2.5 h-2.5 rounded-full ${statusDotColors[status]}`} />
        </div>
      </div>
    </div>
  )
}
