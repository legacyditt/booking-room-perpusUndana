import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { client } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

export interface Availability {
  remainingCapacity: number;
  capacity: number;
  booked: number;
}

export function useRoomAvailability(
  roomId: number,
  date?: Date,
  sessionId?: string,
) {
  return useQuery({
    queryKey: queryKeys.availability.room(
      roomId,
      date ? format(date, "yyyy-MM-dd") : "",
      Number(sessionId) || 0,
    ),
    queryFn: async () => {
      const dateString = format(date!, "yyyy-MM-dd");
      const response = await client.get<ApiResponse<Availability>>(
        `/rooms/${roomId}/availability`,
        { params: { date: dateString, sessionId } },
      );
      return response.data.data;
    },
    staleTime: 0,
    enabled: !!date && !!sessionId,
  });
}