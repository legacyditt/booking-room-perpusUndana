import { randomUUID } from "crypto";
import path from "path";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PRESIGN_EXPIRES_IN = 3600;

const getS3Client = (): { client: S3Client; bucket: string } => {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.S3_BUCKET;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Missing S3 configuration. Check S3_* env vars.");
  }

  return {
    client: new S3Client({
      endpoint,
      region: "auto",
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    }),
    bucket,
  };
};

export async function uploadRoomImage(file: {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}): Promise<string> {
  const { client, bucket } = getS3Client();
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const key = `rooms/${randomUUID()}${ext}`;

  await client.send(
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

  const { client, bucket } = getS3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: imageUrl }),
    { expiresIn: PRESIGN_EXPIRES_IN },
  );
}

export async function deleteRoomImage(imageUrl: string): Promise<void> {
  if (!imageUrl || imageUrl.startsWith("http")) return;

  const { client, bucket } = getS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: imageUrl }));
}
