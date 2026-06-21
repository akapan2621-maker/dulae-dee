"use client";

import { useState } from "react";

interface ElderlyPerson {
  id: number;
  name: string;
  age: number;
  room: string;
  checkInStatus: "checked-in" | "not-checked-in" | "late";
  medicationStatus: "taken" | "pending" | "missed";
  lastAlert: string | null;
  lastAlertTime: string | null;
}

const elderlyData: ElderlyPerson[] = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    age: 78,
    room: "A-101",
    checkInStatus: "checked-in",
    medicationStatus: "taken",
    lastAlert: null,
    lastAlertTime: null,
  },
  {
    id: 2,
    name: "สมหญิง รักสุข",
    age: 82,
    room: "A-102",
    checkInStatus: "checked-in",
    medicationStatus: "pending",
    lastAlert: "ยาลดความดัน - ยังไม่ได้รับประทาน",
    lastAlertTime: "09:30",
  },
  {
    id: 3,
    name: "วิชัย แข็งแรง",
    age: 75,
    room: "B-201",
    checkInStatus: "not-checked-in",
    medicationStatus: "missed",
    lastAlert: "ไม่ได้เช็คอินเช้า",
    lastAlertTime: "08:00",
  },
  {
    id: 4,
    name: "อรุณ เจริญสุข",
    age: 80,
    room: "B-202",
    checkInStatus: "checked-in",
    medicationStatus: "taken",
    lastAlert: null,
    lastAlertTime: null,
  },
  {
    id: 5,
    name: "จันทร์ สว่างใจ",
    age: 85,
    room: "C-301",
    checkInStatus: "late",
    medicationStatus: "pending",
    lastAlert: "อุณหภูมิสูง 38.5°C",
    lastAlertTime: "10:15",
  },
  {
    id: 6,
    name: "ประเสริฐ มั่งมี",
    age: 72,
    room: "C-302",
    checkInStatus: "checked-in",
    medicationStatus: "taken",
    lastAlert: null,
    lastAlertTime: null,
  },
  {
    id: 7,
    name: "ปราณี สุขสบาย",
    age: 79,
    room: "D-401",
    checkInStatus: "checked-in",
    medicationStatus: "taken",
    lastAlert: "ล้มในห้องน้ำ",
    lastAlertTime: "07:45",
  },
  {
    id: 8,
    name: "นิพนธ์ รื่นรมย์",
    age: 83,
    room: "D-402",
    checkInStatus: "not-checked-in",
    medicationStatus: "missed",
    lastAlert: "ไม่ได้เช็คอินเช้า",
    lastAlertTime: "08:00",
  },
];

const checkInBadge = (status: ElderlyPerson["checkInStatus"]) => {
  const styles = {
    "checked-in": "bg-green-100 text-green-700",
    "not-checked-in": "bg-red-100 text-red-700",
    late: "bg-yellow-100 text-yellow-700",
  };
  const labels = {
    "checked-in": "เช็คอินแล้ว",
    "not-checked-in": "ยังไม่เช็คอิน",
    late: "สาย",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const medicationBadge = (status: ElderlyPerson["medicationStatus"]) => {
  const styles = {
    taken: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    missed: "bg-red-100 text-red-700",
  };
  const labels = {
    taken: "รับประทานแล้ว",
    pending: "รอรับประทาน",
    missed: "พลาด",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function ElderlyTable() {
  const [search, setSearch] = useState("");

  const filtered = elderlyData.filter(
    (p) =>
      p.name.includes(search) ||
      p.room.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">รายชื่อผู้สูงอายุ</h2>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือห้อง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4527A0]/30 focus:border-[#4527A0] w-full sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">ชื่อ-นามสกุล</th>
              <th className="text-left px-5 py-3 font-semibold">อายุ</th>
              <th className="text-left px-5 py-3 font-semibold">ห้อง</th>
              <th className="text-left px-5 py-3 font-semibold">เช็คอิน</th>
              <th className="text-left px-5 py-3 font-semibold">ยา</th>
              <th className="text-left px-5 py-3 font-semibold">แจ้งเตือนล่าสุด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-medium text-gray-900">{person.name}</td>
                <td className="px-5 py-4 text-gray-600">{person.age} ปี</td>
                <td className="px-5 py-4">
                  <span className="bg-[#4527A0]/10 text-[#4527A0] px-2 py-1 rounded-lg text-xs font-semibold">
                    {person.room}
                  </span>
                </td>
                <td className="px-5 py-4">{checkInBadge(person.checkInStatus)}</td>
                <td className="px-5 py-4">{medicationBadge(person.medicationStatus)}</td>
                <td className="px-5 py-4">
                  {person.lastAlert ? (
                    <div>
                      <p className="text-gray-900 text-xs">{person.lastAlert}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{person.lastAlertTime}</p>
                    </div>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-10 text-center text-gray-400">
          ไม่พบข้อมูลที่ค้นหา
        </div>
      )}
    </div>
  );
}
