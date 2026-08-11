"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createRoom, updateRoom } from "@/lib/api/rooms";
import {
  createBookingPrice,
  updateBookingPrice,
  deleteBookingPrice,
} from "@/lib/api/bookingPrices";

interface RoomFormValues {
  name: string;
  capacity: string;
  imageUrl: string;
  price: string;
}

interface RoomFormProps {
  room?: RoomFormValues & { id: number; hasBookingPrice: boolean };
}

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export function RoomForm({ room }: RoomFormProps) {
  const router = useRouter();
  const isEdit = Boolean(room);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RoomFormValues>(
    room ?? {
      name: "",
      capacity: "",
      imageUrl: "",
      price: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const syncPrice = async (roomId: number, price: number) => {
    if (!isEdit) return;

    if (price > 0) {
      if (room!.hasBookingPrice) {
        await updateBookingPrice(roomId, price);
      } else {
        await createBookingPrice({ roomId, price });
      }
    } else if (room!.hasBookingPrice) {
      await deleteBookingPrice(roomId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        capacity: Number(formData.capacity),
        imageUrl: formData.imageUrl,
      };
      const price = Number(formData.price) || 0;

      if (isEdit) {
        await updateRoom(room!.id, payload);
        await syncPrice(room!.id, price);
        toast.add({
          type: "success",
          title: "Ruangan Diperbarui",
          description: `Ruangan ${payload.name} berhasil diperbarui.`,
        });
      } else {
        const created = await createRoom(payload);
        if (price > 0) {
          await createBookingPrice({ roomId: created.id, price });
        }
        toast.add({
          type: "success",
          title: "Ruangan Dibuat",
          description: `Ruangan ${payload.name} berhasil ditambahkan.`,
        });
      }

      router.push("/admin/rooms");
    } catch (error) {
      toast.add({
        type: "error",
        title: isEdit ? "Gagal Memperbarui Ruangan" : "Gagal Membuat Ruangan",
        description: errorMessage(
          error,
          "Terjadi kesalahan sistem. Silakan coba lagi.",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="space-y-4">
        
        {/* Nama Ruangan */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-primary">
            Nama Ruangan <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Ruang Rapat 1"
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Kapasitas */}
        <div className="space-y-2">
          <label htmlFor="capacity" className="text-sm font-semibold text-primary">
            Kapasitas (Orang) <span className="text-red-500">*</span>
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            required
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Contoh: 10"
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Harga per Sesi */}
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-semibold text-primary">
            Harga / Sesi (Opsional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="Contoh: 50000"
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <p className="text-xs text-neutral-500">
            Kosongkan atau isi 0 jika ruangan bersifat reguler/gratis.
          </p>
        </div>

        {/* URL Gambar */}
        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm font-semibold text-primary">
            URL Gambar Ruangan
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Contoh: https://example.com/image.jpg"
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/rooms")}
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
              : "Simpan Ruangan"}
        </Button>
      </div>
    </form>
  );
}
