"use client";

import React, { useState, useRef } from "react";
import {
  updateSystemSettings,
  SystemSettings,
  DEFAULT_WHATSAPP_TEMPLATE,
  formatWhatsappTemplate,
} from "@/lib/api/settings";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  WhatsappLogo,
  FloppyDisk,
  Check,
  Info,
  ChatTeardropText,
  ArrowCounterClockwise,
  Sparkle,
  Checks,
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

const AVAILABLE_TAGS = [
  { tag: "{ruangan}", label: "Nama Ruangan", example: "Ruang Seminar" },
  { tag: "{tanggal}", label: "Tanggal Sewa", example: "Jumat, 11 September 2026" },
  { tag: "{sesi}", label: "Sesi Waktu", example: "Full-Day (08:00 - 17:00 WITA)" },
  { tag: "{total_biaya}", label: "Total Biaya", example: "Rp 750.000" },
  { tag: "{nama_pemesan}", label: "Nama Pemesan", example: "Budi Santoso" },
];

interface SettingsManagementProps {
  initialSettings: SystemSettings;
}

export function SettingsManagement({
  initialSettings,
}: SettingsManagementProps) {
  // State Hari Operasional
  const [savedDays, setSavedDays] = useState<string[]>(
    initialSettings.days || ["senin", "selasa", "rabu", "kamis", "jumat"],
  );
  const [workingDays, setWorkingDays] = useState<string[]>(
    initialSettings.days || ["senin", "selasa", "rabu", "kamis", "jumat"],
  );
  const [isSavingDays, setIsSavingDays] = useState(false);

  // State Nomor WhatsApp
  const [savedWhatsapp, setSavedWhatsapp] = useState<string>(
    initialSettings.whatsapp || "081234567890",
  );
  const [whatsapp, setWhatsapp] = useState<string>(
    initialSettings.whatsapp || "081234567890",
  );
  const [isSavingWhatsapp, setIsSavingWhatsapp] = useState(false);

  // State Template Pesan WhatsApp
  const [savedTemplate, setSavedTemplate] = useState<string>(
    initialSettings.whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
  );
  const [template, setTemplate] = useState<string>(
    initialSettings.whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
  );
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dirty States
  const isDaysChanged =
    workingDays.length !== savedDays.length ||
    !workingDays.every((d) => savedDays.includes(d));

  const isWhatsappChanged = whatsapp.trim() !== savedWhatsapp.trim();
  const isTemplateChanged = template.trim() !== savedTemplate.trim();

  // Helper untuk toggle hari
  const toggleDay = (id: string) => {
    setWorkingDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  // Sisipkan variabel tag ke dalam textarea di posisi kursor
  const insertTag = (tag: string) => {
    if (!textareaRef.current) {
      setTemplate((prev) => prev + tag);
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = before + tag + after;
    setTemplate(newText);

    // Kembalikan fokus dan posisikan kursor setelah tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  // Simpan Hari Operasional
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

  // Simpan Nomor WhatsApp
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

  // Simpan Template Pesan WhatsApp
  const handleSaveTemplate = async () => {
    const trimmed = template.trim();
    if (!trimmed) {
      toast.add({
        type: "warning",
        title: "Template Pesan Kosong",
        description: "Template pesan WhatsApp tidak boleh kosong.",
      });
      return;
    }

    setIsSavingTemplate(true);
    try {
      await updateSystemSettings({ whatsappTemplate: trimmed });
      setSavedTemplate(trimmed);
      toast.add({
        type: "success",
        title: "Template WhatsApp Disimpan",
        description:
          "Format template pesan berhasil diperbarui untuk seluruh proses konfirmasi sewa user.",
      });
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Gagal Menyimpan Template",
        description: message,
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Live preview text generator
  const previewMessage = formatWhatsappTemplate(template, {
    ruangan: "Ruang Seminar",
    tanggal: "Jumat, 11 September 2026",
    sesi: "Full-Day (08:00 - 17:00 WITA)",
    total_biaya: "Rp 750.000",
    nama_pemesan: "Delano Manafe",
  });

  return (
    <div className="space-y-8">
      {/* ── BARIS 1: Hari Operasional & Nomor WhatsApp ── */}
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
              disabled={isSavingDays || !isDaysChanged}
              className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-6"
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
              disabled={isSavingWhatsapp || !isWhatsappChanged}
              className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-6"
            >
              <FloppyDisk size={18} weight="bold" />
              {isSavingWhatsapp ? "Menyimpan..." : "Simpan Nomor WhatsApp"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── BARIS 2: Template Pesan WhatsApp Sewa Ruangan (Full Width) ── */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ChatTeardropText size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-primary">
                Template Pesan WhatsApp Sewa
              </h2>
              <p className="text-sm text-neutral-500">
                Sesuaikan teks pesan otomatis yang digenerate ketika pengguna menekan tombol konfirmasi sewa ruangan.
              </p>
            </div>
          </div>

          {/* Tombol Reset ke Template Standar */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTemplate(DEFAULT_WHATSAPP_TEMPLATE)}
            className="gap-1.5 text-xs text-neutral-600 hover:text-primary self-start sm:self-auto"
          >
            <ArrowCounterClockwise size={14} />
            Reset ke Standar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Editor Template (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="template-editor"
                  className="text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                >
                  Editor Template Pesan
                </label>
                <span className="text-xs text-neutral-400">
                  {template.length} karakter
                </span>
              </div>

              <Textarea
                id="template-editor"
                ref={textareaRef}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={9}
                placeholder="Tulis format pesan WhatsApp..."
                className="bg-neutral-50 focus:bg-white text-sm font-sans leading-relaxed border-neutral-300 resize-y p-3.5 rounded-lg"
              />
            </div>

            {/* Sisipkan Variabel Otomatis (Chips) */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                <Sparkle size={15} weight="fill" className="text-amber-500" />
                <span>Klik untuk menyisipkan variabel dinamis ke kursor:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => insertTag(item.tag)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-white border border-neutral-300 text-primary hover:bg-primary/5 hover:border-primary transition-colors cursor-pointer shadow-2xs"
                    title={`Contoh isi: ${item.example}`}
                  >
                    <span>{item.tag}</span>
                    <span className="text-[10px] text-neutral-400 font-sans">
                      ({item.label})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Live Preview Chat Bubble (5 Kolom) */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Pratinjau Pesan Chat (Live Preview)
            </span>

            {/* Container Mockup WhatsApp */}
            <div className="flex-1 rounded-xl bg-[#E5DDD5] p-4 flex flex-col justify-end border border-neutral-300 shadow-inner min-h-[260px] relative overflow-hidden">
              {/* Wallpaper Pattern Subtle */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#128C7E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Chat Bubble Pengguna */}
              <div className="relative z-10 max-w-[95%] self-end bg-[#DCF8C6] text-neutral-800 rounded-lg p-3 shadow-xs text-xs space-y-1.5 border border-[#c3e6aa]">
                <p className="whitespace-pre-wrap leading-relaxed font-sans">
                  {previewMessage}
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-500 font-sans pt-0.5">
                  <span>09:41</span>
                  <Checks size={14} className="text-[#34B7F1]" weight="bold" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 mt-2 text-center">
              Variabel di dalam tanda kurung kurawal akan otomatis digantikan sesuai pemesanan pengguna.
            </p>
          </div>
        </div>

        {/* Footer Tombol Simpan */}
        <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end">
          <Button
            onClick={handleSaveTemplate}
            disabled={isSavingTemplate || !isTemplateChanged}
            className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-6"
          >
            <FloppyDisk size={18} weight="bold" />
            {isSavingTemplate ? "Menyimpan..." : "Simpan Template Pesan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
