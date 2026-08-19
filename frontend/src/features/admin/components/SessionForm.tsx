"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useCreateSession } from "@/lib/hooks/use-create-session";
import { useUpdateSession } from "@/lib/hooks/use-update-session";

interface SessionFormValues {
  name: string;
  startTime: string;
  finishTime: string;
  isSewaOnly?: boolean;
}

interface SessionFormProps {
  session?: SessionFormValues & { id: number };
}

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export function SessionForm({ session }: SessionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(session);
  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const [formData, setFormData] = useState<SessionFormValues>(
    session ?? {
      name: "",
      startTime: "",
      finishTime: "",
      isSewaOnly: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      startTime: formData.startTime,
      finishTime: formData.finishTime,
      isSewaOnly: formData.isSewaOnly,
    };

    const onSuccess = () => {
      toast.add({
        type: "success",
        title: isEdit ? "Perubahan Disimpan" : "Sesi Berhasil Ditambahkan",
        description: isEdit
          ? `Data sesi "${payload.name}" telah berhasil diperbarui ke dalam sistem.`
          : `Sesi "${payload.name}" kini sudah aktif dan tersedia untuk dipesan.`,
      });
      router.push("/admin/sessions");
    };

    const onError = (error: unknown) => {
      toast.add({
        type: "error",
        title: isEdit ? "Gagal Memperbarui Data" : "Gagal Menambahkan Sesi",
        description: errorMessage(
          error,
          isEdit
            ? "Terjadi kesalahan saat menyimpan perubahan. Silakan coba beberapa saat lagi."
            : "Pastikan seluruh form terisi dengan benar, atau periksa koneksi internet Anda."
        ),
      });
    };

    if (isEdit) {
      updateMutation.mutate({ id: session!.id, ...payload }, { onSuccess, onError });
    } else {
      createMutation.mutate(payload, { onSuccess, onError });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="space-y-4">

        {/* Nama Sesi */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-primary">
            Nama Sesi <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Sesi Pagi"
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Waktu Mulai */}
        <div className="space-y-2">
          <label htmlFor="startTime" className="text-sm font-semibold text-primary">
            Waktu Mulai <span className="text-red-500">*</span>
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Waktu Selesai */}
        <div className="space-y-2">
          <label htmlFor="finishTime" className="text-sm font-semibold text-primary">
            Waktu Selesai <span className="text-red-500">*</span>
          </label>
          <input
            id="finishTime"
            name="finishTime"
            type="time"
            required
            value={formData.finishTime}
            onChange={handleChange}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Checkbox Khusus Sewa */}
        <div className="flex items-center gap-3 mt-2">
          <input
            id="isSewaOnly"
            name="isSewaOnly"
            type="checkbox"
            checked={formData.isSewaOnly || false}
            onChange={handleChange}
            className="w-4 h-4 text-primary bg-neutral-100 border-neutral-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
          />
          <label htmlFor="isSewaOnly" className="text-sm font-medium text-neutral-700 cursor-pointer select-none">
            Khusus Sewa Ruangan <span className="text-neutral-500 font-normal text-xs ml-1">(Hanya tampil pada ruangan tipe sewa)</span>
          </label>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/sessions")}
          disabled={isSubmitting}
          className="font-semibold text-neutral-600 min-h-[44px]"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white hover:bg-primary/90 font-semibold min-h-[44px]"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan Sesi"}
        </Button>
      </div>
    </form>
  );
}
