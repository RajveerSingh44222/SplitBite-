"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Link2, ArrowRight, Crown } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";
import { Countdown } from "@/components/shared/countdown";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { ParticipantCard } from "@/components/event/participant-card";
import { HostPanel } from "@/components/event/host-panel";
import { YourOrderCard } from "@/components/event/your-order-card";
import { AIModal } from "@/components/event/ai-modal";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { currentUser } from "@/mock/users";
import { mockRestaurants } from "@/mock/restaurants";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { ROUTES } from "@/constants";

const EMPTY_ACTIVITIES: never[] = [];
export default function EventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const event = useEventStore((s) => s.events[params.id]);
  const activities = useEventStore((s) => s.activities[params.id] ?? EMPTY_ACTIVITIES);
  const autoSelectRemaining = useEventStore((s) => s.autoSelectRemaining);
  const showToast = useUIStore((s) => s.showToast);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const me = useMemo(() => event?.participants.find((p) => p.userId === currentUser.id), [event]);
  const isHost = event?.hostId === currentUser.id;

  if (!event || !me) {
    return (
      <main className="min-h-screen">
        <Navbar authed />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Event not found</h1>
          <p className="mt-2 text-ink-soft">This event may have expired or the link is incorrect.</p>
          <Link href={ROUTES.dashboard}>
            <Button className="mt-6">Back to dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  const suggested = mockRestaurants.filter((r) => event.suggestedRestaurantIds.includes(r.id));
  const waitingCount = event.participants.filter((p) => p.status === "invited" || p.status === "browsing").length;

  function handleTimerComplete() {
    if (event.status === "collecting" && waitingCount > 0) {
      setAiModalOpen(true);
    } else if (event.status === "collecting") {
      autoSelectRemaining(event.id);
      router.push(ROUTES.review(event.id));
    }
  }

  function handleAIComplete() {
    autoSelectRemaining(event.id);
  }

  function copyInvite() {
    showToast({ title: "Invite link copied!", description: `partyplatter.app/join/${event.inviteCode}`, kind: "success" });
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />

      {/* Hero header */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
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
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{event.name}</h1>
              <p className="mt-2 max-w-lg text-white/85">{event.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatShortDate(event.date)}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.address}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {event.participants.length} guests</span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <AvatarGroup users={event.participants} max={6} size={34} />
                <Button variant="secondary" size="sm" onClick={copyInvite} className="bg-white/15 text-white hover:bg-white/25">
                  <Link2 className="h-3.5 w-3.5" /> Copy invite link
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 self-center rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <Countdown deadlineISO={event.deadlineISO} totalMs={event.inviteExpiryMins * 60 * 1000} onComplete={handleTimerComplete} />
              <span className="text-xs font-medium text-white/80">Budget: {formatCurrency(event.budgetPerPerson)}/person</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <YourOrderCard event={event} me={me} />

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Suggested restaurants</h3>
              <Link href={ROUTES.restaurants(event.id)} className="flex items-center gap-1 text-xs font-semibold text-ember hover:underline">
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
    </main>
  );
}
