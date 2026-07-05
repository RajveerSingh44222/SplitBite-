"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/shared/countdown";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { ParticipantCard } from "@/components/event/participant-card";
import { HostPanel } from "@/components/event/host-panel";
import { YourOrderCard } from "@/components/event/your-order-card";
import { AIModal } from "@/components/event/ai-modal";
import { EventHero } from "@/components/event/event-hero";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { mockRestaurants } from "@/mock/restaurants";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { ActivityItem, Participant, PartyEvent } from "@/types";

interface LiveEventProps {
  event: PartyEvent;
  me: Participant;
  isHost: boolean;
  activities: ActivityItem[];
}

/**
 * The fully interactive screen shown while an event is in the "collecting"
 * phase — countdown, invite link, restaurant browsing, host controls, and
 * the AI auto-select modal. Rendered only for that phase; every other
 * lifecycle state gets its own component so this one never has to guard
 * against "is this event actually still live?".
 */
export function LiveEvent({ event, me, isHost, activities }: LiveEventProps) {
  const router = useRouter();
  const autoSelectRemaining = useEventStore((s) => s.autoSelectRemaining);
  const showToast = useUIStore((s) => s.showToast);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const suggested = useMemo(
    () => mockRestaurants.filter((r) => event.suggestedRestaurantIds.includes(r.id)),
    [event.suggestedRestaurantIds]
  );
  const waitingCount = event.participants.filter((p) => p.status === "invited" || p.status === "browsing").length;

  function handleTimerComplete() {
    if (waitingCount > 0) {
      setAiModalOpen(true);
    } else {
      autoSelectRemaining(event.id);
      router.push(ROUTES.review(event.id));
    }
  }

  function handleAIComplete() {
    autoSelectRemaining(event.id);
  }

  function copyInvite() {
    showToast({
      title: "Invite link copied!",
      description: `partyplatter.app/join/${event.inviteCode}`,
      kind: "success",
    });
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <EventHero
          event={event}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={copyInvite}
              className="bg-white/15 text-white hover:bg-white/25"
            >
              <Link2 className="h-3.5 w-3.5" /> Copy invite link
            </Button>
          }
          rightPanel={
            <>
              <Countdown
                deadlineISO={event.deadlineISO}
                totalMs={event.inviteExpiryMins * 60 * 1000}
                onComplete={handleTimerComplete}
              />
              <span className="text-xs font-medium text-white/80">
                Budget: {formatCurrency(event.budgetPerPerson)}/person
              </span>
            </>
          }
        />
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <YourOrderCard event={event} me={me} />

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Suggested restaurants</h3>
              <Link
                href={ROUTES.restaurants(event.id)}
                className="flex items-center gap-1 text-xs font-semibold text-ember hover:underline"
              >
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {suggested.map((r) => (
                <Link key={r.id} href={ROUTES.restaurant(event.id, r.id)} className="shrink-0">
                  <motion.div whileHover={{ y: -3 }} className="w-40 overflow-hidden rounded-xl border border-border-subtle">
                    <div className="relative h-24 w-full">
                      <Image src={r.image} alt={r.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-xs font-semibold">{r.name}</p>
                      <p className="text-[11px] text-ink-soft">{r.rating} \u2605 &middot; {r.deliveryTimeMins} min</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Participants</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {event.participants.map((p, i) => (
                <ParticipantCard key={p.userId} participant={p} index={i} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          {isHost && <HostPanel event={event} />}

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Live activity</h3>
            <div className="mt-2 max-h-96 overflow-y-auto pr-1">
              <ActivityFeed items={activities} />
            </div>
          </div>

          {isHost && (
            <Link href={ROUTES.review(event.id)}>
              <Button size="lg" className="w-full">
                Review &amp; place order
              </Button>
            </Link>
          )}
        </aside>
      </div>

      <AIModal
        open={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          router.push(ROUTES.review(event.id));
        }}
        onComplete={handleAIComplete}
        guestCount={waitingCount}
      />
    </>
  );
}
