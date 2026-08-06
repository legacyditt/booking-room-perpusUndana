import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { RoomForm } from "@/features/admin/components/RoomForm";
import { mockAdminRooms } from "@/data/mock";

interface PageProps {
  params: Promise<{ id: string }>;
}

function parseCapacity(value: string) {
  return String(parseInt(value, 10) || 0);
}

function parsePrice(value: string) {
  return String(parseInt(value.replace(/[^\d]/g, ""), 10) || 0);
}

export default async function EditRoomPage({ params }: PageProps) {
  const { id } = await params;
  const room = mockAdminRooms.find((r) => r.id === Number(id));

  if (!room) {
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
          name: room.roomName,
          capacity: parseCapacity(room.capacity),
          imageUrl: room.imageUrl,
          price: parsePrice(room.price),
        }}
      />
    </div>
  );
}
