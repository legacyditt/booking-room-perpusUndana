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
import { Eye, EyeSlash } from "@phosphor-icons/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-8">
          <CardTitle className="font-serif text-3xl font-bold tracking-tight text-primary">
            Booking Ruangan
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Perpustakaan Undana
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@perpus.ac.id"
                  required
                  className="bg-white/60 focus:bg-white transition-colors"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="font-medium">
                    Kata Sandi
                  </FieldLabel>
                  <a
                    href="#"
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
                    className="bg-white/60 focus:bg-white transition-colors pr-10"
                  />
                  {/* Tombol toggle ikon mata */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                >
                  Masuk ke Sistem
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
