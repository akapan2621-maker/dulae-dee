"use client";

interface Alert {
  id: number;
  elderlyName: string;
  room: string;
  type: "emergency" | "medication" | "check-in" | "health";
  message: string;
  time: string;
  severity: "high" | "medium" | "low";
}

const alerts: Alert[] = [
  {
    id: 1,
    elderlyName: "จันทร์ สว่างใจ",
    room: "C-301",
    type: "health",
    message: "อุณหภูมิสูง 38.5°C ต้องตรวจสอบทันที",
    time: "10:15",
    severity: "high",
  },
  {
    id: 2,
    elderlyName: "ปราณี สุขสบาย",
    room: "D-401",
    type: "emergency",
    message: "ล้มในห้องน้ำ - ต้องการความช่วยเหลือ",
    time: "07:45",
    severity: "high",
  },
  {
    id: 3,
    elderlyName: "วิชัย แข็งแรง",
    room: "B-201",
    type: "check-in",
    message: "ไม่ได้เช็คอินเช้า - ติดตามสถานะ",
    time: "08:00",
    severity: "high",
  },
  {
    id: 4,
    elderlyName: "นิพนธ์ รื่นรมย์",
    room: "D-402",
    type: "check-in",
    message: "ไม่ได้เช็คอินเช้า - ติดตามสถานะ",
    time: "08:00",
    severity: "medium",
  },
  {
    id: 5,
    elderlyName: "สมหญิง รักสุข",
    room: "A-102",
    type: "medication",
    message: "ยาลดความดัน - ยังไม่ได้รับประทาน",
    time: "09:30",
    severity: "medium",
  },
  {
    id: 6,
    elderlyName: "จันทร์ สว่างใจ",
    room: "C-301",
    type: "medication",
    message: "ยาลดไข้ - ยังไม่ได้รับประทาน",
    time: "10:00",
    severity: "medium",
  },
];

const typeConfig = {
  emergency: { label: "ฉุกเฉิน", icon: "🚨", color: "bg-red-50 border-red-200" },
  medication: { label: "ยา", icon: "💊", color: "bg-orange-50 border-orange-200" },
  "check-in": { label: "เช็คอิน", icon: "📋", color: "bg-yellow-50 border-yellow-200" },
  health: { label: "สุขภาพ", icon: "🏥", color: "bg-blue-50 border-blue-200" },
};

const severityDot = (severity: Alert["severity"]) => {
  const colors = {
    high: "bg-red-500",
    medium: "bg-orange-400",
    low: "bg-green-400",
  };
  return <span className={`w-2 h-2 rounded-full ${colors[severity]} animate-pulse`} />;
};

export default function AlertCenter() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">ศูนย์แจ้งเตือน</h2>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        </div>
        <button className="text-sm text-[#4527A0] hover:text-[#311B92] font-medium transition-colors">
          ดูทั้งหมด →
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          return (
            <div
              key={alert.id}
              className={`p-4 border-l-4 ${
                alert.severity === "high"
                  ? "border-l-red-500"
                  : alert.severity === "medium"
                  ? "border-l-orange-400"
                  : "border-l-green-400"
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0 mt-0.5">{config.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {alert.elderlyName}
                      </span>
                      <span className="bg-[#4527A0]/10 text-[#4527A0] px-1.5 py-0.5 rounded text-xs font-semibold">
                        {alert.room}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color} border`}>
                        {config.label}
                      </span>
                      {severityDot(alert.severity)}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{alert.time}</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-green-100 rounded-lg transition-colors" title="แก้ไข">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="เลื่อน">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
