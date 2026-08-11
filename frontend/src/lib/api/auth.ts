import { client } from "./client";

export function requestPasswordReset(email: string): Promise<void> {
  return client.post("/api/auth/forgot-password", { email });
}

export function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  return client.post("/api/auth/reset-password", { token, password });
}
