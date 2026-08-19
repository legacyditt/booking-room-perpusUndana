import { client, unwrap } from "./client";

export const DEFAULT_WHATSAPP_TEMPLATE = `Halo Admin Perpustakaan Undana,

Saya ingin melakukan konfirmasi pemesanan sewa ruangan:
• Ruangan: {ruangan}
• Tanggal: {tanggal}
• Sesi: {sesi}
• Total Biaya: {total_biaya}

Mohon informasi terkait pembayaran dan petunjuk selanjutnya untuk menyelesaikan proses sewa. Terima kasih.`;

export interface SystemSettings {
  days: string[];
  whatsapp: string;
  whatsappTemplate?: string;
}

export interface UpdateSystemSettingsInput {
  days?: string[];
  whatsapp?: string;
  whatsappTemplate?: string;
}

/**
 * Mengganti variabel placeholder seperti {ruangan}, {tanggal}, {sesi}, {total_biaya}
 * dengan data riil pemesanan.
 */
export function formatWhatsappTemplate(
  template: string = DEFAULT_WHATSAPP_TEMPLATE,
  variables: Record<string, string>,
): string {
  let result = template || DEFAULT_WHATSAPP_TEMPLATE;
  for (const [key, val] of Object.entries(variables)) {
    // Replace all occurrences of {key} or { key }
    const regex = new RegExp(`{\\s*${key}\\s*}`, "g");
    result = result.replace(regex, val);
  }
  return result;
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
