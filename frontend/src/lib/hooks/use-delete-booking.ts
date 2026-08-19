import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
    },
  });
}