import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { client } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

export interface DayAvailability {
  workingDay: boolean;
  unavailable: boolean;
}

export type MonthAvailability = Record<string, DayAvailability>;

export function useMonthAvailability(roomId: number, month?: Date) {
  return useQuery({
    queryKey: queryKeys.availability.month(
      roomId,
      month ? format(month, "yyyy-MM") : "",
    ),
    queryFn: async () => {
      const monthString = format(month!, "yyyy-MM");
      const response = await client.get<ApiResponse<MonthAvailability>>(
        `/rooms/${roomId}/month-availability`,
        { params: { month: monthString } },
      );
      return response.data.data;
    },
    staleTime: 0,
    enabled: !!month,
  });
}