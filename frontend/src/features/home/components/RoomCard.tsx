"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
  mode: "reguler" | "sewa";
}

export function RoomCard({ room, mode }: RoomCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageLoaded, setImageLoaded] = useState(false);

  const href = `/room/${room.id}${mode === "sewa" ? "?mode=sewa" : ""}`;

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (isPending) return;

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Card className="pt-0 overflow-hidden border-border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video sm:aspect-[4/3] w-full bg-muted overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-neutral-200/60 animate-pulse" />
        )}
        <img
          src={room.imageUrlDisplay ?? room.imageUrl}
          alt={room.name}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
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
          onClick={handleNavigate}
          aria-disabled={isPending}
          className={cn(
            buttonVariants({
              variant: "outlinePrimary",
              className: "w-full min-h-[44px] transition-all",
            }),
            isPending && "pointer-events-none opacity-80 cursor-wait",
          )}
        >
          {isPending ? (
            <>
              <CircleNotch className="w-4 h-4 animate-spin mr-2" />
              Memuat...
            </>
          ) : (
            "Pesan Ruangan"
          )}
        </Link>
      </CardFooter>
    </Card>
  );
}
