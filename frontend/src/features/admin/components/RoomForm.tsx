"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageSquare, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { uploadRoomImage } from "@/lib/api";
import { useCreateRoom } from "@/lib/hooks/use-create-room";
import { useUpdateRoom } from "@/lib/hooks/use-update-room";

interface RoomFormValues {
  name: string;
  capacity: string;
  imageUrl: string;
  price: string;
}

interface RoomFormProps {
  room?: RoomFormValues & { id: number };
  imageUrlDisplay?: string;
}

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export function RoomForm({ room, imageUrlDisplay }: RoomFormProps) {
  const router = useRouter();
  const isEdit = Boolean(room);
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    imageUrlDisplay ?? room?.imageUrl ?? "",
  );

  const [formData, setFormData] = useState<RoomFormValues>(
    room ?? {
      name: "",
      capacity: "",
      imageUrl: "",
      price: "",
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, price: rawValue }));
  };

  const formatRupiah = (value: string) => {
    if (!value) return "";
    return "Rp " + value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const { key } = await uploadRoomImage(imageFile);
        imageUrl = key;
      }

      const price = Number(formData.price) || 0;
      const payload = {
        name: formData.name,
        capacity: Number(formData.capacity),
        imageUrl,
        price,
      };

      if (isEdit) {
        updateMutation.mutate(
          { id: room!.id, ...payload },
          {
            onSuccess: () => {
              toast.add({
                type: "success",
                title: "Perubahan Disimpan",
                description: `Data ruang "${payload.name}" telah berhasil diperbarui ke dalam sistem.`,
              });
              router.push("/admin/rooms");
            },
            onError: (error) => {
              toast.add({
                type: "error",
                title: "Gagal Memperbarui Data",
                description: errorMessage(
                  error,
                  "Terjadi kesalahan saat menyimpan perubahan. Silakan coba beberapa saat lagi.",
                ),
              });
            },
          },
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => {
            toast.add({
              type: "success",
              title: "Ruangan Berhasil Ditambahkan",
              description: `Ruang "${payload.name}" kini sudah aktif dan tersedia untuk dipesan.`,
            });
            router.push("/admin/rooms");
          },
          onError: (error) => {
            toast.add({
              type: "error",
              title: "Gagal Menambahkan Ruangan",
              description: errorMessage(
                error,
                "Pastikan seluruh form terisi dengan benar, atau periksa koneksi internet Anda.",
              ),
            });
          },
        });
      }
    } catch (error) {
      toast.add({
        type: "error",
        title: isEdit ? "Gagal Memperbarui Data" : "Gagal Menambahkan Ruangan",
        description: errorMessage(
          error,
          isEdit
            ? "Terjadi kesalahan saat menyimpan perubahan. Silakan coba beberapa saat lagi."
            : "Pastikan seluruh form terisi dengan benar, atau periksa koneksi internet Anda.",
        ),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm space-y-6"
    >
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
          <label
            htmlFor="capacity"
            className="text-sm font-semibold text-primary"
          >
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
            type="text"
            value={formatRupiah(formData.price)}
            onChange={handlePriceChange}
            placeholder="Rp 50.000"
            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <p className="text-xs text-neutral-500">
            Kosongkan atau isi 0 jika ruangan bersifat reguler/gratis.
          </p>
        </div>

        {/* Gambar Ruangan */}
        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-semibold text-primary">
            Gambar Ruangan
          </label>
          <div className="flex items-start gap-4">
            <label
              htmlFor="image"
              className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
                previewUrl
                  ? "w-40 h-28"
                  : "w-full h-32 hover:border-primary/50 hover:bg-primary/5"
              } border-neutral-300 bg-neutral-50`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Pratinjau gambar ruangan"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-500">
                  <UploadSimple className="w-8 h-8" weight="duotone" />
                  <span className="text-sm">Pilih file gambar</span>
                  <span className="text-xs">JPG, PNG maks. 5MB</span>
                </div>
              )}
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {previewUrl && (
                <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <ImageSquare className="w-4 h-4" />
                  {imageFile ? imageFile.name : "Gambar tersimpan"}
                </p>
              )}
            </div>
          </div>
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
