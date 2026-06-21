"use client";

import CareCenterHeader from "@/components/care-center/CareCenterHeader";
import OverviewCards from "@/components/care-center/OverviewCards";
import ElderlyTable from "@/components/care-center/ElderlyTable";
import AlertCenter from "@/components/care-center/AlertCenter";

export default function CareCenterPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <CareCenterHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Overview Section */}
        <section>
          <OverviewCards />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Elderly Table - takes 2 columns */}
          <section className="lg:col-span-2">
            <ElderlyTable />
          </section>

          {/* Alert Center - takes 1 column */}
          <section>
            <AlertCenter />
          </section>
        </div>
      </main>
    </div>
  );
}
