import { Plus } from "@phosphor-icons/react/dist/ssr";
import { SessionsManagement } from "@/features/admin/components/SessionsManagement";
import { getSessions } from "@/lib/api";
import { getCookieHeader } from "@/lib/api/server";
import { NavActionButton } from "@/components/shared/nav-action-button";
import type { Session } from "@/types/booking";

export const dynamic = "force-dynamic";

export default async function AdminSessionsPage() {
  let sessions: Session[] = [];
  try {
    sessions = await getSessions((await getCookieHeader()).cookie);
  } catch {
    sessions = [];
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Sesi
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Atur slot waktu sesi yang tersedia untuk pemesanan ruangan.
          </p>
        </div>
        <NavActionButton
          href="/admin/sessions/add"
          label="Tambah Sesi"
          pendingLabel="Membuka..."
          icon={<Plus weight="bold" className="w-4 h-4" />}
        />
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <SessionsManagement sessions={sessions} />
      </div>
    </div>
  );
}
