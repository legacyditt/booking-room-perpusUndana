-- Rename tables and columns to snake_case.
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Room" RENAME TO "rooms";
ALTER TABLE "Session" RENAME TO "sessions";
ALTER TABLE "Booking" RENAME TO "bookings";
ALTER TABLE "BookingPrice" RENAME TO "booking_prices";

ALTER TABLE "rooms" RENAME COLUMN "imageUrl" TO "image_url";

ALTER TABLE "sessions" RENAME COLUMN "startTime" TO "start_time";
ALTER TABLE "sessions" RENAME COLUMN "finishTime" TO "finish_time";

ALTER TABLE "bookings" RENAME COLUMN "roomId" TO "room_id";
ALTER TABLE "bookings" RENAME COLUMN "sessionId" TO "session_id";
ALTER TABLE "bookings" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "bookings" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "booking_prices" RENAME COLUMN "roomId" TO "room_id";