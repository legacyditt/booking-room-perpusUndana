import {
  getSystemSettings,
  updateSystemSettings,
  SystemSettings,
} from "./settings";

export type WorkingDays = Pick<SystemSettings, "days">;

export function getWorkingDays(cookie?: string): Promise<WorkingDays> {
  return getSystemSettings(cookie);
}

export function updateWorkingDays(days: string[]): Promise<WorkingDays> {
  return updateSystemSettings({ days });
}
