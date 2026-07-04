"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Wallet } from "lucide-react";
import type { PartyEvent } from "@/types";
import { AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import { formatShortDate, formatCurrency } from "@/lib/utils";

const STATUS_LABEL: Record<PartyEvent["status"], string> = {
  draft: "Draft",
  collecting: "Collecting orders",
  reviewing: "Reviewing",
  ordered: "Order placed",
  delivered: "Delivered",
  completed: "Completed",
};

export function EventCard({ event, index = 0 }: { event: PartyEvent; index?: number }) {
  const orderedCount = event.participants.filter((p) => p.status === "ordered" || p.status === "auto-selected").length;

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
              <Badge variant={event.status === "completed" ? "default" : "ember"} className="bg-white/90 text-ink shadow-soft">
                {STATUS_LABEL[event.status]}
              </Badge>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-ember">{event.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatShortDate(event.date)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.time}</span>
              <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" /> {formatCurrency(event.budgetPerPerson)}/person</span>
            </div>
            <p className="mt-2 flex items-center gap-1 truncate text-xs text-ink-soft">
              <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.address}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <AvatarGroup users={event.participants} max={4} size={28} />
              <span className="text-xs font-medium text-ink-soft">
                {orderedCount}/{event.participants.length} ordered
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
