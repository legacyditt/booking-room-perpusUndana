import { SettingsManagement } from "@/features/admin/components/SettingsManagement";
import { getSystemSettings } from "@/lib/api/settings";
import { getCookieHeader } from "@/lib/api/server";
import type { SystemSettings } from "@/lib/api/settings";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: SystemSettings = {
  days: ["senin", "selasa", "rabu", "kamis", "jumat"],
  whatsapp: "081234567890",
};

export default async function AdminSettingsPage() {
  let settings: SystemSettings = DEFAULT_SETTINGS;
  try {
    settings = await getSystemSettings((await getCookieHeader()).cookie);
  } catch {
    settings = DEFAULT_SETTINGS;
  }

  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
          Pengaturan Lainnya
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Kelola konfigurasi umum sistem, hari operasional layanan perpustakaan, dan narahubung pembayaran sewa.
        </p>
      </div>

      {/* ── Konten Pengaturan ── */}
      <SettingsManagement initialSettings={settings} />
    </div>
  );
}
