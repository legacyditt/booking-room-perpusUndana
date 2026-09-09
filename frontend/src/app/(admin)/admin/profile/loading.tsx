import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProfileLoading() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <Skeleton className="h-9 w-52 rounded-lg mb-2" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="flex flex-col gap-10 bg-white p-6 md:p-10 rounded-xl border border-border shadow-sm max-w-4xl">
        <section className="space-y-6">
          <div className="border-b border-[#D6D3D1] pb-2">
            <Skeleton className="h-5 w-36 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="border-b border-[#D6D3D1] pb-2">
            <Skeleton className="h-5 w-40 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-36 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </section>

        <div className="pt-2 flex justify-end border-t border-[#E2E8F0]">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}
