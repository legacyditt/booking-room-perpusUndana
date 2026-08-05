import React from "react";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";

export function TablePagination() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
      {/* Teks Informasi */}
      <div className="text-sm text-neutral-500">
        Menampilkan <span className="font-medium text-neutral-900">1</span> hingga <span className="font-medium text-neutral-900">4</span> dari <span className="font-medium text-neutral-900">45</span> hasil
      </div>

      {/* Kontrol Navigasi */}
      <div className="flex items-center gap-1">
        {/* Tombol Previous */}
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <CaretLeft weight="bold" />
          Sebelumnya
        </button>

        {/* Halaman Aktif ) */}
        <button className="w-8 h-8 flex items-center justify-center text-sm font-bold text-white bg-[#0F2018] rounded-md transition-colors">
          1
        </button>

        {/* Halaman tidak aktif */}
        <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
          2
        </button>
        
        <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
          3
        </button>
        <div className="w-8 h-8 flex items-center justify-center text-neutral-400">
          <DotsThree weight="bold" />
        </div>

        {/* Tombol Next */}
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-primary transition-colors">
          Selanjutnya
          <CaretRight weight="bold" />
        </button>
      </div>
    </div>
  );
}
