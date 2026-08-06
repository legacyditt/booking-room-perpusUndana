import axios from "axios";
import type { ApiResponse } from "@/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const client = axios.create({ baseURL });

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;
  return data.data;
}
