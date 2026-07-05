"use client";

import { motion } from "framer-motion";
import { Trash2, Pencil, CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { PartyEvent } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { formatCurrency } from "@/lib/utils";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";

export function HostPanel({ event }: { event: PartyEvent }) {
  const removeParticipant = useEventStore((s) => s.removeParticipant);
  const showToast = useUIStore((s) => s.showToast);

  const total = event.participants.length;
  const ordered = event.participants.filter((p) => p.status === "ordered").length;
  const auto = event.participants.filter((p) => p.status === "auto-selected").length;
  const waiting = total - ordered - auto;
  const progress = total > 0 ? ((ordered + auto) / total) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Host panel</h3>
        <span className="text-xs font-medium text-ink-soft">Only you can see this</span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <ProgressRing progress={progress} size={76} color="var(--color-kasturi)">
          <span className="font-mono text-sm font-semibold">{Math.round(progress)}%</span>
        </ProgressRing>
        <div className="grid flex-1 grid-cols-3 gap-3 text-center">
          <div>
            <p className="flex items-center justify-center gap-1 text-xs text-ink-soft"><CheckCircle2 className="h-3.5 w-3.5 text-kasturi" /> Ordered</p>
            <p className="mt-1 font-display text-xl font-semibold">{ordered}</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-xs text-ink-soft"><Clock className="h-3.5 w-3.5" /> Waiting</p>
            <p className="mt-1 font-display text-xl font-semibold">{waiting}</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-xs text-ink-soft"><Sparkles className="h-3.5 w-3.5 text-saffron" /> Auto</p>
            <p className="mt-1 font-display text-xl font-semibold">{auto}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 max-h-80 space-y-2 overflow-y-auto pr-1">
        {event.participants.map((p) => (
          <motion.div
            key={p.userId}
            layout
            className="flex items-center gap-3 rounded-xl border border-border-subtle p-3"
          >
            <Avatar src={p.avatar} name={p.name} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="truncate text-xs text-ink-soft">
                {p.restaurantName ?? "\u2014"} {p.eta && `\u00b7 ${p.eta}`}
              </p>
            </div>
            <span className="shrink-0 font-mono text-sm font-semibold">{p.cartValue > 0 ? formatCurrency(p.cartValue) : "\u2014"}</span>
            {!p.isHost && (
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => showToast({ title: `Editing ${p.name}'s order`, kind: "info" })}
                  className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-muted"
                  aria-label={`Edit ${p.name}'s order`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    removeParticipant(event.id, p.userId);
                    showToast({ title: `${p.name} removed from event`, kind: "info" });
                  }}
                  className="rounded-lg p-1.5 text-ink-soft hover:bg-chili-light hover:text-chili"
                  aria-label={`Remove ${p.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
