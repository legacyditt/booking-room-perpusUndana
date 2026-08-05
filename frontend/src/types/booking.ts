export interface Session {
  id: number;
  name: string;
  timeRange: string;
}

export interface Booking {
  id: number;
  roomId: number;
  sessionId: number;
  userId: number;
  date: Date;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: Date; 
}
