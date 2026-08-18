"use client";

import React, { useEffect, useState } from "react";
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
import { authClient, useSession } from "@/lib/api/auth-client";

const statusLabel = (status?: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

export function ProfileForm() {
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name ?? "");
  const [studyProgram, setStudyProgram] = useState(user?.affiliation ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setStudyProgram(user.affiliation ?? "");
    }
  }, [user?.name, user?.affiliation]);

  const affiliationLabel = user?.status === "umum" ? "Instansi" : "Program Studi";

  const hasChanges =
    name !== (user?.name ?? "") ||
    studyProgram !== (user?.affiliation ?? "") ||
    currentPassword !== "" ||
    password !== "" ||
    confirmPassword !== "";

  const handleSave = async () => {
    if (password && password.length < 8) {
      toast.add({
        type: "error",
        title: "Gagal Disimpan",
        description: "Kata sandi baru minimal harus 8 karakter.",
      });
      return;
    }

    if (password && password !== confirmPassword) {
      toast.add({
        type: "error",
        title: "Gagal Disimpan",
        description: "Kata sandi dan konfirmasi kata sandi tidak cocok.",
      });
      return;
    }

    if (password && !currentPassword) {
      toast.add({
        type: "error",
        title: "Gagal Disimpan",
        description: "Kata sandi saat ini wajib diisi untuk mengganti kata sandi.",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (name !== user?.name || studyProgram !== user?.affiliation) {
        const { error } = await authClient.updateUser({
          name,
          affiliation: studyProgram,
        });
        if (error) throw error;
      }

      if (password) {
        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword: password,
        });
        if (error) throw error;
      }

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      refetch();

      toast.add({
        type: "success",
        title: "Perubahan Disimpan",
        description: "Profil Anda telah berhasil diperbarui.",
      });
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Gagal Disimpan",
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
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
            
            {/* Bagian 1: Informasi Pribadi */}
            <section className="space-y-6">
              <div className="border-b border-[#D6D3D1] pb-2">
                <h2 className="text-lg font-bold text-[#1C1917]">Informasi Pribadi</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Nama Lengkap (Bisa di-edit) */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="user-name" className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      id="user-name"
                      name="name"
                      type="text"
                      autoComplete="name"
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
                      value={user?.email ?? ""}
                      disabled
                      className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                    />
                  </div>
                </div>

                {/* Program Studi / Instansi (Bisa di-edit) */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="study-program-field" className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    {affiliationLabel}
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      id="study-program-field"
                      name="study-program-field"
                      type="text"
                      autoComplete="off"
                      data-lpignore="true"
                      value={studyProgram}
                      onChange={(e) => setStudyProgram(e.target.value)}
                      placeholder={user?.status === "umum" ? "Nama instansi" : "Nama program studi"}
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
                      value={statusLabel(user?.status)}
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
                      value={user?.idNumber ?? ""}
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
                      value={user?.whatsapp ?? ""}
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
                  <label htmlFor="current-password" className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      id="current-password"
                      name="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Wajib untuk ganti sandi"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showCurrentPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="new-password" className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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
                  <label htmlFor="confirm-new-password" className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      id="confirm-new-password"
                      name="confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
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
