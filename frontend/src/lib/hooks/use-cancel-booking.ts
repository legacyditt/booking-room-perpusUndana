import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}