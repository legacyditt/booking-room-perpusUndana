import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReservationsLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-80 sm:w-[480px] rounded-lg mb-2" />
        <Skeleton className="h-4 w-60 sm:w-96 rounded-md" />
      </div>

      {/* Kontainer Utama */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Section Skeleton */}
        <div className="p-5 border-b border-[#E2E8F0] bg-white">
          <div className="flex flex-col xl:flex-row gap-4 items-end">
            <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full flex-wrap items-end">
              {/* Search */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Tipe Ruangan */}
              <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Rentang Tanggal */}
              <div className="flex flex-col gap-1.5 w-full lg:w-auto">
                <Skeleton className="h-3 w-28 rounded" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-36 rounded-md" />
                  <span className="text-neutral-300">-</span>
                  <Skeleton className="h-10 w-36 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Skeleton */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 px-5 py-4 bg-[#FAFAFA] border-b border-[#E2E8F0]">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4 rounded mx-auto" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-8 gap-4 px-5 py-5 items-center border-b border-[#E2E8F0] last:border-0"
              >
                <Skeleton className="h-4 w-16 rounded mx-auto" />
                <Skeleton className="h-4 w-28 rounded mx-auto" />
                <Skeleton className="h-4 w-24 rounded mx-auto" />
                <Skeleton className="h-6 w-16 rounded-full mx-auto" />
                <Skeleton className="h-4 w-20 rounded mx-auto" />
                <Skeleton className="h-4 w-24 rounded mx-auto" />
                <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                <Skeleton className="h-8 w-20 rounded-md mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-center gap-4">
          <Skeleton className="h-4 w-52 rounded" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
