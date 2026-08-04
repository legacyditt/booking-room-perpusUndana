import Image from "next/image";
import { Room } from "@/types/room";

interface RoomImageGalleryProps {
  room: Room;
}

export function RoomImageGallery({ room }: RoomImageGalleryProps) {
  return (
    <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[450px] rounded-xl overflow-hidden shadow-lg">
      <Image
        src={room.imageUrl || "/placeholder-room.jpg"}
        alt={room.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-sm font-medium tracking-wider uppercase opacity-80">
          Booking Ruangan
        </p>
        <h2 className="text-2xl font-serif font-bold">{room.name}</h2>
      </div>
    </div>
  );
}
