const BASE_URL = "https://api.prisma.io/v1";

const headers = () => ({
  Authorization: `Bearer ${process.env.PRISMA_SERVICE_TOKEN}`,
});

// ponytail: databaseId di-cache di module scope — ID project/database tidak berubah saat runtime
let cachedDatabaseId: string | null = null;

async function getFirstDatabaseId(): Promise<string> {
  if (cachedDatabaseId) return cachedDatabaseId;

  const res = await fetch(`${BASE_URL}/databases`, { headers: headers() });
  if (!res.ok) throw new Error(`Prisma API databases failed: ${res.status}`);

  const body = (await res.json()) as { data: { id: string }[] };
  console.log("[prismaManagement] databases response:", JSON.stringify(body, null, 2));
  const db = body.data?.[0];
  if (!db?.id) throw new Error("No database found in Prisma workspace");

  cachedDatabaseId = db.id;
  return cachedDatabaseId;
}

export interface PrismaStorageUsage {
  usedBytes: number;
  limitBytes: number;
}

export async function getDatabaseStorageUsage(): Promise<PrismaStorageUsage | null> {
  try {
    const databaseId = await getFirstDatabaseId();
    const res = await fetch(`${BASE_URL}/databases/${databaseId}/usage`, {
      headers: headers(),
    });
    if (!res.ok) return null;

    const body = (await res.json()) as Record<string, unknown>;

    // Response format: { storage: { usedBytes, limitBytes } }
    const storage = body.storage as { usedBytes?: number; limitBytes?: number } | undefined;
    if (storage?.usedBytes != null && storage?.limitBytes != null) {
      return { usedBytes: storage.usedBytes, limitBytes: storage.limitBytes };
    }

    // Fallback: older format { metrics: { storage: { used, unit } } }
    const metrics = body.metrics as { storage?: { used?: number; unit?: string } } | undefined;
    if (metrics?.storage?.used != null) {
      const usedGiB = metrics.storage.used;
      const usedBytes = Math.round(usedGiB * 1024 * 1024 * 1024);
      return { usedBytes, limitBytes: 536870912 }; // 512 MB default limit
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch Prisma storage usage:", err);
    return null;
  }
}
