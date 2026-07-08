"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { UserX } from "lucide-react";
import { RouteNotFound } from "@/components/shared/route-not-found";
import { Navbar } from "@/components/layout/navbar";
import { LiveEvent } from "@/components/event/live-event";
import { ReviewEvent } from "@/components/event/review-event";
import { CompletedEvent } from "@/components/event/completed-event";
import { DraftEvent } from "@/components/event/draft-event";
import { useEventStore } from "@/store/event-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getEventPhase } from "@/lib/utils";

const EMPTY_ACTIVITIES: never[] = [];

/**
 * Event lifecycle router.
 *
 * This file used to render every widget for every event unconditionally,
 * which is why completed events used to show a countdown, an AI modal, and
 * a "place order" button for an order that was placed days ago. Now it only
 * decides *which* screen to render — all real UI lives in
 * components/event/{live,review,completed,draft}-event.tsx.
 */
export default function EventPage() {
  const currentUser = useCurrentUser();
  const params = useParams<{ id: string }>();
  const event = useEventStore((s) => s.events[params.id]);
  const activities = useEventStore((s) => s.activities[params.id] ?? EMPTY_ACTIVITIES);

  const me = useMemo(() => event?.participants.find((p) => p.userId === currentUser.id), [event, currentUser.id]);
  const isHost = event?.hostId === currentUser.id;

  if (!event) {
    return (
      <RouteNotFound
        title="Event not found"
        description="This event may have expired, been deleted, or the link is incorrect."
      />
    );
  }

  const phase = getEventPhase(event.status);

  // A collecting-phase event needs "your" participant record to render
  // YourOrderCard — if that's ever missing, fail safe instead of crashing.
  if (phase === "collecting" && !me) {
    return (
      <RouteNotFound
        icon={UserX}
        title="You're not part of this event yet"
        description="Ask the host for the invite link to join."
      />
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />
      {phase === "draft" && <DraftEvent event={event} />}
      {phase === "collecting" && me && (
        <LiveEvent event={event} me={me} isHost={isHost} activities={activities} />
      )}
      {phase === "reviewing" && <ReviewEvent event={event} isHost={isHost} />}
      {phase === "completed" && <CompletedEvent event={event} activities={activities} />}
    </main>
  );
}
