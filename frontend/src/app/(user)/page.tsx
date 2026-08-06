import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { RoomList } from "@/features/home/components/RoomList";
import { getRooms } from "@/lib/api";
import type { Room } from "@/types/room";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let rooms: Room[] = [];
  try {
    rooms = await getRooms();
  } catch {
    rooms = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
            Ruang Belajar Tersedia
          </h1>
          <p className="text-neutral mt-2 sm:mt-0 font-medium">
            Menampilkan {rooms.length} hasil
          </p>
        </div>

        <RoomList rooms={rooms} />
      </main>

      <Footer />
    </div>
  );
}
