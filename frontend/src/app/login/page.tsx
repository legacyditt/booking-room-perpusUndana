import { LoginForm } from "@/features/auth/components/LoginForm"

export default function LoginPage() {
  return (
    // bg-tertiary akan memberikan warna kertas akademik yang hangat (bukan putih murni)
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-tertiary">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
