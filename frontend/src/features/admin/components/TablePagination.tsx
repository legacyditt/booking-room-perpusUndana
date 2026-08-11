import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export function TablePagination({
  page = 1,
  pageSize = 5,
  totalItems = 0,
  onPageChange = () => {},
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
      {/* Teks Informasi */}
      <div className="text-sm text-neutral-500">
        Menampilkan <span className="font-medium text-neutral-900">{start}</span>{" "}
        hingga <span className="font-medium text-neutral-900">{end}</span> dari{" "}
        <span className="font-medium text-neutral-900">{totalItems}</span> hasil
      </div>

      {/* Kontrol Navigasi */}
      <div className="flex items-center gap-1">
        {/* Tombol Previous */}
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="gap-1 text-neutral-500"
        >
          <CaretLeft weight="bold" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>

        {/* Nomor Halaman */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(p)}
            className={
              p === page
                ? "w-8 h-8 p-0 bg-[#0F2018] hover:bg-[#0F2018]/90"
                : "w-8 h-8 p-0 text-neutral-600"
            }
          >
            {p}
          </Button>
        ))}

        {/* Tombol Next */}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="gap-1 text-neutral-500"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <CaretRight weight="bold" />
        </Button>
      </div>
    </div>
  );
}
