import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmins } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";

export function useCreateAdmins() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmins,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}