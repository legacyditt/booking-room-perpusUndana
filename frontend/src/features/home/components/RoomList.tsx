"use client";

import { useState } from "react";
import { RoomCard } from "./RoomCard";
import { RoomFilters } from "./RoomFilters";
import type { Room } from "@/types/room";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoomListProps {
  rooms: Room[];
}

export function RoomList({ rooms }: RoomListProps) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [roomType, setRoomType] = useState<"reguler" | "premium">("reguler");

  const filteredRooms = rooms.filter((room) => {
    const isPremium = !!room.bookingPrice;
    const type = isPremium ? "premium" : "reguler";
    // ponytail: no availability field in DB; the "Tersedia" toggle always passes
    return type === roomType;
  });

  return (
    <>
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
            Tidak ada ruangan yang sesuai dengan filter Anda.
          </p>
        </div>
      )}
    </>
  );
}
