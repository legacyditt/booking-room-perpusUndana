import Link from "next/link";
import { Users, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  // Simulasi nilai yang dihapus dari Room type
  const isAvailableMock = room.id !== "4";
  const descriptionMock = room.id === "1" ? "Ruangan yang tenang dan intim, sempurna untuk penelitian mandiri atau sesi bimbingan pribadi." : 
                          room.id === "4" ? "Ruangan luas yang dirancang untuk diskusi kelompok besar, kuliah, atau lokakarya akademik." :
                          "Dilengkapi dengan layar presentasi, ideal untuk proyek kelompok dan persiapan seminar.";

  return (
    <Card className="overflow-hidden border-border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Gambar+Ruangan";
          }}
        />
        <Badge
          variant="outline"
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-white/95 text-foreground hover:bg-white shadow-sm rounded-full"
        >
          <CheckCircle
            weight="fill"
            className={isAvailableMock ? "text-green-600" : "text-neutral"}
          />
          {isAvailableMock ? "Tersedia" : "Tidak Tersedia"}
        </Badge>
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

      <CardContent className="pb-6">
        <p className="text-sm leading-relaxed text-neutral/80 min-h-[60px]">
          {descriptionMock}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-6">
        {room.isAvailable ? (
          <Link
            href={`/room/${room.id}`}
            className={buttonVariants({
              variant: "outlinePrimary",
              className: "px-6",
            })}
          >
            Pesan Ruangan
          </Link>
        ) : (
          <Button variant="outlinePrimary" disabled className="px-6">
            Pesan Ruangan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
