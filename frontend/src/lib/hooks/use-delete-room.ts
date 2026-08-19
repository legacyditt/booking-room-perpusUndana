import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "@/lib/api/rooms";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}