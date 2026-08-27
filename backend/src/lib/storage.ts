import { randomUUID } from "crypto";
import path from "path";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const bucket = process.env.S3_BUCKET;

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
  throw new Error("Missing S3 configuration. Check S3_* env vars.");
}

export const s3 = new S3Client({
  endpoint,
  region: "auto",
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

const PRESIGN_EXPIRES_IN = 3600;

export async function uploadRoomImage(file: {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}): Promise<string> {
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const key = `rooms/${randomUUID()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return key;
}

export async function getRoomImageUrl(imageUrl: string): Promise<string> {
  if (!imageUrl || imageUrl.startsWith("http")) return imageUrl;

  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: imageUrl }),
    { expiresIn: PRESIGN_EXPIRES_IN },
  );
}

export async function deleteRoomImage(imageUrl: string): Promise<void> {
  if (!imageUrl || imageUrl.startsWith("http")) return;

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: imageUrl }));
}
