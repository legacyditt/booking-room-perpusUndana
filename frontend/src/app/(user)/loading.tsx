import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">
        {/* Header Row Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <Skeleton className="h-10 md:h-12 w-72 md:w-96 rounded-lg" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0">
            <Skeleton className="h-12 w-full sm:w-[250px] rounded-lg" />
            <div className="hidden sm:block w-px h-6 bg-neutral/20" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="pt-0 overflow-hidden border-border bg-white shadow-sm"
            >
              {/* Image Skeleton */}
              <div className="relative aspect-video sm:aspect-[4/3] w-full bg-muted">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Title & Info Skeleton */}
              <CardHeader className="space-y-3 pb-4">
                <Skeleton className="h-7 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </CardHeader>

              {/* Action Button Skeleton */}
              <CardFooter className="pt-4 pb-6 px-6">
                <Skeleton className="h-11 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
