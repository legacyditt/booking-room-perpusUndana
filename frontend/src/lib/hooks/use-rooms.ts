import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/lib/api/rooms";
import { queryKeys } from "@/lib/query-keys";
import type { Room } from "@/types/room";

export function useRooms(initialData?: Room[]) {
  return useQuery({
    queryKey: queryKeys.rooms.all,
    queryFn: () => getRooms(),
    staleTime: 5 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}