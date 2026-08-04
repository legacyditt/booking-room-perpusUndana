"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Room } from "@/types/room";
import { Session } from "@/types/booking";

interface BookingDetailsFormProps {
  room: Room;
  sessions: Session[];
}

export function BookingDetailsForm({
  room,
  sessions,
}: BookingDetailsFormProps) {
  // State tanggal menggunakan objek Date (bukan string lagi) agar kompatibel dengan Shadcn Calendar
  const [date, setDate] = useState<Date | undefined>();
  const [selectedSession, setSelectedSession] = useState<string>("");

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-border/50 rounded-xl shadow-sm h-full">
      {/* Header Info */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-serif font-bold text-primary">
          {room.name}
        </h1>
      </div>

      {/* Booking Form Area */}
      <div className="flex flex-col gap-4 flex-1">
        <h3 className="font-bold text-lg text-primary">Booking Details</h3>

        {/* Input Tanggal  */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral uppercase tracking-wider">
            Pilih Tanggal
          </label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start text-left font-normal px-4 py-4 bg-background shadow-sm",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-neutral" />
              {date ? (
                format(date, "PPPP", { locale: id })
              ) : (
                <span>Pilih Tanggal Pemesanan</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Input Sesi */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral uppercase tracking-wider">
            Sesi Tersedia
          </label>
          <Select
            value={selectedSession}
            onValueChange={(val) => setSelectedSession(val || "")}
          >
            <SelectTrigger className="w-full px-4 py-4 border-border bg-background shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-neutral shrink-0" />
                <SelectValue placeholder="Pilih Waktu Sesi">
                  {selectedSession
                    ? sessions
                        .filter((s) => s.id === selectedSession)
                        .map((s) => `${s.name} (${s.timeRange})`)
                    : "Pilih Waktu Sesi"}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.id} className="py-3">
                  {s.name} ({s.timeRange})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info Kapasitas ) */}
        <div className="flex items-center gap-3 py-3 px-4 bg-muted/50 rounded-md border border-border mt-auto">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-neutral">
            Kapasitas Saat Ini :{" "}
            <span className="text-primary font-bold">0 / {room.capacity}</span>{" "}
            Orang
          </span>
        </div>

        {/* Action Button */}
        <Button className="w-full py-5 text-base font-bold shadow-md mt-2">
          <CalendarIcon className="w-5 h-5 mr-2" weight="bold" />
          Pesan Sekarang
        </Button>
      </div>
    </div>
  );
}
