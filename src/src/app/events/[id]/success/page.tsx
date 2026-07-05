"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, PartyPopper } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";
import { Confetti } from "@/components/shared/confetti";
import { DeliveryTimeline } from "@/components/shared/delivery-timeline";
import { useEventStore } from "@/store/event-store";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants";

export default function SuccessPage() {
  const params = useParams<{ id: string }>();
  const event = useEventStore((s) => s.events[params.id]);

  if (!event) {
    return (
      <main className="min-h-screen">
        <Navbar authed />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Event not found</h1>
        </div>
      </main>
    );
  }

  const orderedParticipants = event.participants.filter((p) => p.cart.length > 0);
  const grandTotal = orderedParticipants.reduce((sum, p) => sum + p.cartValue, 0);

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <Confetti />
      <Navbar authed />

      <div className="mx-auto max-w-2xl px-6 pt-12 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-kasturi text-white shadow-lift"
        >
          <PartyPopper className="h-11 w-11" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Order placed for {event.name}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-ink-soft"
        >
          {orderedParticipants.length} orders &middot; {formatCurrency(grandTotal)} total
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex justify-center">
          <AvatarGroup users={orderedParticipants} max={8} size={36} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl border border-border-subtle bg-surface p-6 text-left shadow-soft"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Delivery timeline</h3>
            <span className="flex items-center gap-1 text-sm font-semibold text-ember">
              <Clock3 className="h-4 w-4" /> ETA 35-45 min
            </span>
          </div>
          <div className="mt-6">
            <DeliveryTimeline completedSteps={2} />
          </div>

          <div className="mt-6 space-y-2 border-t border-border-subtle pt-4">
            {orderedParticipants.map((p) => (
              <div key={p.userId} className="flex justify-between text-sm">
                <span className="text-ink-soft">{p.name} &middot; {p.restaurantName}</span>
                <span className="font-mono font-semibold">{formatCurrency(p.cartValue)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8">
          <Link href={ROUTES.dashboard}>
            <Button size="lg">Back to dashboard</Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
