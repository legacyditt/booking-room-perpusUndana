import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";
import type { Booking } from "@/types/booking";

export function useAllBookings(initialData?: Booking[]) {
  return useQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: () => getBookings(),
    staleTime: 2 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}