import { useQuery } from "@tanstack/react-query";
import { getRoom } from "@/lib/api/rooms";
import { queryKeys } from "@/lib/query-keys";

export function useRoom(id: number) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: () => getRoom(id),
    staleTime: 5 * 60 * 1000,
    enabled: Number.isFinite(id),
  });
}