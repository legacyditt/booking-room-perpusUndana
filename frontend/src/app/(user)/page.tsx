import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { RoomCard } from "@/features/home/components/RoomCard";
import { HomeTabs } from "@/features/home/components/HomeTabs";
import { TabsContent } from "@/components/ui/tabs";
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

  // ponytail: no type field in DB; premium = has bookingPrice
  const premiumRooms = rooms.filter((room) => !!room.bookingPrice);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">
        <HomeTabs regulerCount={rooms.length - premiumRooms.length} premiumCount={premiumRooms.length}>
          <TabsContent value="reguler" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sewa" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </TabsContent>
        </HomeTabs>

        {rooms.length === 0 && (
          <div className="py-20 text-center text-neutral bg-muted rounded-lg mt-8">
            <p className="text-lg">
              Tidak ada ruangan yang sesuai dengan filter Anda.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
