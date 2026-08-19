import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { client } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";
import type { Availability } from "./use-room-availability";

export type DailyAvailability = Record<string, Availability>;

export function useDailyAvailability(roomId: number, date?: Date) {
  return useQuery({
    queryKey: queryKeys.availability.daily(
      roomId,
      date ? format(date, "yyyy-MM-dd") : "",
    ),
    queryFn: async () => {
      const dateString = format(date!, "yyyy-MM-dd");
      const response = await client.get<ApiResponse<DailyAvailability>>(
        `/rooms/${roomId}/daily-availability`,
        { params: { date: dateString } },
      );
      return response.data.data;
    },
    staleTime: 0,
    enabled: !!date,
  });
}