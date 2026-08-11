import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { SessionForm } from "@/features/admin/components/SessionForm";
import { getSession } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditSessionPage({ params }: PageProps) {
  const { id } = await params;

  let session;
  try {
    session = await getSession(Number(id));
  } catch {
    notFound();
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* ── Header Section ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/sessions"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2E8F0] text-neutral-500 hover:text-primary hover:border-primary/40 transition-colors shrink-0"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
          Edit Sesi
        </h1>
      </div>

      {/* ── Form Section ── */}
      <SessionForm
        session={{
          id: session.id,
          name: session.name,
          startTime: session.startTime,
          finishTime: session.finishTime,
        }}
      />
    </div>
  );
}
