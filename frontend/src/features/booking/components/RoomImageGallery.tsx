import Image from "next/image";
import { Room } from "@/types/room";

interface RoomImageGalleryProps {
  room: Room;
}

export function RoomImageGallery({ room }: RoomImageGalleryProps) {
  return (
    <div className="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-[450px] rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
      <Image
        src={room.imageUrl || "/placeholder-room.jpg"}
        alt={room.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
        <p className="text-xs sm:text-sm font-medium tracking-wider uppercase opacity-80">
          Booking Ruangan
        </p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold">{room.name}</h2>
      </div>
    </div>
  );
}
