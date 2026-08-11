import { headers } from "next/headers";

export async function getCookieHeader(): Promise<{ cookie: string }> {
  const header = await headers();
  return { cookie: header.get("cookie") ?? "" };
}
