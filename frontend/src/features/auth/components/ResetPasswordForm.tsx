"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";
import { resetPassword } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Mengambil query parameter "?token=" dari URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Validasi keberadaan Token (wajib ada untuk mereset sandi)
    if (!token) {
      setError(
        "Token reset kata sandi tidak valid atau tidak ditemukan di URL.",
      );
      setIsLoading(false);
      return;
    }

    // 2. Validasi kecocokan sandi dan konfirmasi sandi
    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      setIsLoading(false);
      return;
    }

    // 3. Validasi panjang sandi (keamanan dasar)
    if (password.length < 8) {
      setError("Kata sandi harus terdiri dari minimal 8 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (err) {
      setError(
        errorMessage(err, "Gagal mereset kata sandi. Coba lagi nanti."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan layar sukses setelah password berhasil diubah
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="pt-6">
            <div className="text-center space-y-4 bg-white/60 p-8 rounded-lg border border-primary/20 flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <CheckCircle size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Berhasil!</h3>
              <p className="text-sm text-muted-foreground">
                Kata sandi Anda telah berhasil diubah. Silakan masuk menggunakan
                kata sandi yang baru.
              </p>
              <Button
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push("/login")}
              >
                Lanjut ke Halaman Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tampilan awal (Form Input Password)
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-8">
          <CardTitle className="font-serif text-3xl font-bold tracking-tight text-primary">
            Ubah Kata Sandi
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Silakan masukkan kata sandi baru Anda di bawah ini.
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

              <Field>
                <FieldLabel htmlFor="password" className="font-medium">
                  Kata Sandi Baru
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/60 focus:bg-white transition-colors pr-10"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword" className="font-medium">
                  Konfirmasi Kata Sandi
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/60 focus:bg-white transition-colors pr-10"
                    placeholder="Ulangi kata sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </Field>

              <Field className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Kata Sandi"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
