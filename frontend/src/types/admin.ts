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

export interface AdminRoomRow {
  id: number;
  imageUrl: string;
  roomName: string;
  type: string;
  capacity: string;
  price: string;
}

export interface AdminSessionRow {
  id: number;
  name: string;
  startTime: string;  // format "08:00"
  endTime: string;    // format "10:00"
  duration: string;   // format "2 Jam"
  isActive: boolean;
}

export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "LIBRARIAN";
  joinDate: string;    // format "5 Agu 2026"
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}
