export interface Session {
  id: string;
  name: string;
  timeRange: string;
}

export interface Booking {
  id: string;
  roomId: string;
  sessionId: string;
  userId: string;
  date: string; // Format: YYYY-MM-DD
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string; 
}
