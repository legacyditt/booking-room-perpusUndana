import { Skeleton } from "@/components/ui/skeleton";

function UserTableSkeleton() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-[#E2E8F0] bg-white flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Skeleton className="h-10 w-full md:w-96 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-4 gap-4 px-5 py-4 bg-[#FAFAFA] border-b border-[#E2E8F0]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-3/4 rounded mx-auto" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-4 gap-4 px-5 py-5 items-center border-b border-[#E2E8F0] last:border-0"
            >
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-44 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full mx-auto" />
              <Skeleton className="h-4 w-24 rounded mx-auto" />
              <Skeleton className="h-8 w-8 rounded-md mx-auto" />
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
  );
}

export default function AdminUsersLoading() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <Skeleton className="h-9 w-52 rounded-lg mb-2" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>
      <UserTableSkeleton />
    </div>
  );
}
