import React from "react";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function TablePagination() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
      {/* Teks Informasi */}
      <div className="text-sm text-neutral-500">
        Menampilkan <span className="font-medium text-neutral-900">1</span>{" "}
        hingga <span className="font-medium text-neutral-900">4</span> dari{" "}
        <span className="font-medium text-neutral-900">45</span> hasil
      </div>

      {/* Kontrol Navigasi */}
      <div className="flex items-center gap-1">
        {/* Tombol Previous */}
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-1 text-neutral-500"
        >
          <CaretLeft weight="bold" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>

        {/* Halaman Aktif */}
        <Button
          variant="default"
          size="sm"
          className="w-8 h-8 p-0 bg-[#0F2018] hover:bg-[#0F2018]/90"
        >
          1
        </Button>

        {/* Halaman tidak aktif */}
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 text-neutral-600"
        >
          2
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 text-neutral-600"
        >
          3
        </Button>

        {/* Ellipsis */}
        <div className="w-8 h-8 flex items-center justify-center text-neutral-400">
          <DotsThree weight="bold" />
        </div>

        {/* Tombol Next */}
        <Button variant="outline" size="sm" className="gap-1 text-neutral-500">
          <span className="hidden sm:inline">Selanjutnya</span>
          <CaretRight weight="bold" />
        </Button>
      </div>
    </div>
  );
}
