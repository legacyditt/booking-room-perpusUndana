import { AdminProfileForm } from "@/features/admin/components/AdminProfileForm";

export default function AdminProfilePage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-1">
          Edit Profil Admin
        </h1>
        <p className="text-neutral-500 text-sm">
          Kelola informasi akun Anda dan ubah kata sandi default untuk keamanan yang lebih baik.
        </p>
      </div>

      <AdminProfileForm />
    </div>
  );
}
