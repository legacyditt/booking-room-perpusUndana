import { client, unwrap } from "./client";

export interface WorkingDays {
  days: string[];
}

export function getWorkingDays(cookie?: string): Promise<WorkingDays> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/working-days", { headers }));
}

export function updateWorkingDays(days: string[]): Promise<WorkingDays> {
  return unwrap(client.put("/working-days", { days }));
}
