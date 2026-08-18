"use client";

import React, { useState } from "react";
import { updateSystemSettings, SystemSettings } from "@/lib/api/settings";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarCheck,
  WhatsappLogo,
  FloppyDisk,
  Check,
  Info,
} from "@phosphor-icons/react/dist/ssr";

const DAYS = [
  { id: "senin", label: "Senin" },
  { id: "selasa", label: "Selasa" },
  { id: "rabu", label: "Rabu" },
  { id: "kamis", label: "Kamis" },
  { id: "jumat", label: "Jumat" },
  { id: "sabtu", label: "Sabtu" },
  { id: "minggu", label: "Minggu" },
];

interface SettingsManagementProps {
  initialSettings: SystemSettings;
}

export function SettingsManagement({
  initialSettings,
}: SettingsManagementProps) {
  // State Hari Operasional (Saved & Current)
  const [savedDays, setSavedDays] = useState<string[]>(
    initialSettings.days || ["senin", "selasa", "rabu", "kamis", "jumat"],
  );
  const [workingDays, setWorkingDays] = useState<string[]>(
    initialSettings.days || ["senin", "selasa", "rabu", "kamis", "jumat"],
  );
  const [isSavingDays, setIsSavingDays] = useState(false);

  // State Nomor WhatsApp (Saved & Current)
  const [savedWhatsapp, setSavedWhatsapp] = useState<string>(
    initialSettings.whatsapp || "081234567890",
  );
  const [whatsapp, setWhatsapp] = useState<string>(
    initialSettings.whatsapp || "081234567890",
  );
  const [isSavingWhatsapp, setIsSavingWhatsapp] = useState(false);

  // Cek apakah ada perubahan (dirty state)
  const isDaysChanged =
    workingDays.length !== savedDays.length ||
    !workingDays.every((d) => savedDays.includes(d));

  const isWhatsappChanged = whatsapp.trim() !== savedWhatsapp.trim();

  const toggleDay = (id: string) => {
    setWorkingDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleSaveWorkingDays = async () => {
    if (workingDays.length === 0) {
      toast.add({
        type: "warning",
        title: "Pilih Minimal 1 Hari",
        description: "Hari operasional perpustakaan tidak boleh kosong.",
      });
      return;
    }

    setIsSavingDays(true);
    try {
      await updateSystemSettings({ days: workingDays });
      setSavedDays([...workingDays]);
      toast.add({
        type: "success",
        title: "Pengaturan Hari Kerja Disimpan",
        description:
          "Pembaruan hari operasional berhasil disimpan ke dalam sistem.",
      });
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Gagal Menyimpan Hari Kerja",
        description: message,
      });
    } finally {
      setIsSavingDays(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    const trimmed = whatsapp.trim();
    if (!trimmed) {
      toast.add({
        type: "warning",
        title: "Nomor WhatsApp Kosong",
        description: "Mohon masukkan nomor WhatsApp yang valid.",
      });
      return;
    }

    setIsSavingWhatsapp(true);
    try {
      await updateSystemSettings({ whatsapp: trimmed });
      setSavedWhatsapp(trimmed);
      toast.add({
        type: "success",
        title: "Nomor WhatsApp Disimpan",
        description:
          "Nomor narahubung sewa ruangan berhasil diperbarui dan disinkronkan ke halaman user.",
      });
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Gagal Menyimpan Nomor WhatsApp",
        description: message,
      });
    } finally {
      setIsSavingWhatsapp(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── KARTU 1: Pengaturan Hari Operasional ── */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <CalendarCheck size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-primary">
                Hari Operasional
              </h2>
              <p className="text-sm text-neutral-500">
                Pilih hari kerja aktif perpustakaan dan layanan pemesanan ruangan.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {DAYS.map((day) => {
              const isActive = workingDays.includes(day.id);
              return (
                <label
                  key={day.id}
                  className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-lg cursor-pointer transition-all select-none ${
                    isActive
                      ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleDay(day.id)}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                      isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-neutral-300"
                    }`}
                  >
                    {isActive && <Check size={12} weight="bold" />}
                  </div>
                  <span className="text-sm">{day.label}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start gap-3">
            <Info size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              Hari yang tidak dicentang akan otomatis dinonaktifkan pada kalender
              pemilihan tanggal saat pengguna melakukan pemesanan kursi atau sewa ruangan.
            </p>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end">
          <Button
            onClick={handleSaveWorkingDays}
            disabled={isSavingDays}
            className="bg-primary text-white hover:bg-primary/90 gap-2 px-6"
          >
            <FloppyDisk size={18} weight="bold" />
            {isSavingDays ? "Menyimpan..." : "Simpan Hari Operasional"}
          </Button>
        </div>
      </div>

      {/* ── KARTU 2: Pengaturan Narahubung WhatsApp Sewa ── */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <WhatsappLogo size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-primary">
                Narahubung Sewa Ruangan
              </h2>
              <p className="text-sm text-neutral-500">
                Nomor WhatsApp admin yang ditampilkan ke user saat proses sewa ruangan.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Nomor WhatsApp Admin
              </label>
              <div className="relative">
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-neutral-50 focus:bg-white text-base py-5 pl-4"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">
                Format nomor yang disarankan: diawali 08... atau 628...
              </p>
            </div>

            {/* Preview Tampilan Modal User */}
            <div className="mt-4 p-4 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Preview Tampilan di Pembayaran User:
              </span>
              <div className="flex flex-col items-center justify-center p-3.5 bg-white border border-emerald-200 rounded-xl text-center shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
                  <WhatsappLogo size={15} weight="fill" className="text-[#25D366]" />
                  <span>Nomor WhatsApp Admin</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {whatsapp || "081234567890"}
                </span>
                <span className="text-[10px] text-emerald-700/80 mt-0.5 font-medium">
                  Klik nomor untuk langsung chat di WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end">
          <Button
            onClick={handleSaveWhatsapp}
            disabled={isSavingWhatsapp}
            className="bg-primary text-white hover:bg-primary/90 gap-2 px-6"
          >
            <FloppyDisk size={18} weight="bold" />
            {isSavingWhatsapp ? "Menyimpan..." : "Simpan Nomor WhatsApp"}
          </Button>
        </div>
      </div>
    </div>
  );
}
