-- AlterTable
ALTER TABLE "user" ADD COLUMN "reset_token" TEXT;
ALTER TABLE "user" ADD COLUMN "reset_token_expiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_reset_token_key" ON "user"("reset_token");
