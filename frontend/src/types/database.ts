/**
 * Tipe data untuk monitoring & pemeliharaan database
 */

export type DatabaseHealthStatus = "healthy" | "warning" | "critical";

export interface DatabaseStats {
  usedBytes: number;
  usedFormatted: string;
  maxBytes: number;
  maxFormatted: string;
  percentage: number;
  status: DatabaseHealthStatus;
  totalBookings: number;
  totalUsers: number;
  totalRooms: number;
  lastUpdated?: string;
}

export interface ClearDatabasePayload {
  confirmationText: string;
}

export interface ClearDatabaseResult {
  success: boolean;
  message: string;
  deletedBookingsCount: number;
}
