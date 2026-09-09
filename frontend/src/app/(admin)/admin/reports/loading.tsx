import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReportsLoading() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <Skeleton className="h-9 w-56 rounded-lg mb-2" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 p-6 border border-[#E2E8F0] bg-white rounded-xl shadow-sm flex flex-col gap-4">
            <Skeleton className="h-6 w-52 rounded" />
            <Skeleton className="h-4 w-80 rounded" />
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-100">
              <div className="flex flex-col gap-1.5 w-40">
                <Skeleton className="h-3 w-12 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex flex-col gap-1.5 w-32">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="sm:ml-auto mt-auto">
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
            </div>
          </div>

          <div className="border border-[#E2E8F0] bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-12 w-20 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        </div>

        <div className="border border-[#E2E8F0] bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100">
            <Skeleton className="h-5 w-56 rounded" />
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-[#FAFAFA] border-b border-[#E2E8F0]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-3/4 rounded" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-6 gap-4 px-5 py-3 items-center border-b border-[#E2E8F0] last:border-0"
                >
                  <Skeleton className="h-4 w-6 rounded mx-auto" />
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-4 w-12 rounded mx-auto" />
                  <Skeleton className="h-4 w-12 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
