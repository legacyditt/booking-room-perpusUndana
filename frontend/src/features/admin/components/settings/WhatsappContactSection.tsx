"use client";

import React, { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  WhatsappLogo,
  FloppyDisk,
} from "@phosphor-icons/react/dist/ssr";
import { useUpdateSystemSettings } from "@/lib/hooks/use-update-system-settings";

interface WhatsappContactSectionProps {
  initialWhatsapp?: string;
}

export function WhatsappContactSection({
  initialWhatsapp = "081234567890",
}: WhatsappContactSectionProps) {
  const [savedWhatsapp, setSavedWhatsapp] = useState<string>(initialWhatsapp);
  const [whatsapp, setWhatsapp] = useState<string>(initialWhatsapp);

  const updateMutation = useUpdateSystemSettings();
  const isSaving = updateMutation.isPending;

  const isChanged = whatsapp.trim() !== savedWhatsapp.trim();

  const handleSave = () => {
    const trimmed = whatsapp.trim();
    if (!trimmed) {
      toast.add({
        type: "warning",
        title: "Nomor WhatsApp Kosong",
        description: "Mohon masukkan nomor WhatsApp yang valid.",
      });
      return;
    }

    updateMutation.mutate(
      { whatsapp: trimmed },
      {
        onSuccess: () => {
          setSavedWhatsapp(trimmed);
          toast.add({
            type: "success",
            title: "Nomor WhatsApp Disimpan",
            description:
              "Nomor narahubung sewa ruangan berhasil diperbarui dan disinkronkan ke halaman user.",
          });
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
          toast.add({
            type: "error",
            title: "Gagal Menyimpan Nomor WhatsApp",
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
          onClick={handleSave}
          disabled={isSaving || !isChanged}
          className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-6"
        >
          <FloppyDisk size={18} weight="bold" />
          {isSaving ? "Menyimpan..." : "Simpan Nomor WhatsApp"}
        </Button>
      </div>
    </div>
  );
}
