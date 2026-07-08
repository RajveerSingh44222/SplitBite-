"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/ui-store";
import { ROUTES } from "@/constants";

/** Pulls the invite code out of either a raw code or a full pasted link. */
function extractCode(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? trimmed;
  } catch {
    // Not a full URL — treat as a raw code or a path fragment, e.g.
    // "DIWALI-8F2K" or "/join/DIWALI-8F2K" or "splitbite.app/join/DIWALI-8F2K"
    const parts = trimmed.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }
}

export default function JoinEntryPage() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = extractCode(value);
    if (!code) {
      showToast({ title: "Enter an invite code or link first", kind: "error" });
      return;
    }
    router.push(ROUTES.join(code));
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-paper-dim px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(circle at 20% 10%, var(--color-ember) 0%, transparent 45%)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-8 shadow-lift sm:p-10"
      >
        <Link href={ROUTES.home} className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ember text-white">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          SplitBite
        </Link>

        <h1 className="text-center font-display text-2xl font-semibold">Join an event</h1>
        <p className="mt-1.5 text-center text-sm text-ink-soft">Paste your invite link, or just the code</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="Invite link or code"
            icon={<Link2 className="h-4 w-4" />}
            placeholder="splitbite.app/join/DIWALI-8F2K"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <Button type="submit" size="lg" className="group w-full">
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-soft">
          Don&apos;t have an invite?{" "}
          <Link href={ROUTES.signup} className="font-semibold text-ember hover:underline">
            Create your own event
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
