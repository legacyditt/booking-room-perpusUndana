import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: number } & Parameters<typeof updateBooking>[1]) =>
      updateBooking(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
    },
  });
}