"use client";

import { useState } from "react";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { RoomCard } from "@/features/home/components/RoomCard";
import { RoomFilters } from "@/features/home/components/RoomFilters";
import { mockRooms } from "@/data/mockRooms";

export default function HomePage() {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const filteredRooms = mockRooms.filter(room => {
    if (showAvailableOnly) {
      return room.isAvailable;
    }
    return true; 
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
            Menampilkan {filteredRooms.length} hasil
          </p>
        </div>

        <RoomFilters 
          showAvailableOnly={showAvailableOnly} 
          onShowAvailableOnlyChange={setShowAvailableOnly} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        
        {filteredRooms.length === 0 && (
          <div className="py-20 text-center text-neutral bg-muted rounded-lg mt-8">
            <p className="text-lg">Tidak ada ruangan yang sesuai dengan filter Anda.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
