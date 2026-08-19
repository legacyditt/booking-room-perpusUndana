import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSession } from "@/lib/api/sessions";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: number } & Parameters<typeof updateSession>[1]) =>
      updateSession(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}