import Link from "next/link";
import { PlusCircle, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col gap-4">
      {/* Judul section */}
      <h2 className="text-lg font-serif font-semibold text-primary">
        Aksi Cepat
      </h2>

      {/* Daftar tombol aksi */}
      <div className="flex flex-col gap-3">
        {/* Tombol utama: Tambah Ruangan Baru — variant solid/default */}
        <Button
          variant="default"
          size="lg"
          className="w-full justify-center gap-2 rounded-lg"
          render={<Link href="/admin/rooms/new" />}
        >
          <PlusCircle size={18} />
          Tambah Ruangan Baru
        </Button>

        {/* Tombol sekunder: Buat Laporan — variant outline dengan warna primary */}
        <Button
          variant="outlinePrimary"
          size="lg"
          className="w-full justify-center gap-2 rounded-lg"
          render={<Link href="/admin/reports" />}
        >
          <ChartBar size={18} />
          Buat Laporan
        </Button>
      </div>
    </div>
  );
}
