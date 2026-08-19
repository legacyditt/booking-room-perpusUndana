import { useQuery } from "@tanstack/react-query";
import { getAdminActivities } from "@/lib/api/users";
import type { AdminActivity } from "@/types/admin";
import { queryKeys } from "@/lib/query-keys";

export function useAdminActivities(initialData?: AdminActivity[]) {
  return useQuery({
    queryKey: queryKeys.activities,
    queryFn: () => getAdminActivities(),
    staleTime: 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}