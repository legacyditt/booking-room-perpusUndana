import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "@/lib/api/sessions";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}