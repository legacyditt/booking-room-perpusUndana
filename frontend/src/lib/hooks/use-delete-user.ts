import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}