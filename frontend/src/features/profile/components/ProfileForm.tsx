"use client";

import React from "react";
import {
  User,
  EnvelopeSimple,
  Phone,
  IdentificationCard,
  LockKey,
  Camera,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast";

export function ProfileForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
     setTimeout(() => {
      setIsSaving(false);
      toast.add({
        type: "success",
        title: "Perubahan Disimpan",
        description: "Profil Anda telah berhasil diperbarui.",
      });
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAF9] pb-24 pt-10 md:pt-16">
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* ── KIRI: Header & Avatar (Col 4) ── */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#1C1917] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            <div className="text-center md:text-left space-y-2 mt-2">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1C1917] tracking-tight">
                Profil Anda
              </h1>
              <p className="text-sm text-[#44403C] max-w-[280px]">
                Kelola informasi pribadi, kontak, dan pengaturan keamanan akun Anda.
              </p>
            </div>

            <div className="relative group cursor-pointer">
              {/* Avatar Placeholder */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#E8ECF0] border-4 border-white flex items-center justify-center overflow-hidden relative shadow-sm">
                <span className="text-[#1C1917] font-serif font-bold text-4xl">
                  AP
                </span>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#1C1917]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera weight="fill" className="text-white w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col space-y-1">
              <span className="text-[#1C1917] font-semibold text-lg">Admin Perpustakaan</span>
              <span className="text-xs font-semibold text-[#A16207] uppercase tracking-wider bg-[#A16207]/10 w-fit px-2 py-0.5 rounded-sm">
                Admin
              </span>
            </div>
          </div>

          {/* ── KANAN: Form Area (Col 8) ── */}
          <div className="md:col-span-8 flex flex-col gap-12">
            
            {/* Bagian 1: Informasi Pribadi */}
            <section className="space-y-6">
              <div className="border-b border-[#D6D3D1] pb-2">
                <h2 className="text-lg font-bold text-[#1C1917]">Informasi Pribadi</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="text"
                      defaultValue="Admin Perpustakaan"
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-[#1C1917] focus-visible:border-[#1C1917] rounded-none transition-all shadow-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="email"
                      defaultValue="admin@undana.ac.id"
                      disabled
                      className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 rounded-none cursor-not-allowed shadow-none opacity-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    No. WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="tel"
                      defaultValue="081234567890"
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-[#1C1917] focus-visible:border-[#1C1917] rounded-none transition-all shadow-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider flex justify-between items-center">
                    <span>NIM / NIP / NIK</span>
                  </label>
                  <div className="relative">
                    <IdentificationCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="text"
                      defaultValue="199001012020121001"
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-[#1C1917] focus-visible:border-[#1C1917] rounded-none transition-all shadow-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#A16207] mt-1 font-medium">
                    Hanya ubah jika terdapat kesalahan.
                  </p>
                </div>
              </div>
            </section>

            {/* Bagian 2: Keamanan */}
            <section className="space-y-6">
              <div className="border-b border-[#D6D3D1] pb-2">
                <h2 className="text-lg font-bold text-[#1C1917]">Keamanan Akun</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="password"
                      placeholder="Masukkan sandi baru"
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-[#1C1917] focus-visible:border-[#1C1917] rounded-none transition-all shadow-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="password"
                      placeholder="Ulangi sandi baru"
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-[#1C1917] focus-visible:border-[#1C1917] rounded-none transition-all shadow-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bagian 3: Actions */}
            <div className="pt-6 flex justify-end">
              <Button 
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#1C1917] text-white hover:bg-[#1C1917]/90 h-12 px-8 rounded-none font-semibold shadow-none active:scale-[0.98] transition-transform"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
