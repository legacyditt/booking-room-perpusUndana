"use client";

import { useState } from "react";
import { isBefore, startOfDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservationCard } from "@/features/reservations/components/ReservationCard";
import { mockBookings, mockSessions as librarySessions, mockRooms } from "@/data/mock";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";

export function ReservationClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const today = startOfDay(new Date());

  const upcomingBookings = mockBookings.filter((booking) => !isBefore(booking.date, today));
  const pastBookings = mockBookings.filter((booking) => isBefore(booking.date, today));

  const filterBookings = (bookings: typeof mockBookings) => {
    return bookings.filter((booking) => {
      const room = mockRooms.find((r) => r.id === booking.roomId);
      const matchesSearch = room?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredUpcoming = filterBookings(upcomingBookings);
  const filteredPast = filterBookings(pastBookings);

  return (
    <div className="w-full">
      {/* Control Bar (Search & Filter) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass className="h-5 w-5 text-neutral/50" />
          </div>
          <Input
            type="text"
            placeholder="Cari ruangan..."
            className="pl-10 w-full h-11 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
            <SelectTrigger className="w-full h-11 bg-white">
              <div className="flex items-center gap-2 flex-1 text-left">
                <Funnel className="h-4 w-4 text-neutral/60 shrink-0" />
                <span className="line-clamp-1">
                  {statusFilter === "ALL" && "Semua Status"}
                  {statusFilter === "PENDING" && "Menunggu"}
                  {statusFilter === "APPROVED" && "Dikonfirmasi"}
                  {statusFilter === "REJECTED" && "Ditolak"}
                  {statusFilter === "CANCELLED" && "Dibatalkan"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">Menunggu</SelectItem>
              <SelectItem value="APPROVED">Dikonfirmasi</SelectItem>
              <SelectItem value="REJECTED">Ditolak</SelectItem>
              <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs Area */}
      <Tabs defaultValue="upcoming" className="w-full">
        {/* Bagian List Tab (Garis) */}
        <TabsList
          variant="line"
          className="mb-6 w-full justify-start pb-0 gap-6 sm:gap-8 overflow-x-auto no-scrollbar"
        >
          <TabsTrigger
            value="upcoming"
            className="text-sm font-bold uppercase tracking-wider pb-3 px-1 whitespace-nowrap text-neutral/60 data-active:text-primary !border-0 !border-b-2 !border-transparent data-active:!border-primary transition-colors rounded-none after:hidden"
          >
            Mendatang
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="text-sm font-bold uppercase tracking-wider pb-3 px-1 whitespace-nowrap text-neutral/60 data-active:text-primary !border-0 !border-b-2 !border-transparent data-active:!border-primary transition-colors rounded-none after:hidden"
          >
            Riwayat
          </TabsTrigger>
        </TabsList>

        {/* Konten Upcoming */}
        <TabsContent value="upcoming" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {filteredUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
              {filteredUpcoming.map((booking) => {
                const room = mockRooms.find((r) => r.id === booking.roomId);
                const session = librarySessions.find((s) => s.id === booking.sessionId);
                if (!room || !session) return null;
                return (
                  <ReservationCard
                    key={booking.id}
                    booking={booking}
                    room={room}
                    session={session}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 text-neutral/50 font-medium border-2 border-dashed border-border rounded-xl bg-white/50">
              {upcomingBookings.length > 0 ? "Tidak ada pemesanan yang cocok dengan pencarian Anda." : "Belum ada pemesanan yang akan datang."}
            </div>
          )}
        </TabsContent>

        {/* Konten Past */}
        <TabsContent value="past" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {filteredPast.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
              {filteredPast.map((booking) => {
                const room = mockRooms.find((r) => r.id === booking.roomId);
                const session = librarySessions.find((s) => s.id === booking.sessionId);
                if (!room || !session) return null;
                return (
                  <ReservationCard
                    key={booking.id}
                    booking={booking}
                    room={room}
                    session={session}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 text-neutral/50 font-medium border-2 border-dashed border-border rounded-xl bg-white/50">
              {pastBookings.length > 0 ? "Tidak ada pemesanan yang cocok dengan pencarian Anda." : "Riwayat pemesanan kosong."}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
