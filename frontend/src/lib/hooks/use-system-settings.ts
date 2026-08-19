import { useQuery } from "@tanstack/react-query";
import { getSystemSettings } from "@/lib/api/settings";
import type { SystemSettings } from "@/lib/api/settings";
import { queryKeys } from "@/lib/query-keys";

export function useSystemSettings(initialData?: SystemSettings) {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => getSystemSettings(),
    staleTime: 10 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}