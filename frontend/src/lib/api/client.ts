import axios from "axios";
import type { ApiResponse } from "@/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const client = axios.create({ baseURL });
// Interceptor Global untuk menangkap error dari seluruh pemanggilan API
client.interceptors.response.use(
  (response) => {
    // Jika response sukses, teruskan response seperti biasa
    return response;
  },
  (error) => {
    // Jika terjadi error, cek apakah statusnya 401 (Unauthorized / Sesi Habis)
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Redirect paksa ke halaman login dengan membawa parameter error.
        window.location.href = "/login?error=session_expired";
      }
    }
    return Promise.reject(error);
  },
);

export async function unwrap<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  const { data } = await promise;
  return data.data;
}
