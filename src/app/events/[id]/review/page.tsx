"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { RouteNotFound } from "@/components/shared/route-not-found";
import { ReviewEvent } from "@/components/event/review-event";
import { useEventStore } from "@/store/event-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROUTES } from "@/constants";

/**
 * Thin route wrapper. All the actual review UI now lives in
 * components/event/review-event.tsx so it can also be rendered by the main
 * [id]/page.tsx router when an event's status is "reviewing" — this file
 * just adds the page chrome (Navbar + back link) specific to this URL.
 */
export default function ReviewPage() {
  const currentUser = useCurrentUser();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const event = useEventStore((s) => s.events[params.id]);
  const isHost = event?.hostId === currentUser.id;

  if (!event) {
    return (
      <RouteNotFound
        title="Event not found"
        description="This event may have expired, been deleted, or the link is incorrect."
      />
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <button
          onClick={() => router.push(ROUTES.event(event.id))}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {event.name}
        </button>
      </div>
      <ReviewEvent event={event} isHost={isHost} />
    </main>
  );
}
