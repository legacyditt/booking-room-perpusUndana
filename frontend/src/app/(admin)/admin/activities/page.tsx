import { ActivitiesManagement } from "@/features/admin/components/ActivitiesManagement";
import { getAdminActivities, getUsers } from "@/lib/api";
import { getCookieHeader } from "@/lib/api/server";
import type { AdminActivity, AdminUser } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  let activities: AdminActivity[] = [];
  let admins: AdminUser[] = [];
  try {
    const { cookie } = await getCookieHeader();
    activities = await getAdminActivities(cookie);
    admins = (await getUsers(cookie)).filter((u) => u.role === "admin");
  } catch {
    activities = [];
    admins = [];
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Aktivitas Admin
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Riwayat aksi yang dilakukan admin di sistem.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <ActivitiesManagement activities={activities} admins={admins} />
      </div>
    </div>
  );
}
