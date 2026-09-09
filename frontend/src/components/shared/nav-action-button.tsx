"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface NavActionButtonProps {
  href: string;
  label: string;
  pendingLabel?: string;
  icon: React.ReactNode;
  className?: string;
}

export function NavActionButton({
  href,
  label,
  pendingLabel = "Membuka...",
  icon,
  className = "bg-[#0F2018] text-white hover:bg-[#0F2018]/90",
}: NavActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(() => {
          router.push(href);
        });
      }}
      disabled={isPending}
      className={`gap-2 min-w-[140px] ${className}`}
    >
      {isPending ? (
        <>
          <CircleNotch className="w-4 h-4 animate-spin" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
