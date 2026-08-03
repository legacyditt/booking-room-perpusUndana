import {
  Users,
  CheckCircle,
  WifiHigh,
  Monitor,
  ProjectorScreen,
  Chalkboard,
} from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
}

// Pattern: Helper fungsi untuk mapping string ke komponen icon
function renderFeatureIcon(iconName: string) {
  switch (iconName) {
    case "wifi":
      return <WifiHigh className="h-4 w-4" />;
    case "monitor":
      return <Monitor className="h-4 w-4" />;
    case "projector":
      return <ProjectorScreen className="h-4 w-4" />;
    case "whiteboard":
      return <Chalkboard className="h-4 w-4" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden border-border bg-white shadow-sm transition-all hover:shadow-md">
      {/* 1. Bagian Gambar & Status Ketersediaan */}
      <div className="relative aspect-[4/3] w-full bg-muted">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Room+Image";
          }}
        />
        <Badge
          variant="outline"
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-white/95 text-foreground hover:bg-white shadow-sm rounded-full"
        >
          <CheckCircle
            weight="fill"
            className={room.isAvailable ? "text-green-600" : "text-neutral"}
          />
          {room.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>

      {/* 2. Judul & Fasilitas */}
      <CardHeader className="space-y-2 pb-4">
        <h3 className="font-serif text-2xl font-bold text-primary">
          {room.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{room.capacity}</span>
          </div>
        </div>
      </CardHeader>

      {/* 3. Deskripsi */}
      <CardContent className="pb-6">
        <p className="text-sm leading-relaxed text-neutral/80 min-h-[60px]">
          {room.description}
        </p>
      </CardContent>

      <Separator className="bg-border/60" />

      {/* 4. Harga & Tombol */}
      <CardFooter className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <span className="text-xs text-neutral">Price per session</span>
          <span className="text-lg font-bold text-primary">
            ${room.pricePerSession.toFixed(2)}
          </span>
        </div>
        <Button
          variant="outline"
          disabled={!room.isAvailable}
          className="border-primary text-primary hover:bg-primary hover:text-white rounded-md px-6"
        >
          Book Room
        </Button>
      </CardFooter>
    </Card>
  );
}
