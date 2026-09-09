import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 w-full pb-12 pt-10 md:pt-16">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="flex flex-col gap-8">
            {/* Header Skeleton */}
            <div className="flex flex-col items-start space-y-6">
              <Skeleton className="h-5 w-20 rounded" />

              <div className="space-y-2">
                <Skeleton className="h-9 md:h-10 w-44 rounded-lg" />
                <Skeleton className="h-4 w-72 rounded-md" />
              </div>
            </div>

            {/* Form Area Skeleton */}
            <div className="flex flex-col gap-10 bg-white p-6 md:p-10 rounded-xl border border-border shadow-sm">
              {/* Bagian 1: Informasi Pribadi */}
              <div className="space-y-6">
                <div className="border-b border-[#D6D3D1] pb-2">
                  <Skeleton className="h-5 w-36 rounded" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-28 rounded" />
                      <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian 2: Keamanan Akun */}
              <div className="space-y-6">
                <div className="border-b border-[#D6D3D1] pb-2">
                  <Skeleton className="h-5 w-36 rounded" />
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-36 rounded" />
                    <Skeleton className="h-11 w-full rounded-md" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-36 rounded" />
                      <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Actions */}
              <div className="pt-6 flex justify-end">
                <Skeleton className="h-11 w-44 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
