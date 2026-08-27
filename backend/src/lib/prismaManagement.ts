import prisma from "./prisma.js";

export interface PrismaStorageUsage {
  usedBytes: number;
  limitBytes: number;
}

// ponytail: 512 MB — Neon free tier storage limit
const NEON_FREE_TIER_LIMIT = 536_870_912;

export async function getDatabaseStorageUsage(): Promise<PrismaStorageUsage | null> {
  try {
    const result = await prisma.$queryRaw<{ used_bytes: bigint }[]>`
      SELECT pg_database_size(current_database()) AS used_bytes
    `;

    const usedBytes = Number(result[0]?.used_bytes ?? 0);
    return { usedBytes, limitBytes: NEON_FREE_TIER_LIMIT };
  } catch (err) {
    console.error("Failed to fetch database storage usage:", err);
    return null;
  }
}
