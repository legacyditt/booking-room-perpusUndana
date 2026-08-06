"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeSlash } from "@phosphor-icons/react";

// Tipe data untuk status pengguna
type UserStatus = "mahasiswa" | "dosen" | "umum" | "";

// Konfigurasi label field kondisional berdasarkan status yang dipilih
const conditionalFieldConfig: Record<
  Exclude<UserStatus, "">,
  { label: string; placeholder: string; id: string }
> = {
  mahasiswa: {
    label: "NIM",
    placeholder: "Nomor Induk Mahasiswa",
    id: "nim",
  },
  dosen: {
    label: "NIP",
    placeholder: "Nomor Induk Pegawai",
    id: "nip",
  },
  umum: {
    label: "NIK",
    placeholder: "Nomor Induk Kependudukan (16 digit)",
    id: "nik",
  },
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [status, setStatus] = useState<UserStatus>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const conditionalField = status ? conditionalFieldConfig[status] : null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-8">
          <CardTitle className="font-serif text-3xl font-bold tracking-tight text-primary">
            Daftar Akun
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Booking Ruangan Perpustakaan Undana
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              {/* --- Field 1: Nama Lengkap --- */}
              <Field>
                <FieldLabel htmlFor="name" className="font-medium">
                  Nama Lengkap
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              {/* --- Field 2: Email --- */}
              <Field>
                <FieldLabel htmlFor="email" className="font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              {/* --- Field 3: Status (Dropdown) --- */}
              <Field>
                <FieldLabel htmlFor="status" className="font-medium">
                  Status
                </FieldLabel>
                <Select onValueChange={(val) => setStatus(val as UserStatus)}>
                  <SelectTrigger
                    id="status"
                    className="bg-white/60 focus:bg-white transition-colors"
                  >
                    <SelectValue placeholder="Pilih status Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                    <SelectItem value="dosen">Dosen</SelectItem>
                    <SelectItem value="umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/*
                --- Field 4: Field Kondisional (NIM / NIP / NIK) ---
              */}
              {conditionalField && (
                <Field>
                  <FieldLabel
                    htmlFor={conditionalField.id}
                    className="font-medium"
                  >
                    {conditionalField.label}
                  </FieldLabel>
                  <Input
                    id={conditionalField.id}
                    type="text"
                    placeholder={conditionalField.placeholder}
                    required
                    className="bg-white/60 focus:bg-white transition-colors"
                  />
                </Field>
              )}

              {/* --- Field 5: No. WhatsApp --- */}
              <Field>
                <FieldLabel htmlFor="whatsapp" className="font-medium">
                  No. WhatsApp
                </FieldLabel>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  required
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              {/* --- Field 6: Password  --- */}
              <Field>
                <FieldLabel htmlFor="password" className="font-medium">
                  Kata Sandi
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="bg-white/60 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldDescription>Minimal 8 karakter.</FieldDescription>
              </Field>

              {/* --- Field 7: Konfirmasi Password  --- */}
              <Field>
                <FieldLabel htmlFor="confirm-password" className="font-medium">
                  Konfirmasi Kata Sandi
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="bg-white/60 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi kata sandi"
                        : "Tampilkan konfirmasi kata sandi"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </Field>

              {/* --- Tombol Submit & Link Login --- */}
              <Field className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                >
                  Daftar Sekarang
                </Button>
                <FieldDescription className="text-center mt-4">
                  Sudah punya akun?{" "}
                  <a
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Masuk di sini
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
