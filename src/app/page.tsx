import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏥</span>
          <span className="text-xl font-bold text-green-800">ดูแลดี</span>
        </div>
        <span className="text-sm text-gray-500">DulaeDee</span>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">👵❤️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ดูแลดี
        </h1>
        <p className="text-lg text-gray-600 max-w-md mb-2">
          ดูแลคนที่คุณรัก ผ่าน LINE
        </p>
        <p className="text-sm text-gray-500 max-w-sm mb-10">
          แจ้งยา บันทึกสุขภาพ ดูแลผู้สูงอายุในครอบครัว
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-10">
          <Link
            href="/elderly"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-green-100"
          >
            <span className="text-4xl">📱</span>
            <span className="font-semibold text-gray-800">ผู้สูงอายุ</span>
            <span className="text-xs text-gray-500 text-center">
              แจ้งยา กด Check-in ขอความช่วยเหลือ
            </span>
          </Link>

          <Link
            href="/family"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-blue-100"
          >
            <span className="text-4xl">👨‍👩‍👧‍👦</span>
            <span className="font-semibold text-gray-800">ครอบครัว</span>
            <span className="text-xs text-gray-500 text-center">
              ดู Dashboard จัดการยา นัดหมอ
            </span>
          </Link>

          <Link
            href="/care-center"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-purple-100"
          >
            <span className="text-4xl">🏥</span>
            <span className="font-semibold text-gray-800">ศูนย์ดูแล</span>
            <span className="text-xs text-gray-500 text-center">
              จัดการผู้ดูแล ดูแลหลายครอบครัว
            </span>
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-10">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> แจ้งยาอัตโนมัติ
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Check-in รายวัน
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> แจ้งฉุกเฉิน
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> นัดหมอ
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        © 2026 ดูแลดี (DulaeDee) — Powered by LINE
      </footer>
    </div>
  );
}
