import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}