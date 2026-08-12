"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft } from "@phosphor-icons/react";
import { requestPasswordReset } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err) {
      setError(errorMessage(err, "Gagal mengirim tautan reset. Coba lagi nanti."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-8 flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center border border-black/5 bg-gradient-to-br from-white to-zinc-100 shadow-sm">
              <Image
                src="/images/logo-undana.png"
                alt="Logo Undana"
                width={52}
                height={52}
                priority
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="font-serif text-3xl font-bold tracking-tight text-primary">
            Lupa Kata Sandi
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Masukkan email Anda untuk menerima tautan reset kata sandi.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4 bg-white/60 p-6 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Tautan reset telah dikirim ke email <strong>{email}</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                Silakan periksa kotak masuk (atau folder spam) Anda.
              </p>
              <Button
                variant="outline"
                className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => router.push("/login")}
              >
                Kembali ke Halaman Login
              </Button>
            </div>
          ) : (
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
                    placeholder="nama@perpus.ac.id"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/60 focus:bg-white transition-colors"
                  />
                </Field>

                <Field className="pt-4 flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                  >
                    {isLoading ? "Mengirim..." : "Kirim Tautan Reset"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/login")}
                    className="w-full text-muted-foreground hover:text-primary h-11 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Kembali ke Login
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
