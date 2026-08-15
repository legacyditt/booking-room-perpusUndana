"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  EnvelopeSimple,
  Shield,
  LockKey,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient, useSession } from "@/lib/api/auth-client";

export function AdminProfileForm() {
  const { data: session, refetch } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name ?? "");
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
    }
  }, [user?.name]);

  const hasChanges =
    name !== (user?.name ?? "") ||
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
      if (name !== user?.name) {
        const { error } = await authClient.updateUser({ name });
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
        title: "Profil Admin Diperbarui",
        description: "Informasi profil dan/atau kata sandi Anda berhasil disimpan.",
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
    <div className="flex flex-col gap-10 bg-white p-6 md:p-10 rounded-xl border border-border shadow-sm max-w-4xl">
      
      {/* Bagian 1: Informasi Admin */}
      <section className="space-y-6">
        <div className="border-b border-[#D6D3D1] pb-2">
          <h2 className="text-lg font-bold text-[#1C1917]">Informasi Admin</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Nama Lengkap (Bisa di-edit) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
              Nama Tampilan
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="pl-9 h-11 bg-white border-[#D6D3D1] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Email (Disabled) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
              Email Akun
            </label>
            <div className="relative">
              <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                type="email"
                defaultValue={user?.email}
                disabled
                className="pl-9 h-11 bg-neutral-100 border-[#D6D3D1] text-neutral-500 cursor-not-allowed shadow-none opacity-100"
              />
            </div>
          </div>

          {/* Role (Disabled) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
              Hak Akses
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                type="text"
                defaultValue="Admin Sistem"
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
          <p className="text-sm text-neutral-500 mt-1">Ubah kata sandi default Anda menjadi kata sandi yang lebih kuat.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                type={showCurrentPassword ? "text" : "password"}
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
            <label className="text-xs font-semibold text-[#44403C] uppercase tracking-wider">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Kosongkan jika tidak ingin mengubah"
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
              Konfirmasi Kata Sandi Baru
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
  );
}
