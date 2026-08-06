"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SessionFormValues {
  name: string;
  startTime: string;
  finishTime: string;
}

interface SessionFormProps {
  session?: SessionFormValues;
}

export function SessionForm({ session }: SessionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(session);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SessionFormValues>(
    session ?? {
      name: "",
      startTime: "",
      finishTime: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Ganti dengan pemanggilan API ke backend yang sebenarnya
    // const payload = { ...formData };

    // Simulasi loading API request
    setTimeout(() => {
      setIsSubmitting(false);
      // Kembali ke halaman daftar sesi
      router.push("/admin/sessions");
    }, 1000);
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
