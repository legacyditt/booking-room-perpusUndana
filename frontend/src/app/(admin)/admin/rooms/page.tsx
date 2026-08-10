import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { RoomsManagement } from "@/features/admin/components/RoomsManagement";
import { getRooms } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Room } from "@/types/room";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  let rooms: Room[] = [];
  try {
    rooms = await getRooms();
  } catch {
    rooms = [];
  }

  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Kelola Ruangan
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Awasi dan pelihara inventaris seluruh fasilitas akademik perpustakaan.
          </p>
        </div>
        <Link href="/admin/rooms/add">
          <Button className="bg-[#0F2018] text-white hover:bg-[#0F2018]/90 gap-2">
            <Plus className="w-4 h-4" weight="bold" />
            Tambah Ruangan
          </Button>
        </Link>
      </div>

      {/* ── Kontainer Utama (Filter, Tabel, Pagination) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <RoomsManagement rooms={rooms} />
      </div>
    </div>
  );
}
