import Image from "next/image";
import { Room } from "@/types/room";

interface RoomImageGalleryProps {
  room: Room;
}

export function RoomImageGallery({ room }: RoomImageGalleryProps) {
  return (
    <div className="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-[450px] rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
      <Image
        src={(room.imageUrlDisplay ?? room.imageUrl) || "/placeholder-room.jpg"}
        alt={room.name}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
