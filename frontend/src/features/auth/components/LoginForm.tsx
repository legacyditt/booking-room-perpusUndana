"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/api/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { AuthLogo } from "./AuthLogo";
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
import { Eye, EyeSlash } from "@phosphor-icons/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("error") === "session_expired") {
        // Tampilkan toast bahwa sesi sudah habis
        toast.add({
          type: "warning",
          title: "Sesi Berakhir",
          description: "Sesi Anda telah berakhir. Silakan login kembali.",
        });

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("error");
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(
          authError.message ??
            "Login gagal. Periksa kembali email dan kata sandi.",
        );

        toast.add({
          type: "error",
          title: "Gagal Masuk",
          description:
            "Mohon periksa kembali email dan kata sandi yang Anda masukkan.",
        });

        setIsLoading(false);
        return;
      }

      const fullName = data?.user?.name || "";
      const firstName = fullName.split(" ")[0];

      toast.add({
        type: "success",
        title: "Berhasil Masuk",
        description: `Selamat datang kembali, ${firstName ? firstName : "Pengguna"}!`,
      });

      setIsLoading(false);

      setTimeout(() => {
        if (data?.user?.role === "admin") {
          window.location.href = "/admin/overview";
        } else {
          window.location.href = "/";
        }
      }, 1000);
    } catch (networkError: any) {
      const errorMessage =
        networkError?.message ||
        "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
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
        <CardHeader className="text-center py-4 flex flex-col items-center gap-2">
          <div className="m-6 flex justify-center">
            <AuthLogo size={100} />
          </div>
          <CardTitle className="font-serif text-3xl font-bold tracking-tight text-primary">
            Booking Ruangan
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Perpustakaan Undana
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
                <FieldLabel htmlFor="email" className="font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@perpus.ac.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="font-medium">
                    Kata Sandi
                  </FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
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
              </Field>

              <Field className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                >
                  {isLoading ? "Memproses..." : "Masuk ke Sistem"}
                </Button>
                <FieldDescription className="text-center mt-4">
                  Belum punya akun?{" "}
                  <a
                    href="/register"
                    className="text-primary font-medium hover:underline"
                  >
                    Daftar di sini
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
