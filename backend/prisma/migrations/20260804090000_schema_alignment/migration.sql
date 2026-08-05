-- Rename columns to match the updated schema contract.
ALTER TABLE "Room" RENAME COLUMN "imageUrl" TO "image_url";

ALTER TABLE "Booking" RENAME COLUMN "createdAt" TO "Created_At";