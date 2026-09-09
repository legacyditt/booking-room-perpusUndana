"use client";

import React from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  onReset,
  resetLabel = "Reset Semua Filter",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
        {icon}
      </div>
      <p className="font-serif font-bold text-neutral-800 text-base">{title}</p>
      <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="mt-4 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
        >
          <ArrowCounterClockwise size={14} />
          {resetLabel}
        </Button>
      )}
    </div>
  );
}
