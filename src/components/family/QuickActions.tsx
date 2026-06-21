'use client'

import { useRouter } from 'next/navigation'

interface QuickAction {
  label: string
  icon: string
  href: string
  color: string
}

const actions: QuickAction[] = [
  {
    label: 'เพิ่มยา',
    icon: '💊',
    href: '/family/medications?action=add',
    color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  },
  {
    label: 'ประวัติ',
    icon: '📋',
    href: '/family/medications',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  },
  {
    label: 'นัดหมาย',
    icon: '📅',
    href: '/family/appointments',
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  },
  {
    label: 'รายงาน',
    icon: '📊',
    href: '/family/reports',
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#1A202C] mb-4">
        ⚡ เข้าถึงด่วน
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 min-h-[80px] ${action.color}`}
          >
            <span className="text-2xl mb-1">{action.icon}</span>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
