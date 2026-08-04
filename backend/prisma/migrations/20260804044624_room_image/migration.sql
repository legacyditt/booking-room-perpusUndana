/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `isPerSeat` on the `Room` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "isAvailable",
DROP COLUMN "isPerSeat",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
