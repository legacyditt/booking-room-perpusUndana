"use client";

import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { Footer } from "@/features/home/components/Footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <main className="flex-1">
        <ProfileForm />
      </main>
      <Footer />
    </div>
  );
}
