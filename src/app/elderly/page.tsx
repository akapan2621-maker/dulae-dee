'use client';

import { useState } from 'react';
import RichMenu from '@/components/elderly/RichMenu';
import MedicationConfirm from '@/components/elderly/MedicationConfirm';
import CheckinForm from '@/components/elderly/CheckinForm';
import SOSButton from '@/components/elderly/SOSButton';

export default function ElderlyPage() {
  const [activeView, setActiveView] = useState<'menu' | 'medication' | 'checkin' | 'sos'>('menu');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-yellow-300 focus:text-black focus:p-4 focus:rounded-lg focus:text-lg"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <main
        id="main-content"
        className="flex-1 flex flex-col"
        role="main"
        aria-label="หน้าหลักสำหรับผู้สูงอายุ"
      >
        {activeView === 'menu' && (
          <RichMenu
            onSelectMedication={() => setActiveView('medication')}
            onSelectCheckin={() => setActiveView('checkin')}
            onSelectSOS={() => setActiveView('sos')}
          />
        )}

        {activeView === 'medication' && (
          <MedicationConfirm
            onConfirm={() => {
              // TODO: Send medication confirmation to API
              alert('บันทึกการกินยาเรียบร้อยแล้ว!');
              setActiveView('menu');
            }}
            onCancel={() => setActiveView('menu')}
          />
        )}

        {activeView === 'checkin' && (
          <CheckinForm
            onSubmit={(symptoms) => {
              // TODO: Send check-in data to API
              alert('บันทึกข้อมูลสุขภาพเรียบร้อยแล้ว!');
              setActiveView('menu');
            }}
            onCancel={() => setActiveView('menu')}
          />
        )}

        {activeView === 'sos' && (
          <SOSButton
            onCancel={() => setActiveView('menu')}
          />
        )}
      </main>

      {/* Footer with status */}
      <footer className="bg-gray-100 p-3 text-center" role="contentinfo">
        <p className="text-sm text-gray-600 font-bold">
          ดูแลดี — ดูแลผู้สูงอายุที่คุณรัก
        </p>
      </footer>
    </div>
  );
}
