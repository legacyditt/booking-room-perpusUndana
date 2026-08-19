import { useQuery } from "@tanstack/react-query";
import { getSessions } from "@/lib/api/sessions";
import { queryKeys } from "@/lib/query-keys";
import type { Session } from "@/types/booking";

export function useSessions(initialData?: Session[]) {
  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: () => getSessions(),
    staleTime: 5 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}