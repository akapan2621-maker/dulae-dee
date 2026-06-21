'use client';

/**
 * RichMenu Component
 * 
 * Main navigation for elderly users with 3 large buttons.
 * Follows WCAG AAA compliance and Thai-only interface.
 * 
 * UX Rules:
 * - 2-Tap Rule: Every action requires max 2 taps
 * - Thai-Only: All text in Thai
 * - No Scroll: All content visible in one screen
 * - WCAG AAA: 7:1 contrast ratio, 44px+ touch targets (using 64px+ for elderly)
 */

interface RichMenuProps {
  onSelectMedication: () => void;
  onSelectCheckin: () => void;
  onSelectSOS: () => void;
}

export default function RichMenu({
  onSelectMedication,
  onSelectCheckin,
  onSelectSOS,
}: RichMenuProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏠 ดูแลดี
        </h1>
        <p className="text-xl text-gray-600 font-semibold">
          เลือกสิ่งที่ต้องการ
        </p>
      </header>

      {/* 3 Large Buttons - WCAG AAA compliant */}
      <nav 
        className="flex flex-col gap-4 w-full max-w-md" 
        role="navigation" 
        aria-label="เมนูหลัก"
      >
        {/* Button 1: Medication */}
        <button
          onClick={onSelectMedication}
          className="
            w-full min-h-[120px] 
            bg-[#2E7D32] hover:bg-[#1B5E20] 
            text-white 
            text-3xl font-bold 
            rounded-2xl 
            shadow-lg 
            transition-all duration-200 
            flex items-center justify-center gap-4
            focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2
            active:scale-95
            touch-manipulation
          "
          aria-label="กินยาแล้ว - ยืนยันการกินยา"
          role="button"
        >
          <span className="text-5xl" aria-hidden="true">💊</span>
          <span>กินยาแล้ว</span>
        </button>

        {/* Button 2: Check-in */}
        <button
          onClick={onSelectCheckin}
          className="
            w-full min-h-[120px] 
            bg-[#2E7D32] hover:bg-[#1B5E20] 
            text-white 
            text-3xl font-bold 
            rounded-2xl 
            shadow-lg 
            transition-all duration-200 
            flex items-center justify-center gap-4
            focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2
            active:scale-95
            touch-manipulation
          "
          aria-label="สบายดี - บันทึกสุขภาพประจำวัน"
          role="button"
        >
          <span className="text-5xl" aria-hidden="true">✅</span>
          <span>สบายดี</span>
        </button>

        {/* Button 3: SOS Emergency */}
        <button
          onClick={onSelectSOS}
          className="
            w-full min-h-[120px] 
            bg-[#D32F2F] hover:bg-[#B71C1C] 
            text-white 
            text-3xl font-bold 
            rounded-2xl 
            shadow-lg 
            transition-all duration-200 
            flex items-center justify-center gap-4
            focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2
            active:scale-95
            touch-manipulation
            animate-pulse
          "
          aria-label="ช่วยด้วย - ขอความช่วยเหลือฉุกเฉิน"
          role="button"
        >
          <span className="text-5xl" aria-hidden="true">🆘</span>
          <span>ช่วยด้วย</span>
        </button>
      </nav>

      {/* Time display for reassurance */}
      <div className="mt-6 text-center">
        <CurrentTime />
      </div>
    </div>
  );
}

/**
 * CurrentTime - Shows current time to provide reassurance
 * Helps elderly users know the system is working
 */
function CurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateString = now.toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-gray-500" role="status" aria-live="polite">
      <p className="text-lg font-semibold">{timeString} น.</p>
      <p className="text-sm">{dateString}</p>
    </div>
  );
}
