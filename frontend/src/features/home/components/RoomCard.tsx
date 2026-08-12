"use client"
import Link from "next/link";
import { Users } from "@phosphor-icons/react/dist/ssr";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
  mode: "reguler" | "sewa";
}

export function RoomCard({ room, mode }: RoomCardProps) {
  const href = `/room/${room.id}${mode === "sewa" ? "?mode=sewa" : ""}`;
  return (
    <Card className="pt-0 overflow-hidden border-border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video sm:aspect-[4/3] w-full bg-muted">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Gambar+Ruangan";
          }}
        />
      </div>

      <CardHeader className="space-y-2 pb-4">
        <h3 className="font-serif text-2xl font-bold text-primary">
          {room.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{room.capacity} Orang</span>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="pt-4 pb-6 px-6">
        <Link
          href={href}
          className={buttonVariants({
            variant: "outlinePrimary",
            className: "w-full min-h-[44px]",
          })}
        >
          Pesan Ruangan
        </Link>
      </CardFooter>
    </Card>
  );
}
