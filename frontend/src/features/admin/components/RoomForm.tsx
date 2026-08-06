"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RoomForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    imageUrl: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Ganti dengan pemanggilan API ke backend yang sebenarnya
    // const payload = { ...formData, capacity: Number(formData.capacity), price: Number(formData.price) };
    
    // Simulasi loading API request
    setTimeout(() => {
      setIsSubmitting(false);
      // Kembali ke halaman daftar ruangan
      router.push("/admin/rooms");
    }, 1000);
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
          {isSubmitting ? "Menyimpan..." : "Simpan Ruangan"}
        </Button>
      </div>
    </form>
  );
}
