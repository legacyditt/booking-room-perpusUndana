import { client, unwrap } from "./client";

export function uploadRoomImage(file: File): Promise<{ key: string }> {
  const formData = new FormData();
  formData.append("image", file);
  return unwrap(client.post("/uploads/room-image", formData));
}
