'use client';

import { useState } from 'react';

/**
 * MedicationConfirm Component
 * 
 * Confirmation modal for medication intake.
 * Follows 2-Tap Rule: Confirm in one tap, done.
 * WCAG AAA compliant with Thai-only interface.
 */

interface MedicationConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MedicationConfirm({
  onConfirm,
  onCancel,
}: MedicationConfirmProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    // Small delay to show confirmation state
    setTimeout(() => {
      onConfirm();
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
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
      <div className="text-center max-w-md w-full">
        {/* Icon */}
        <div className="mb-6" aria-hidden="true">
          <span className="text-8xl">💊</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          กินยาแล้ว
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          กดปุ่มด้านล่างเพื่อยืนยันว่า{' '}
          <span className="font-bold text-[#2E7D32]">กินยาเรียบร้อยแล้ว</span>
        </p>

        {/* Confirm Button - Large, accessible */}
        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="
            w-full min-h-[120px] 
            bg-[#2E7D32] hover:bg-[#1B5E20] 
            disabled:bg-gray-400
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
          aria-label={isConfirming ? 'กำลังบันทึก...' : 'ยืนยันการกินยา'}
          aria-busy={isConfirming}
        >
          {isConfirming ? (
            <>
              <span className="text-4xl" aria-hidden="true">⏳</span>
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <span className="text-5xl" aria-hidden="true">✅</span>
              <span>ยืนยัน</span>
            </>
          )}
        </button>

        {/* Cancel link */}
        <button
          onClick={onCancel}
          className="
            mt-6 text-xl text-gray-500 hover:text-gray-700 
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
