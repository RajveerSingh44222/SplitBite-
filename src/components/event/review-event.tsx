"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock3, Sparkles, ArrowRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { PartyEvent } from "@/types";

interface ReviewEventProps {
  event: PartyEvent;
  /** Only the host may finalize the combined order. */
  isHost: boolean;
}

/**
 * The Reviewing-phase screen. No countdown, no cart editing for guests —
 * this is where the host approves everyone's order and places the single
 * combined order. Used both as the body of `/events/[id]/review` and as
 * the router's rendering for `status === "reviewing"` so the logic only
 * lives in one place.
 */
export function ReviewEvent({ event, isHost }: ReviewEventProps) {
  const router = useRouter();
  const placeEventOrder = useEventStore((s) => s.placeEventOrder);
  const showToast = useUIStore((s) => s.showToast);
  const [placing, setPlacing] = useState(false);

  const readyParticipants = event.participants.filter((p) => p.status === "ordered" || p.status === "auto-selected");
  const notReadyParticipants = event.participants.filter((p) => p.status === "invited" || p.status === "browsing");
  const grandTotal = event.participants.reduce((sum, p) => sum + p.cartValue, 0);
  const estimatedDelivery = `${25 + Math.floor(Math.random() * 15)}-${45 + Math.floor(Math.random() * 10)} min`;

  function handlePlaceOrder() {
    setPlacing(true);
    setTimeout(() => {
      placeEventOrder(event.id);
      setPlacing(false);
      showToast({ title: "Order placed!", description: "Everyone will get their food soon", kind: "success" });
      router.push(ROUTES.success(event.id));
    }, 1400);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pt-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Review the full order</h1>
      <p className="mt-1 text-ink-soft">
        Double-check everyone&apos;s order before {isHost ? "you place it as one" : "the host places it"}.
      </p>

      {notReadyParticipants.length > 0 && (
        <div className="mt-6 rounded-2xl border border-saffron/30 bg-saffron/10 p-4 text-sm">
          <p className="font-semibold text-ink">
            {notReadyParticipants.length} guest{notReadyParticipants.length !== 1 ? "s haven't" : " hasn't"} ordered yet
          </p>
          <p className="mt-0.5 text-ink-soft">Wait for the timer, or let AI auto-select for them from the event page.</p>
        </div>
      )}

      {readyParticipants.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<PackageSearch className="h-9 w-9" />}
          title="No orders yet"
          description="Once your guests order, their food will show up here for review."
        />
      ) : (
        <div className="mt-6 space-y-4">
          {readyParticipants.map((p, i) => (
            <motion.div
              key={p.userId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={p.avatar} name={p.name} size={40} />
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      {p.name}
                      {p.autoSelected && <Sparkles className="h-3.5 w-3.5 text-saffron" />}
                    </p>
                    <p className="text-xs text-ink-soft">{p.restaurantName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">{formatCurrency(p.cartValue)}</p>
                  {p.eta && (
                    <p className="flex items-center justify-end gap-1 text-xs text-ink-soft">
                      <Clock3 className="h-3 w-3" /> {p.eta}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-1 border-t border-border-subtle pt-3">
                {p.cart.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm text-ink-soft">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              {p.autoSelected && p.autoSelectReason && (
                <p className="mt-3 flex items-start gap-1.5 border-t border-border-subtle pt-3 text-xs italic text-ink-soft">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-saffron" />
                  {p.autoSelectReason}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-6 mt-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-lift"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-ink-soft">Grand total &middot; {readyParticipants.length} orders</p>
            <p className="font-display text-2xl font-semibold">{formatCurrency(grandTotal)}</p>
            <p className="mt-0.5 text-xs text-ink-soft">Estimated delivery: {estimatedDelivery}</p>
          </div>
          {isHost ? (
            <Button
              size="lg"
              loading={placing}
              disabled={readyParticipants.length === 0}
              onClick={handlePlaceOrder}
              className="group"
            >
              Place order
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <span className="text-sm font-medium text-ink-soft">Waiting for the host to place the order</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
