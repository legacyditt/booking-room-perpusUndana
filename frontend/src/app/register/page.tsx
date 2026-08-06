import { SignupForm } from "@/features/auth/components/SignupForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-tertiary">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
