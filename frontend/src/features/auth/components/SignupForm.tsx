"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signOut } from "@/lib/api/auth-client";
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
import { toast } from "@/components/ui/toast";

type UserStatus = "mahasiswa" | "dosen" | "umum" | "";

const conditionalFieldConfig: Record<
  Exclude<UserStatus, "">,
  { label: string; placeholder: string; id: string }
> = {
  mahasiswa: { label: "NIM", placeholder: "Nomor Induk Mahasiswa", id: "nim" },
  dosen: { label: "NIP", placeholder: "Nomor Induk Pegawai", id: "nip" },
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const conditionalField = status ? conditionalFieldConfig[status] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
        status: status,
        idNumber: idNumber,
        whatsapp: whatsapp,
      });

      if (authError) {
        setError(authError.message ?? "Pendaftaran gagal. Coba lagi.");

        toast.add({
          type: "error",
          title: "Pendaftaran Gagal",
          description: "Silakan periksa kembali data yang diisi pada form Anda.",
        });

        setIsLoading(false);
        return;
      }

      toast.add({
        type: "success",
        title: "Pendaftaran Berhasil",
        description: "Akun Anda berhasil dibuat. Silakan login.",
      });

      await signOut();

      setIsLoading(false);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        "Terjadi kesalahan jaringan atau server tidak merespons.";
      setError(errorMessage);

      toast.add({
        type: "error",
        title: "Kesalahan Sistem",
        description: errorMessage,
      });

      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              {/* Nama */}
              <Field>
                <FieldLabel htmlFor="name" className="font-medium">
                  Nama Lengkap
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              {/* Status */}
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

              {/* NIM / NIP / NIK kondisional */}
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
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="bg-white/60 focus:bg-white transition-colors"
                  />
                </Field>
              )}

              {/* WhatsApp */}
              <Field>
                <FieldLabel htmlFor="whatsapp" className="font-medium">
                  No. WhatsApp
                </FieldLabel>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password" className="font-medium">
                  Kata Sandi
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Konfirmasi Password */}
              <Field>
                <FieldLabel htmlFor="confirm-password" className="font-medium">
                  Konfirmasi Kata Sandi
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/60 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi"
                        : "Tampilkan konfirmasi"
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

              {/* Submit */}
              <Field className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                >
                  {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
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
