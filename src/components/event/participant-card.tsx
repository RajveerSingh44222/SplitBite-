"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, Clock3 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Participant } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ParticipantCard({ participant, index = 0 }: { participant: Participant; index?: number }) {
  const p = participant;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft"
    >
      <div className="relative shrink-0">
        <Avatar src={p.avatar} name={p.name} size={44} />
        {p.isHost && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-white shadow-soft">
            <Crown className="h-2.5 w-2.5" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold">{p.name}</p>
          {p.autoSelected && <Sparkles className="h-3.5 w-3.5 shrink-0 text-saffron" />}
        </div>
        <p className="truncate text-xs text-ink-soft">
          {p.restaurantName ?? "Hasn't picked a restaurant yet"}
        </p>
        {p.autoSelected && p.autoSelectReason && (
          <p className="mt-0.5 line-clamp-2 text-[11px] italic text-ink-soft/70">{p.autoSelectReason}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={p.status} />
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          {p.eta && (
            <span className="flex items-center gap-0.5">
              <Clock3 className="h-3 w-3" /> {p.eta}
            </span>
          )}
          {p.cartValue > 0 && <span className="font-mono font-semibold text-foreground">{formatCurrency(p.cartValue)}</span>}
        </div>
      </div>
    </motion.div>
  );
}
