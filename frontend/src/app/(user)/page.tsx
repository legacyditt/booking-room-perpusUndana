import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { RoomCard } from "@/features/home/components/RoomCard";
import { HomeTabs } from "@/features/home/components/HomeTabs";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { HouseSimple } from "@phosphor-icons/react/dist/ssr";
import { getRooms } from "@/lib/api";
import { getCookieHeader } from "@/lib/api/server";
import type { Room } from "@/types/room";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let rooms: Room[] = [];
  try {
    rooms = await getRooms((await getCookieHeader()).cookie);
  } catch {
    rooms = [];
  }

  // sewa = has bookingPrice
  const sewaRooms = rooms.filter((room) => !!room.bookingPrice);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">
        <HomeTabs regulerCount={rooms.length - sewaRooms.length} sewaCount={sewaRooms.length}>
          <TabsContent value="reguler" className="mt-0">
            {rooms.length === 0 ? (
              <EmptyState
                icon={<HouseSimple size={32} weight="duotone" />}
                title="Tidak Ada Ruangan Tersedia"
                description="Saat ini belum ada ruangan perpustakaan yang tersedia untuk dipesan."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} mode="reguler" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sewa" className="mt-0">
            {sewaRooms.length === 0 ? (
              <EmptyState
                icon={<HouseSimple size={32} weight="duotone" />}
                title="Tidak Ada Ruangan Sewa"
                description="Saat ini belum ada ruangan perpustakaan dalam kategori sewa komersial."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sewaRooms.map((room) => (
                  <RoomCard key={room.id} room={room} mode="sewa" />
                ))}
              </div>
            )}
          </TabsContent>
        </HomeTabs>
      </main>

      <Footer />
    </div>
  );
}
