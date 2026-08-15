import { client, unwrap } from "./client";

export interface WorkingDays {
  days: string[];
}

export function getWorkingDays(): Promise<WorkingDays> {
  return unwrap(client.get("/working-days"));
}

export function updateWorkingDays(days: string[]): Promise<WorkingDays> {
  return unwrap(client.put("/working-days", { days }));
}
