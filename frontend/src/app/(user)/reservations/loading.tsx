import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ReservationsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8">
          {/* Header Section Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 md:h-12 w-64 md:w-80 rounded-lg mb-3" />
            <Skeleton className="h-5 w-96 max-w-full rounded-md" />
          </div>

          {/* Search and Filter Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Skeleton className="h-11 flex-1 rounded-md" />
            <Skeleton className="h-11 w-full sm:w-[180px] rounded-md" />
          </div>

          {/* Tabs Navigation Skeleton */}
          <div className="flex gap-6 sm:gap-8 pb-3 mb-6 border-b border-neutral-200">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white border-border shadow-xs flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Skeleton className="h-5 w-28 rounded-full" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-40 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32 rounded" />
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-5 pt-0 border-t border-neutral-100 mt-4 flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 flex-1 rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
