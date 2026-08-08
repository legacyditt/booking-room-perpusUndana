"use client";

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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-8">
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
