import { useQuery } from "@tanstack/react-query";
import { getDatabaseStats } from "@/lib/api/database";
import type { DatabaseStats } from "@/types/database";
import { queryKeys } from "@/lib/query-keys";

export function useDatabaseStats(initialData?: DatabaseStats) {
  return useQuery({
    queryKey: queryKeys.databaseStats,
    queryFn: () => getDatabaseStats(),
    staleTime: 2 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}