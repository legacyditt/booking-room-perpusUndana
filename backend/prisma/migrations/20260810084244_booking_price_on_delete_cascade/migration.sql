-- DropForeignKey
ALTER TABLE "booking_prices" DROP CONSTRAINT "booking_prices_room_id_fkey";

-- AddForeignKey
ALTER TABLE "booking_prices" ADD CONSTRAINT "booking_prices_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
