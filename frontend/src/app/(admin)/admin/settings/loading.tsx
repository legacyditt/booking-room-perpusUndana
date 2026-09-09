import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* ── Header Section ── */}
      <div>
        <Skeleton className="h-9 w-64 rounded-lg mb-2" />
        <Skeleton className="h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* ── Konten Pengaturan ── */}
      <div className="space-y-8">
        {/* Baris 1: 2 Kolom (Hari Operasional & WhatsApp Contact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Hari Operasional */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-44 rounded-md" />
                  <Skeleton className="h-4 w-60 rounded-md" />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-lg" />
                ))}
              </div>
              <Skeleton className="mt-6 h-16 w-full rounded-lg" />
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end">
              <Skeleton className="h-10 w-48 rounded-lg" />
            </div>
          </div>

          {/* Card 2: WhatsApp Contact */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-64 rounded-md" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-3 w-52 rounded-md" />
                </div>
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end">
              <Skeleton className="h-10 w-48 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Baris 2: Template WhatsApp */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-56 rounded-md" />
                <Skeleton className="h-4 w-80 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-44 rounded-lg" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-72 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
