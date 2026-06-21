'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * SOSButton Component
 * 
 * Emergency SOS with 3-second long press to confirm.
 * Sends alert after confirmation.
 * WCAG AAA compliant with Thai-only interface.
 * 
 * Flow:
 * 1. User sees SOS button
 * 2. User presses and holds for 3 seconds
 * 3. Visual feedback shows progress
 * 4. Alert is sent
 * 5. Confirmation shown
 */

interface SOSButtonProps {
  onCancel: () => void;
}

export default function SOSButton({ onCancel }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handlePressStart = useCallback(() => {
    if (isAlertSent || isSending) return;
    
    setIsPressed(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    // Animate progress
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / 3000) * 100, 100);
      setProgress(newProgress);
    }, 50);

    // Set timeout for 3 seconds
    pressTimerRef.current = setTimeout(() => {
      // Clear interval
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      
      setProgress(100);
      setIsSending(true);
      
      // TODO: Send SOS alert to API/care center
      // Simulate sending alert
      setTimeout(() => {
        setIsAlertSent(true);
        setIsSending(false);
      }, 1000);
    }, 3000);
  }, [isAlertSent, isSending]);

  const handlePressEnd = useCallback(() => {
    if (isAlertSent || isSending) return;
    
    // Cancel the timers
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setIsPressed(false);
    setProgress(0);
  }, [isAlertSent, isSending]);

  // If alert sent, show confirmation
  if (isAlertSent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="text-center max-w-md w-full">
          <div className="mb-6" aria-hidden="true">
            <span className="text-8xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-[#2E7D32] mb-4">
            ส่งสัญญาณแล้ว!
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            ได้แจ้งเจ้าหน้าที่ดูแลแล้ว{' '}
            <span className="font-bold">กรุณารอสักครู่</span>
          </p>
          <p className="text-lg text-gray-500 mb-8">
            📞 เจ้าหน้าที่จะติดต่อกลับโดยเร็ว
          </p>
          
          {/* Back to menu button */}
          <button
            onClick={onCancel}
            className="
              w-full min-h-[100px] 
              bg-[#2E7D32] hover:bg-[#1B5E20] 
              text-white 
              text-2xl font-bold 
              rounded-2xl 
              shadow-lg 
              transition-all duration-200 
              flex items-center justify-center gap-3
              focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2
              active:scale-95
              touch-manipulation
            "
            aria-label="กลับไปเมนูหลัก"
          >
            <span className="text-3xl" aria-hidden="true">🏠</span>
            <span>กลับไปเมนู</span>
          </button>
        </div>
      </div>
    );
  }

  // SOS button view
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
      {/* Back button */}
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

      <div className="text-center max-w-md w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4" aria-hidden="true">
            <span className="text-8xl">🆘</span>
          </div>
          <h2 className="text-3xl font-bold text-[#D32F2F] mb-4">
            ขอความช่วยเหลือ
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            กดค้างไว้ 3 วินาทีเพื่อส่งสัญญาณ
          </p>
          <p className="text-lg text-gray-500">
            ปล่อยก่อน 3 วินาที = ยกเลิก
          </p>
        </div>

        {/* SOS Button with progress */}
        <div className="relative mb-8">
          {/* Progress ring background */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                #D32F2F ${progress * 3.6}deg,
                #E0E0E0 ${progress * 3.6}deg
              )`,
            }}
            aria-hidden="true"
          />
          
          {/* Inner button */}
          <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            disabled={isSending}
            className="
              relative z-10
              w-48 h-48 mx-auto
              bg-[#D32F2F] hover:bg-[#B71C1C]
              disabled:bg-gray-400
              text-white
              text-4xl font-bold
              rounded-full
              shadow-xl
              transition-all duration-200
              flex flex-col items-center justify-center gap-2
              focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-4
              touch-manipulation
              select-none
            "
            aria-label={isSending ? 'กำลังส่งสัญญาณ...' : 'กดค้างไว้ 3 วินาทีเพื่อส่งสัญญาณฉุกเฉิน'}
            aria-pressed={isPressed}
            aria-busy={isSending}
            role="button"
          >
            {isSending ? (
              <>
                <span className="text-5xl" aria-hidden="true">⏳</span>
                <span className="text-2xl">กำลังส่ง...</span>
              </>
            ) : (
              <>
                <span className="text-5xl" aria-hidden="true">🆘</span>
                <span className="text-2xl">กดค้าง</span>
                <span className="text-xl opacity-80">3 วินาที</span>
              </>
            )}
          </button>
        </div>

        {/* Progress indicator */}
        <div 
          className="mb-6" 
          role="progressbar" 
          aria-valuenow={Math.round(progress)} 
          aria-valuemin={0} 
          aria-valuemax={100}
          aria-label="ความคืบหน้าการส่งสัญญาณ"
        >
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-[#D32F2F] h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-lg text-gray-600 mt-2 font-semibold">
            {progress > 0 ? `${Math.round(progress)}%` : 'กดค้างเพื่อเริ่ม'}
          </p>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="
            w-full min-h-[80px] 
            bg-gray-200 hover:bg-gray-300 
            text-gray-800 
            text-2xl font-bold 
            rounded-2xl 
            transition-all duration-200 
            flex items-center justify-center gap-3
            focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2
            active:scale-95
            touch-manipulation
          "
          aria-label="ยกเลิก กลับไปเมนูหลัก"
        >
          <span className="text-2xl" aria-hidden="true">❌</span>
          <span>ยกเลิก</span>
        </button>
      </div>
    </div>
  );
}
