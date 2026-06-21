'use client'

import { useEffect, useState } from 'react'

interface DashboardHeaderProps {
  memberName: string
  familyName?: string
}

function formatThaiDate(date: Date): string {
  const buddhistYear = date.getFullYear() + 543
  const day = date.getDate()
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ]
  const dayNames = [
    'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ',
    'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์',
  ]
  return `${dayNames[date.getDay()]}ที่ ${day} ${months[date.getMonth()]} ${buddhistYear}`
}

export default function DashboardHeader({ memberName, familyName }: DashboardHeaderProps) {
  const [thaiDate, setThaiDate] = useState('')

  useEffect(() => {
    setThaiDate(formatThaiDate(new Date()))
  }, [])

  return (
    <div className="bg-[#1565C0] text-white px-4 py-6 rounded-b-2xl shadow-md">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">ดูแลดี</h1>
            {familyName && (
              <p className="text-sm text-blue-100 opacity-80">{familyName}</p>
            )}
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            {memberName.charAt(0)}
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold">สวัสดี {memberName}</p>
          <p className="text-sm text-blue-100 opacity-80">{thaiDate}</p>
        </div>
      </div>
    </div>
  )
}
