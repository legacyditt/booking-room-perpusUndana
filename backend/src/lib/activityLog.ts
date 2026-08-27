import prisma from "./prisma.js";

export const logActivity = (
  adminId: string,
  action: string,
  detail?: string,
) =>
  prisma.adminActivityLog
    .create({ data: { adminId, action, detail } })
    .catch((error) => console.error("Activity log failed:", error));
