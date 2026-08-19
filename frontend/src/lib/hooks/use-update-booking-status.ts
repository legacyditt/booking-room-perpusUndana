import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Parameters<typeof updateBookingStatus>[1] }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
}