// Tipe data untuk satu kartu statistik di halaman overview
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
  location: string;
  type: string;
  capacity: string;
  price: string;
  status: "AVAILABLE" | "MAINTENANCE" | "OFFLINE";
}
