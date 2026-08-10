import { UsersManagement } from "@/features/admin/components/UsersManagement";
import { getUsers } from "@/lib/api";
import type { AdminUser } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: AdminUser[] = [];
  try {
    users = await getUsers();
  } catch {
    users = [];
  }

  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Pengguna
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Tinjau dan kelola seluruh pengguna dan hak akses di sistem perpustakaan.
          </p>
        </div>
      </div>

      {/* ── Kontainer Utama (Filter, Tabel, Pagination) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <UsersManagement users={users} />
      </div>
    </div>
  );
}
