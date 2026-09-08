import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoomDetailsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background pb-28 lg:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* Back button skeleton */}
          <div className="mb-6">
            <Skeleton className="h-5 w-56 rounded-md" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-10 items-start">
            {/* Bagian Kiri: Skeleton Gambar */}
            <div className="w-full aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-[450px] rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Bagian Kanan: Skeleton Form Pemesanan */}
            <div className="sticky top-28 p-6 bg-white border border-border/50 rounded-xl shadow-sm flex flex-col gap-5">
              {/* Header Info Ruangan */}
              <div className="border-b border-border pb-5 flex flex-col gap-3">
                <Skeleton className="h-9 w-3/4 rounded-md" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </div>

              {/* Form Inputs Placeholder */}
              <div className="flex flex-col gap-4 py-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Action Button Skeleton */}
              <Skeleton className="h-12 w-full rounded-lg mt-2" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
