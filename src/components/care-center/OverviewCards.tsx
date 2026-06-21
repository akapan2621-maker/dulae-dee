"use client";

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  changeType: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
}

const stats: StatCard[] = [
  {
    label: "ผู้สูงอายุทั้งหมด",
    value: 48,
    change: "+2 คนใหม่เดือนนี้",
    changeType: "up",
    color: "bg-[#4527A0]",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: "เช็คอินวันนี้",
    value: 35,
    change: "73% ของทั้งหมด",
    changeType: "neutral",
    color: "bg-[#66BB6A]",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "แจ้งเตือนที่ต้องดูแล",
    value: 7,
    change: "3 เร่งด่วน",
    changeType: "up",
    color: "bg-[#EF5350]",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    label: "แก้ไขแล้ววันนี้",
    value: 12,
    change: "+3 จากเมื่อวาน",
    changeType: "up",
    color: "bg-[#42A5F5]",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p
                className={`text-sm mt-2 font-medium ${
                  stat.changeType === "up"
                    ? "text-green-600"
                    : stat.changeType === "down"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {stat.change}
              </p>
            </div>
            <div className={`${stat.color} text-white p-3 rounded-xl`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
