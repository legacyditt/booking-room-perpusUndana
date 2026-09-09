import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminOverviewLoading() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <Skeleton className="h-10 w-72 md:w-96 rounded-lg mb-2" />
        <Skeleton className="h-4 w-60 md:w-80 rounded-md" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-neutral-200 shadow-none rounded-xl"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full gap-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              </div>

              <Skeleton className="h-9 w-20 rounded" />

              {i === 3 && (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-2 w-full rounded" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-3 w-14 rounded" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <Skeleton className="h-6 w-52 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-5 gap-4 pb-2 border-b border-neutral-100">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-4 w-full rounded" />
                ))}
              </div>

              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-5 gap-4 py-2.5 items-center border-b border-neutral-50 last:border-0"
                >
                  <Skeleton className="h-4 w-3/4 rounded mx-auto" />
                  <Skeleton className="h-4 w-2/3 rounded mx-auto" />
                  <Skeleton className="h-4 w-1/2 rounded mx-auto" />
                  <Skeleton className="h-4 w-3/4 rounded mx-auto" />
                  <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-neutral-200 shadow-none rounded-xl h-full">
            <CardHeader className="px-6 py-5 border-b border-neutral-100 pb-4">
              <Skeleton className="h-6 w-28 rounded-md" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, btnIdx) => (
                  <Skeleton key={btnIdx} className="h-11 w-full rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
