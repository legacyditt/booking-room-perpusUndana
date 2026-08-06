"use client";

import { useEffect, useState } from "react";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { RoomCard } from "@/features/home/components/RoomCard";
import { RoomFilters } from "@/features/home/components/RoomFilters";
import { getRooms } from "@/lib/api";
import type { Room } from "@/types/room";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [roomType, setRoomType] = useState<"reguler" | "premium">("reguler");

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const isPremium = !!room.bookingPrice;
    const type = isPremium ? "premium" : "reguler";
    // ponytail: no availability field in DB; the "Tersedia" toggle always passes
    return type === roomType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
            Ruang Belajar Tersedia
          </h1>
          <p className="text-neutral mt-2 sm:mt-0 font-medium">
            {isLoading ? "Memuat..." : `Menampilkan ${filteredRooms.length} hasil`}
          </p>
        </div>

        {/* Komponen Filter dan Tabs */}
        <Tabs
          defaultValue="reguler"
          onValueChange={(v) => setRoomType(v as "reguler" | "premium")}
          className="w-full mt-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <RoomFilters
              showAvailableOnly={showAvailableOnly}
              onShowAvailableOnlyChange={setShowAvailableOnly}
            />

            <TabsList className="flex w-full sm:w-auto">
              <TabsTrigger value="reguler">Reguler</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reguler" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredRooms.length === 0 && (
          <div className="py-20 text-center text-neutral bg-muted rounded-lg mt-8">
            <p className="text-lg">
              {isLoading ? "Memuat ruangan..." : "Tidak ada ruangan yang sesuai dengan filter Anda."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
