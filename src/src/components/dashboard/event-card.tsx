"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Wallet, Users, CheckCircle2 } from "lucide-react";
import type { PartyEvent } from "@/types";
import { AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import { formatShortDate, formatCurrency, getEventPhase, type EventPhase } from "@/lib/utils";

const PHASE_LABEL: Record<EventPhase, string> = {
  draft: "Draft",
  collecting: "Collecting orders",
  reviewing: "Reviewing",
  completed: "Completed",
};

/**
 * Clicking this card always goes to ROUTES.event(event.id) — the lifecycle
 * router at [id]/page.tsx decides whether that opens the Live or Completed
 * screen, so this component only needs to know which stats to surface.
 */
export function EventCard({ event, index = 0 }: { event: PartyEvent; index?: number }) {
  const phase = getEventPhase(event.status);
  const isCompleted = phase === "completed";
  const orderedCount = event.participants.filter((p) => p.status === "ordered" || p.status === "auto-selected").length;
  const grandTotal = event.participants.reduce((sum, p) => sum + p.cartValue, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link href={ROUTES.event(event.id)}>
        <div className="group overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-soft transition-shadow hover:shadow-lift">
          <div
            className="relative h-24 w-full"
            style={{ background: `linear-gradient(120deg, ${event.coverGradient[0]}, ${event.coverGradient[1]})` }}
          >
            <div className="absolute right-3 top-3">
              <Badge variant={isCompleted ? "default" : "ember"} className="bg-white/90 text-ink shadow-soft">
                {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                {PHASE_LABEL[phase]}
              </Badge>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-ember">{event.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatShortDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {event.time}
              </span>
              {isCompleted ? (
                <span className="flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5" /> {formatCurrency(grandTotal)} total
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5" /> {formatCurrency(event.budgetPerPerson)}/person
                </span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1 truncate text-xs text-ink-soft">
              <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.address}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <AvatarGroup users={event.participants} max={4} size={28} />
              <span className="flex items-center gap-1 text-xs font-medium text-ink-soft">
                {isCompleted ? (
                  <>
                    <Users className="h-3.5 w-3.5" /> {event.participants.length} participants
                  </>
                ) : (
                  `${orderedCount}/${event.participants.length} ordered`
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
