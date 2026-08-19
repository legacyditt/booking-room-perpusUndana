import { useQuery } from "@tanstack/react-query";
import { getUserBookings } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query-keys";
import type { Booking } from "@/types/booking";

export function useUserBookings(initialData?: Booking[]) {
  return useQuery({
    queryKey: queryKeys.bookings.mine,
    queryFn: () => getUserBookings(),
    staleTime: 2 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}