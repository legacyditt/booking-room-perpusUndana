import Link from "next/link";
import { PlusCircle, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card className="border-neutral-200 shadow-none rounded-xl h-full">
      <CardHeader className="px-6 py-5 border-b border-neutral-100 pb-4">
        <CardTitle className="text-lg font-serif font-semibold text-primary">
          Aksi Cepat
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            size="lg"
            nativeButton={false}
            className="w-full justify-center gap-2"
            render={<Link href="/admin/rooms/add" />}
          >
            <PlusCircle size={18} />
            Tambah Ruangan Baru
          </Button>

          <Button
            variant="outlinePrimary"
            size="lg"
            nativeButton={false}
            className="w-full justify-center gap-2"
            render={<Link href="/admin/reports" />}
          >
            <ChartBar size={18} />
            Buat Laporan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
