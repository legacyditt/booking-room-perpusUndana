"use client";

import { useState } from "react";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { RoomCard } from "@/features/home/components/RoomCard";
import { mockRooms } from "@/data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const [roomType, setRoomType] = useState<"reguler" | "premium">("reguler");

  // Simulasi Filter ruangan berdasarkan Tipe Ruangan
  const filteredRooms = mockRooms.filter((room) => {
    // Simulasi Tipe Ruangan: Anggap Ruang 1 & 2 Reguler, 3 & 4 Premium
    const typeMock = (room.id === 1 || room.id === 2) ? "reguler" : "premium";
    return typeMock === roomType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">
        <Tabs
          defaultValue="reguler"
          onValueChange={(v) => setRoomType(v as "reguler" | "premium")}
          className="w-full"
        >
          {/* Header Row: Judul, Tabs, dan Info Hasil */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary">
              Ruang Belajar Tersedia
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0">
              <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:flex h-11 p-1">
                <TabsTrigger value="reguler">Reguler</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
              </TabsList>
              
              <div className="hidden sm:block w-px h-6 bg-neutral/20" />
              
              <p className="text-neutral text-sm font-medium pl-1 sm:pl-0">
                {filteredRooms.length} Ruangan
              </p>
            </div>
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
              Tidak ada ruangan yang sesuai dengan filter Anda.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
