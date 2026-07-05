"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, ShoppingBag, Mail, Sparkles } from "lucide-react";
import type { PartyEvent } from "@/types";
import type { ProfileInvitation } from "@/mock/profile";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants";
import { formatCurrency, formatShortDate } from "@/lib/utils";

export interface RecentOrderEntry {
  id: string;
  eventId: string;
  eventName: string;
  restaurantName: string;
  cartValue: number;
  aiSelected: boolean;
  timestamp: string;
}

type Tab = "events" | "orders" | "invitations";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function RecentActivityPanel({
  latestEvents,
  latestOrders,
  invitations,
}: {
  latestEvents: PartyEvent[];
  latestOrders: RecentOrderEntry[];
  invitations: ProfileInvitation[];
}) {
  const [tab, setTab] = useState<Tab>("events");

  const tabs: { id: Tab; label: string }[] = [
    { id: "events", label: "Latest events" },
    { id: "orders", label: "Latest orders" },
    { id: "invitations", label: "Invitations" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-center gap-1 border-b border-border-subtle">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id ? "text-ember" : "text-ink-soft hover:text-foreground"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.div layoutId="profile-tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-ember" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tab === "events" && (
            <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {latestEvents.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-soft">No events yet.</p>
              ) : (
                <ul className="divide-y divide-border-subtle/60">
                  {latestEvents.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={ROUTES.event(event.id)}
                        className="flex items-center gap-3 py-3 transition-colors hover:bg-surface-muted/60 -mx-2 px-2 rounded-xl"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                          style={{ background: `linear-gradient(120deg, ${event.coverGradient[0]}, ${event.coverGradient[1]})` }}
                        >
                          <CalendarClock className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{event.name}</p>
                          <p className="text-xs text-ink-soft">{formatShortDate(event.date)} · {event.participants.length} guests</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {tab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {latestOrders.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="h-8 w-8" />}
                  title="No orders yet"
                  description="Your placed orders will show up here."
                  className="py-10"
                />
              ) : (
                <ul className="divide-y divide-border-subtle/60">
                  {latestOrders.map((order) => (
                    <li key={order.id} className="flex items-center gap-3 py-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember">
                        <ShoppingBag className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{order.restaurantName}</p>
                        <p className="text-xs text-ink-soft">{order.eventName} · {timeAgo(order.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.aiSelected && (
                          <Badge variant="saffron">
                            <Sparkles className="h-3 w-3" /> AI
                          </Badge>
                        )}
                        <span className="text-sm font-semibold">{formatCurrency(order.cartValue)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {tab === "invitations" && (
            <motion.div key="invitations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {invitations.length === 0 ? (
                <EmptyState
                  icon={<Mail className="h-8 w-8" />}
                  title="No invitations"
                  description="You're all caught up."
                  className="py-10"
                />
              ) : (
                <ul className="divide-y divide-border-subtle/60">
                  {invitations.map((inv) => (
                    <li key={inv.id} className="flex items-center gap-3 py-3">
                      <Avatar src={inv.hostAvatar} name={inv.hostName} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          <span className="font-semibold">{inv.hostName}</span>{" "}
                          <span className="text-ink-soft">invited you to {inv.eventName}</span>
                        </p>
                        <p className="text-xs text-ink-soft/70">{timeAgo(inv.timestamp)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
