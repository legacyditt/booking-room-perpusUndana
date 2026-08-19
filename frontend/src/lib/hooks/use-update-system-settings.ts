import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSystemSettings } from "@/lib/api/settings";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}