// Tipe data 

export interface AdminStat {
  id: string;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
  progress?: number;
}

export interface RecentBookingRow {
  id: number;
  userName: string;
  roomName: string;
  sessionTimeRange: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  date: string;
}

export interface AdminSessionRow {
  id: number;
  name: string;
  startTime: string;  // format "08:00"
  endTime: string;    // format "10:00"
  duration: string;   // format "2 Jam"
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}
