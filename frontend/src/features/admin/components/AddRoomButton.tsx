"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function AddRoomButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(() => {
          router.push("/admin/rooms/add");
        });
      }}
      disabled={isPending}
      className="bg-[#0F2018] text-white hover:bg-[#0F2018]/90 gap-2 min-w-[155px]"
    >
      {isPending ? (
        <>
          <CircleNotch className="w-4 h-4 animate-spin" />
          <span>Membuka...</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" weight="bold" />
          <span>Tambah Ruangan</span>
        </>
      )}
    </Button>
  );
}
