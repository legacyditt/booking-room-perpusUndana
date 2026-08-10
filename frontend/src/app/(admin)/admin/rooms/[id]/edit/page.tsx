import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { RoomForm } from "@/features/admin/components/RoomForm";
import { getRoom } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditRoomPage({ params }: PageProps) {
  const { id } = await params;

  let room;
  try {
    room = await getRoom(Number(id));
  } catch {
    notFound();
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* ── Header Section ── */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin/rooms"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2E8F0] text-neutral-500 hover:text-primary hover:border-primary/40 transition-colors shrink-0"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
          Edit Ruangan
        </h1>
      </div>

      {/* ── Form Section ── */}
      <RoomForm
        room={{
          id: room.id,
          name: room.name,
          capacity: String(room.capacity),
          imageUrl: room.imageUrl,
          price: room.bookingPrice ? String(room.bookingPrice.price) : "0",
          hasBookingPrice: !!room.bookingPrice,
        }}
      />
    </div>
  );
}
