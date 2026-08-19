"use client";

import React, { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  FloppyDisk,
  Check,
  Info,
} from "@phosphor-icons/react/dist/ssr";
import { useUpdateSystemSettings } from "@/lib/hooks/use-update-system-settings";

const DAYS = [
  { id: "senin", label: "Senin" },
  { id: "selasa", label: "Selasa" },
  { id: "rabu", label: "Rabu" },
  { id: "kamis", label: "Kamis" },
  { id: "jumat", label: "Jumat" },
  { id: "sabtu", label: "Sabtu" },
  { id: "minggu", label: "Minggu" },
];

interface WorkingDaysSectionProps {
  initialDays?: string[];
}

export function WorkingDaysSection({
  initialDays = ["senin", "selasa", "rabu", "kamis", "jumat"],
}: WorkingDaysSectionProps) {
  const [savedDays, setSavedDays] = useState<string[]>(initialDays);
  const [workingDays, setWorkingDays] = useState<string[]>(initialDays);

  const updateMutation = useUpdateSystemSettings();
  const isSaving = updateMutation.isPending;

  const isChanged =
    workingDays.length !== savedDays.length ||
    !workingDays.every((d) => savedDays.includes(d));

  const toggleDay = (id: string) => {
    setWorkingDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    if (workingDays.length === 0) {
      toast.add({
        type: "warning",
        title: "Pilih Minimal 1 Hari",
        description: "Hari operasional perpustakaan tidak boleh kosong.",
      });
      return;
    }

    updateMutation.mutate(
      { days: workingDays },
      {
        onSuccess: () => {
          setSavedDays([...workingDays]);
          toast.add({
            type: "success",
            title: "Pengaturan Hari Kerja Disimpan",
            description:
              "Pembaruan hari operasional berhasil disimpan ke dalam sistem.",
          });
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
          toast.add({
            type: "error",
            title: "Gagal Menyimpan Hari Kerja",
            description: message,
          });
        },
      },
    );
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
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
          onClick={handleSave}
          disabled={isSaving || !isChanged}
          className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-6"
        >
          <FloppyDisk size={18} weight="bold" />
          {isSaving ? "Menyimpan..." : "Simpan Hari Operasional"}
        </Button>
      </div>
    </div>
  );
}
