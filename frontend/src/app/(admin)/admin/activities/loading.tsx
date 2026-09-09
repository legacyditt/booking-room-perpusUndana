import { Skeleton } from "@/components/ui/skeleton";

export default function AdminActivitiesLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-9 w-52 rounded-lg mb-2" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#E2E8F0] bg-white flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-44 rounded-md" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-8 rounded" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-4 gap-4 px-5 py-4 bg-[#FAFAFA] border-b border-[#E2E8F0]">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4 rounded" />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-4 gap-4 px-5 py-4 items-center border-b border-[#E2E8F0] last:border-0"
              >
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-6 w-32 rounded-full mx-auto" />
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-4 w-32 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

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
