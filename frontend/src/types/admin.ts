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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface AdminActivity {
  id: number;
  adminId: string;
  action: string;
  detail: string | null;
  createdAt: string;
  admin: { name: string };
}
