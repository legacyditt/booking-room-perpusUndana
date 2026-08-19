"use client";

import React from "react";
import type { SystemSettings } from "@/lib/api/settings";
import { WorkingDaysSection } from "./settings/WorkingDaysSection";
import { WhatsappContactSection } from "./settings/WhatsappContactSection";
import { WhatsappTemplateSection } from "./settings/WhatsappTemplateSection";

interface SettingsManagementProps {
  initialSettings: SystemSettings;
}

/**
 * Komponen Orchestrator Pengaturan Sistem Admin.
 * Menggabungkan sub-komponen terisolasi sesuai prinsip Separation of Concerns (SoC).
 */
export function SettingsManagement({
  initialSettings,
}: SettingsManagementProps) {
  return (
    <div className="space-y-8">
      {/* Baris 1: Pengaturan Hari Operasional & Nomor Kontak WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <WorkingDaysSection initialDays={initialSettings.days} />
        <WhatsappContactSection initialWhatsapp={initialSettings.whatsapp} />
      </div>

      {/* Baris 2: Editor Template Pesan WhatsApp Sewa Ruangan */}
      <WhatsappTemplateSection
        initialTemplate={initialSettings.whatsappTemplate}
      />
    </div>
  );
}
