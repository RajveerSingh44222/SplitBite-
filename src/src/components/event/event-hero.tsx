"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Crown } from "lucide-react";
import { AvatarGroup } from "@/components/ui/avatar";
import type { PartyEvent } from "@/types";
import { formatShortDate } from "@/lib/utils";

interface EventHeroProps {
  event: PartyEvent;
  /** The glass panel on the right — Countdown+budget for live, totals for completed. */
  rightPanel: ReactNode;
  /** Buttons rendered next to the avatar group (invite link, share, reorder...). */
  actions?: ReactNode;
  /** Small chip shown next to "Hosted by X", e.g. the Completed badge. */
  eyebrow?: ReactNode;
}

/**
 * Shared hero banner for the event detail screens.
 *
 * Extracted out of the old `[id]/page.tsx` so the Live and Completed screens
 * don't duplicate the gradient/grain header markup — only the slots that
 * differ between lifecycle states are passed in as props.
 */
export function EventHero({ event, rightPanel, actions, eyebrow }: EventHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-8 text-white shadow-lift sm:p-10"
      style={{ background: `linear-gradient(120deg, ${event.coverGradient[0]}, ${event.coverGradient[1]})` }}
    >
      <div className="grain absolute inset-0" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/80">
            <Crown className="h-3.5 w-3.5" /> Hosted by {event.hostName}
            {eyebrow}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{event.name}</h1>
          <p className="mt-2 max-w-lg text-white/85">{event.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatShortDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {event.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {event.participants.length} guests
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AvatarGroup users={event.participants} max={6} size={34} />
            {actions}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 self-center rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
          {rightPanel}
        </div>
      </div>
    </motion.div>
  );
}
