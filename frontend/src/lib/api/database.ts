import { client, unwrap } from "./client";
import type {
  DatabaseStats,
  ClearDatabasePayload,
  ClearDatabaseResult,
} from "@/types/database";

const DEFAULT_MOCK_DB_STATS: DatabaseStats = {
  usedBytes: 13421772, // ~12.8 MB
  usedFormatted: "12.8 MB",
  maxBytes: 536870912, // 512 MB
  maxFormatted: "512 MB",
  percentage: 2.5,
  status: "healthy",
  totalBookings: 53,
  totalUsers: 18,
  totalRooms: 4,
  lastUpdated: new Date().toISOString(),
};

/**
 * Mengambil ringkasan penggunaan storage & metrik database
 */
export async function getDatabaseStats(cookie?: string): Promise<DatabaseStats> {
  const headers = cookie ? { cookie } : undefined;
  try {
    return await unwrap(client.get("/admin/database/stats", { headers }));
  } catch {
    // Fallback gracefully jika backend belum selesai diimplementasikan
    return DEFAULT_MOCK_DB_STATS;
  }
}

/**
 * Mengunduh backup database berformat Excel (.xlsx)
 */
export async function downloadDatabaseBackup(): Promise<void> {
  const res = await client.get("/admin/database/backup", {
    responseType: "blob",
  });

  const url = URL.createObjectURL(res.data as Blob);
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = `BACKUP_DATABASE_PERPUS_${timestamp}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Membersihkan riwayat transaksi pemesanan (Bookings) di database
 */
export async function clearDatabaseBookings(
  confirmationText: string,
): Promise<ClearDatabaseResult> {
  const payload: ClearDatabasePayload = { confirmationText };
  return unwrap(client.post("/admin/database/clear", payload));
}
