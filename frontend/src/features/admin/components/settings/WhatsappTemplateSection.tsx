"use client";

import React, { useState, useRef } from "react";
import {
  updateSystemSettings,
  DEFAULT_WHATSAPP_TEMPLATE,
  formatWhatsappTemplate,
} from "@/lib/api/settings";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatTeardropText,
  FloppyDisk,
  ArrowCounterClockwise,
  Sparkle,
  Checks,
} from "@phosphor-icons/react/dist/ssr";

const AVAILABLE_TAGS = [
  { tag: "{ruangan}", label: "Nama Ruangan", example: "Ruang Seminar" },
  { tag: "{tanggal}", label: "Tanggal Sewa", example: "Jumat, 11 September 2026" },
  { tag: "{sesi}", label: "Sesi Waktu", example: "Full-Day (08:00 - 17:00 WITA)" },
  { tag: "{total_biaya}", label: "Total Biaya", example: "Rp 750.000" },
  { tag: "{nama_pemesan}", label: "Nama Pemesan", example: "Budi Santoso" },
];

interface WhatsappTemplateSectionProps {
  initialTemplate?: string;
}

export function WhatsappTemplateSection({
  initialTemplate = DEFAULT_WHATSAPP_TEMPLATE,
}: WhatsappTemplateSectionProps) {
  const [savedTemplate, setSavedTemplate] = useState<string>(initialTemplate);
  const [template, setTemplate] = useState<string>(initialTemplate);
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isChanged = template.trim() !== savedTemplate.trim();

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

  const handleSave = async () => {
    const trimmed = template.trim();
    if (!trimmed) {
      toast.add({
        type: "warning",
        title: "Template Pesan Kosong",
        description: "Template pesan WhatsApp tidak boleh kosong.",
      });
      return;
    }

    setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  // Generator live preview WhatsApp
  const previewMessage = formatWhatsappTemplate(template, {
    ruangan: "Ruang Seminar",
    tanggal: "Jumat, 11 September 2026",
    sesi: "Full-Day (08:00 - 17:00 WITA)",
    total_biaya: "Rp 750.000",
    nama_pemesan: "Delano Manafe",
  });

  return (
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

          <div className="flex-1 rounded-xl bg-[#E5DDD5] p-4 flex flex-col justify-end border border-neutral-300 shadow-inner min-h-[260px] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#128C7E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

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

      <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving || !isChanged}
          className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-6"
        >
          <FloppyDisk size={18} weight="bold" />
          {isSaving ? "Menyimpan..." : "Simpan Template Pesan"}
        </Button>
      </div>
    </div>
  );
}
