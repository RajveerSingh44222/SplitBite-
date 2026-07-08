"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Wallet, UtensilsCrossed, ArrowRight, Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteNotFound } from "@/components/shared/route-not-found";
import { Input } from "@/components/ui/input";
import { AvatarGroup } from "@/components/ui/avatar";
import { Countdown } from "@/components/shared/countdown";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { ROUTES } from "@/constants";

export default function JoinPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const events = useEventStore((s) => s.events);
  const joinEvent = useEventStore((s) => s.joinEvent);
  const pushActivity = useEventStore((s) => s.pushActivity);
  const showToast = useUIStore((s) => s.showToast);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);

  const event = useMemo(
    () => Object.values(events).find((e) => e.inviteCode.toLowerCase() === params.code.toLowerCase()),
    [events, params.code]
  );

  if (!event) {
    return (
      <RouteNotFound
        authed={false}
        icon={Link2Off}
        title="Invite not found"
        description="This link may have expired, or the invite code was typed incorrectly."
        action={
          <Link href={ROUTES.home}>
            <Button size="lg">Go home</Button>
          </Link>
        }
      />
    );
  }

  function handleJoin() {
    setJoining(true);
    setTimeout(() => {
      const { alreadyJoined } = joinEvent(event!.id, name.trim());
      const displayName = name.trim() || currentUser.name;

      if (!alreadyJoined) {
        pushActivity(event!.id, {
          type: "joined",
          actorName: displayName,
          actorAvatar: currentUser.avatar,
          message: "joined the event",
          timestamp: new Date().toISOString(),
        });
      }

      setJoining(false);
      showToast({
        title: alreadyJoined ? `Welcome back, ${displayName}!` : `Welcome, ${displayName}!`,
        kind: "success",
      });
      router.push(ROUTES.event(event!.id));
    }, 900);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ background: `linear-gradient(120deg, ${event.coverGradient[0]}, ${event.coverGradient[1]})` }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-lift"
      >
        <div
          className="relative flex h-32 items-end p-6 text-white"
          style={{ background: `linear-gradient(120deg, ${event.coverGradient[0]}, ${event.coverGradient[1]})` }}
        >
          <div className="grain absolute inset-0" />
          <div className="relative flex items-center gap-2 font-display text-sm font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
              <UtensilsCrossed className="h-3.5 w-3.5" />
            </span>
            SplitBite Invite
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{event.name}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{event.description}</p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatShortDate(event.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.address}</span>
            <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4" /> {formatCurrency(event.budgetPerPerson)}/person</span>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-surface-muted p-4">
            <div className="flex items-center gap-3">
              <AvatarGroup users={event.participants} max={5} size={30} />
              <span className="flex items-center gap-1 text-sm text-ink-soft">
                <Users className="h-4 w-4" /> {event.participants.length} joined
              </span>
            </div>
            <Countdown deadlineISO={event.deadlineISO} totalMs={event.inviteExpiryMins * 60 * 1000} size="sm" />
          </div>

          <div className="mt-6 space-y-3">
            <Input label="Your name" placeholder="Enter your name to join" value={name} onChange={(e) => setName(e.target.value)} />
            <Button size="lg" loading={joining} onClick={handleJoin} className="group w-full">
              Join event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-center text-xs text-ink-soft">No account needed. You can create one later to save your order history.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
