import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
    },
  });
}