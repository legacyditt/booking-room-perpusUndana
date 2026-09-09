import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRoomsLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-9 w-64 rounded-lg mb-2" />
          <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Kontainer Utama */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar Skeleton */}
        <div className="p-5 border-b border-[#E2E8F0] bg-white">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Skeleton className="h-10 w-full sm:w-80 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
          </div>
        </div>

        {/* Tabel Skeleton */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 px-5 py-4 bg-[#FAFAFA] border-b border-[#E2E8F0]">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4 rounded mx-auto" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-7 gap-4 px-5 py-5 items-center border-b border-[#E2E8F0] last:border-0"
              >
                <Skeleton className="h-5 w-32 rounded mx-auto" />
                <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                <Skeleton className="h-4 w-20 rounded mx-auto" />
                <Skeleton className="h-4 w-24 rounded mx-auto" />
                <Skeleton className="h-4 w-24 rounded mx-auto" />
                <Skeleton className="h-4 w-16 rounded mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
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
