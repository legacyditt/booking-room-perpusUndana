const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${apiUrl}/api/auth/forget-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, redirectTo: `${window.location.origin}/reset-password` }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Gagal mengirim tautan reset.");
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword: password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Gagal mereset kata sandi.");
  }
}
