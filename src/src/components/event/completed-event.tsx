"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Download, Share2, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { DeliveryTimeline } from "@/components/shared/delivery-timeline";
import { RestaurantSummary } from "@/components/event/restaurant-summary";
import { EventHero } from "@/components/event/event-hero";
import { useUIStore } from "@/store/ui-store";
import { formatCurrency, averageEtaLabel } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { ActivityItem, PartyEvent } from "@/types";

interface CompletedEventProps {
  event: PartyEvent;
  activities: ActivityItem[];
}

/**
 * Fully read-only "view an old Swiggy order" screen for completed events.
 *
 * No countdown, no host panel, no AI modal, no review/place-order button,
 * no cart editing, no restaurant navigation, no invite controls — every
 * interactive affordance from the live screen is intentionally absent.
 * "Download invoice", "Share summary" and "Reorder event" are stubbed as
 * Coming Soon actions since there's no backend to power them yet.
 */
export function CompletedEvent({ event, activities }: CompletedEventProps) {
  const showToast = useUIStore((s) => s.showToast);

  const finalParticipants = event.participants.filter((p) => p.status !== "left");
  const grandTotal = finalParticipants.reduce((sum, p) => sum + p.cartValue, 0);
  const avgEta = averageEtaLabel(finalParticipants);

  function comingSoon(feature: string) {
    showToast({ title: `${feature} is coming soon`, kind: "info" });
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <EventHero
          event={event}
          eyebrow={
            <Badge variant="kasturi">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </Badge>
          }
          actions={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => comingSoon("Share summary")}
                className="bg-white/15 text-white hover:bg-white/25"
              >
                <Share2 className="h-3.5 w-3.5" /> Share summary
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => comingSoon("Reorder event")}
                className="bg-white/15 text-white hover:bg-white/25"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reorder event
              </Button>
            </>
          }
          rightPanel={
            <>
              <span className="font-display text-2xl font-semibold">{formatCurrency(grandTotal)}</span>
              <span className="text-xs font-medium text-white/80">
                Grand total &middot; {finalParticipants.length} orders
              </span>
            </>
          }
        />
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Delivery status</h3>
              <span className="flex items-center gap-1 text-sm font-semibold text-kasturi">
                <Clock3 className="h-4 w-4" /> Avg ETA {avgEta}
              </span>
            </div>
            <div className="mt-6">
              <DeliveryTimeline completedSteps={4} />
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Final orders</h3>
            <div className="mt-4 space-y-3">
              {finalParticipants.map((p) => (
                <div key={p.userId} className="flex items-center gap-3 rounded-xl border border-border-subtle p-3">
                  <Avatar src={p.avatar} name={p.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-ink-soft">{p.restaurantName ?? "\u2014"}</p>
                  </div>
                  <Badge variant={p.autoSelected ? "saffron" : "kasturi"}>
                    {p.autoSelected ? "AI Selected" : "Delivered"}
                  </Badge>
                  <span className="shrink-0 font-mono text-sm font-semibold">{formatCurrency(p.cartValue)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Restaurant summary</h3>
            <div className="mt-4">
              <RestaurantSummary participants={finalParticipants} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Order timeline</h3>
            <div className="mt-2 max-h-96 overflow-y-auto pr-1">
              <ActivityFeed items={activities} />
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <Button variant="outline" className="w-full justify-start" onClick={() => comingSoon("Download invoice")}>
              <Download className="h-4 w-4" /> Download invoice
            </Button>
            <Link href={ROUTES.dashboard}>
              <Button variant="subtle" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4" /> Back to dashboard
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
