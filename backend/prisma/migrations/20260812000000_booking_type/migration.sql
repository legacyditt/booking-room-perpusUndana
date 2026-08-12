-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('SEAT', 'ROOM');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "type" "BookingType" NOT NULL DEFAULT 'SEAT';
