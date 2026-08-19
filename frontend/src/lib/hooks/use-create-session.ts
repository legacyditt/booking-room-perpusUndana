import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession } from "@/lib/api/sessions";
import { queryKeys } from "@/lib/query-keys";

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}