import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearDatabaseBookings } from "@/lib/api/database";
import { queryKeys } from "@/lib/query-keys";

export function useClearBookings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearDatabaseBookings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.databaseStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}