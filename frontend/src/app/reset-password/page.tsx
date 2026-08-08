import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-tertiary">
      <div className="w-full max-w-sm">
        <Suspense
          fallback={
            <div className="text-center p-4 text-muted-foreground">
              Memuat...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
