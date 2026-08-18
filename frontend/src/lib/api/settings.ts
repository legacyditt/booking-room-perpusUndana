import { client, unwrap } from "./client";

export interface SystemSettings {
  days: string[];
  whatsapp: string;
}

export interface UpdateSystemSettingsInput {
  days?: string[];
  whatsapp?: string;
}

export function getSystemSettings(cookie?: string): Promise<SystemSettings> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/settings", { headers }));
}

export function updateSystemSettings(
  input: UpdateSystemSettingsInput,
): Promise<SystemSettings> {
  return unwrap(client.put("/settings", input));
}
