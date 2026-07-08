"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PartyPopper } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { EventCard } from "@/components/dashboard/event-card";
import { DashboardStats } from "@/components/dashboard/stats";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { useEventStore } from "@/store/event-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getEventPhase } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { Link2 } from "lucide-react";

type Tab = "upcoming" | "past";

function DashboardContent() {
  const currentUser = useCurrentUser();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => (searchParams.get("tab") === "past" ? "past" : "upcoming"));

  // If someone navigates here again with a different ?tab= while already on
  // the page (e.g. clicking "Past orders" from /profile while /dashboard is
  // already open in another tab/back-forward cache), keep the tab in sync.
  useEffect(() => {
    if (searchParams.get("tab") === "past") setTab("past");
  }, [searchParams]);

  const order = useEventStore((s) => s.order);
  const events = useEventStore((s) => s.events);
  const activities = useEventStore((s) => s.activities);

  const { isLoading } = useQuery({
    queryKey: ["dashboard-events"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 700));
      return true;
    },
  });
  const myEvents = useMemo(
  () => order.map((id) => events[id]).filter(Boolean),
  [order, events]
);

  // Uses the same lifecycle-phase mapping as the event router so an event
  // placed via "Place order" (status "ordered"/"delivered") lands in "Past"
  // immediately instead of lingering in "Upcoming" until its status
  // eventually became the literal string "completed".
  const upcoming = useMemo(() => myEvents.filter((e) => getEventPhase(e.status) !== "completed"), [myEvents]);
  const past = useMemo(() => myEvents.filter((e) => getEventPhase(e.status) === "completed"), [myEvents]);
  const hosted = useMemo(() => myEvents.filter((e) => e.hostId === currentUser.id), [myEvents, currentUser.id]);
  const joined = useMemo(() => myEvents.filter((e) => e.hostId !== currentUser.id), [myEvents, currentUser.id]);
  const shown = tab === "upcoming" ? upcoming : past;

  // "Recent activity" is a cross-event feed, so on its own each row is
  // ambiguous about which event it belongs to (e.g. "extended the timer by
  // 5 minutes" — which event?). We scope it to live events only (a
  // completed event's old activity isn't useful here) and hand the feed a
  // name lookup so it can show + link the event per row.
  const liveEvents = useMemo(() => myEvents.filter((e) => getEventPhase(e.status) !== "completed"), [myEvents]);
  const liveEventIds = useMemo(() => new Set(liveEvents.map((e) => e.id)), [liveEvents]);
  const eventNameById = useMemo(
    () => Object.fromEntries(liveEvents.map((e) => [e.id, e.name])),
    [liveEvents]
  );

  const recentActivity = useMemo(
    () =>
      Object.values(activities)
        .flat()
        .filter((a) => liveEventIds.has(a.eventId))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 6),
    [activities, liveEventIds]
  );

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Hey {currentUser.name.split(" ")[0]} \ud83d\udc4b
            </h1>
            <p className="mt-1 text-ink-soft">Here&apos;s what&apos;s happening with your gatherings.</p>
          </div>
          <div className="hidden gap-2 sm:flex">
  <Link href={ROUTES.joinEntry}>
    <Button size="lg" variant="outline">
      <Link2 className="h-4 w-4" />
      Join event
    </Button>
  </Link>
  <Link href={ROUTES.createEvent}>
    <Button size="lg" className="group">
      <Plus className="h-4 w-4" />
      Create event
    </Button>
  </Link>
</div>
        </div>

        <div className="mt-8">
          <DashboardStats upcoming={upcoming.length} past={past.length} hosted={hosted.length} joined={joined.length} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex items-center gap-2 border-b border-border-subtle">
              {(["upcoming", "past"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                    tab === t ? "text-ember" : "text-ink-soft hover:text-foreground"
                  }`}
                >
                  {t === "upcoming" ? "Upcoming events" : "Past events"}
                  {tab === t && (
                    <motion.div layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-ember" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-56 w-full" />
                  ))}
                </div>
              ) : shown.length === 0 ? (
                <EmptyState
                  icon={<PartyPopper className="h-9 w-9" />}
                  title={tab === "upcoming" ? "No upcoming events yet" : "No past events"}
                  description="Create your first event and share the link with your crew."
                  action={
                    <Link href={ROUTES.createEvent}>
                      <Button>Create your first event</Button>
                    </Link>
                  }
                />
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {shown.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>

          <aside>
            <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft">
              <h3 className="font-display text-base font-semibold">Recent activity</h3>
              <div className="mt-2">
                {recentActivity.length > 0 ? (
                  <ActivityFeed items={recentActivity} eventNames={eventNameById} />
                ) : (
                  <p className="py-6 text-center text-sm text-ink-soft">Nothing yet. Create an event to get started.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile FAB */}
      <Link href={ROUTES.createEvent} className="fixed bottom-6 right-6 z-30 sm:hidden">
        <motion.div
          whileTap={{ scale: 0.92 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-white shadow-lift"
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </Link>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
