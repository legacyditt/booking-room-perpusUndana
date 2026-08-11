import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { SessionsManagement } from "@/features/admin/components/SessionsManagement";
import { getSessions } from "@/lib/api";
import { getCookieHeader } from "@/lib/api/server";
import { Button } from "@/components/ui/button";
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
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Sesi
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Atur slot waktu sesi yang tersedia untuk pemesanan ruangan.
          </p>
        </div>
        <Link href="/admin/sessions/add">
          <Button className="bg-[#0F2018] text-white hover:bg-[#0F2018]/90 gap-2">
            <Plus weight="bold" className="w-4 h-4" />
            Tambah Sesi
          </Button>
        </Link>
      </div>

      {/* ── Kontainer Utama (Tabel + Pagination) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <SessionsManagement sessions={sessions} />
      </div>
    </div>
  );
}
