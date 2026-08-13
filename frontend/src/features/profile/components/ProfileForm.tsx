"use client";

import React, { useState } from "react";
import {
  User,
  EnvelopeSimple,
  Phone,
  IdentificationCard,
  GraduationCap,
  Student,
  LockKey,
  ArrowLeft,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export function ProfileForm() {
  const router = useRouter();
  
  // Data Awal (Simulasi dari DB)
  const initialData = {
    name: "Delano Manafe",
    studyProgram: "Ilmu Komputer",
  };

  const [name, setName] = useState(initialData.name);
  const [studyProgram, setStudyProgram] = useState(initialData.studyProgram);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    name !== initialData.name ||
    studyProgram !== initialData.studyProgram ||
    password !== "" ||
    confirmPassword !== "";

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      toast.add({
        type: "error",
        title: "Gagal Disimpan",
        description: "Kata sandi dan konfirmasi kata sandi tidak cocok.",
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Reset password fields setelah berhasil
      setPassword("");
      setConfirmPassword("");
      
      toast.add({
        type: "success",
        title: "Perubahan Disimpan",
        description: "Profil Anda telah berhasil diperbarui.",
      });
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAF9] pb-24 pt-10 md:pt-16">
      <div className="container mx-auto max-w-3xl px-4 md:px-8">
        <div className="flex flex-col gap-8">
          
          {/* HEADER */}
          <div className="flex flex-col items-start space-y-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#1C1917] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1C1917] tracking-tight">
                Edit Profil
              </h1>
              <p className="text-sm text-[#44403C]">
                Kelola informasi profil, kontak, dan kata sandi Anda.
              </p>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="flex flex-col gap-10 bg-white p-6 md:p-10 rounded-xl border border-border shadow-sm">
            
            {/* Bagian 1: Informasi Pribadi (Mahasiswa) */}
            <section className="space-y-6">
              <div className="border-b border-[#D6D3D1] pb-2">
                <h2 className="text-lg font-bold text-[#1C1917]">Informasi Pribadi</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Nama Lengkap (Bisa di-edit) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Email (Disabled) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="email"
                      defaultValue="delanomanafe@undana.ac.id"
                      disabled
                      className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                    />
                  </div>
                </div>

                {/* Program Studi (Bisa di-edit) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Program Studi
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="text"
                      value={studyProgram}
                      onChange={(e) => setStudyProgram(e.target.value)}
                      className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Status (Disabled) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Status Pengguna
                  </label>
                  <div className="relative">
                    <Student className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="text"
                      defaultValue="Mahasiswa"
                      disabled
                      className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                    />
                  </div>
                </div>

                {/* NIM (Disabled) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    NIM
                  </label>
                  <div className="relative">
                    <IdentificationCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="text"
                      defaultValue="199001012020121001"
                      disabled
                      className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                    />
                  </div>
                </div>

                {/* No. WhatsApp (Disabled) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    No. WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type="tel"
                      defaultValue="081234567890"
                      disabled
                      className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                    />
                  </div>
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan sandi baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi sandi baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Bagian 3: Actions */}
            <div className="pt-6 flex justify-end">
              <Button 
                type="button"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 font-semibold shadow-sm transition-transform"
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
