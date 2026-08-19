import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "@/lib/api/rooms";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: number } & Parameters<typeof updateRoom>[1]) =>
      updateRoom(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}