"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetBar } from "@/components/shared/budget-bar";
import type { Participant, PartyEvent } from "@/types";
import { formatCurrency, msUntil } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { buildReminderFacts } from "@/lib/ai-scoring";
import { buildFallbackExplanation, explainWithAI } from "@/lib/ai-explain";
import { ROUTES } from "@/constants";

/**
 * Feature 4 — Smart Personalized Reminders. While the current user hasn't
 * ordered yet, this reuses the same cuisine/budget matching logic as
 * auto-ordering (rule-based, instant) to nudge them toward what they'd
 * probably want, then upgrades the copy with an LLM-phrased sentence.
 */
function useReminderText(event: PartyEvent) {
  const user = useCurrentUser();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const minutesLeft = Math.max(1, Math.round(msUntil(event.deadlineISO) / 60000));
    const facts = buildReminderFacts(user, event.budgetPerPerson, event.suggestedRestaurantIds, minutesLeft);

    setText(buildFallbackExplanation("reminder", facts));
    explainWithAI("reminder", facts).then((upgraded) => {
      if (!cancelled) setText(upgraded);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id, event.deadlineISO, event.budgetPerPerson]);

  return text;
}

export function YourOrderCard({ event, me }: { event: PartyEvent; me: Participant }) {
  const isEmpty = me.cart.length === 0;
  const reminderText = useReminderText(event);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Your order</h3>
        {!isEmpty && (
          <Link href={ROUTES.restaurants(event.id)} className="flex items-center gap-1 text-xs font-semibold text-ember hover:underline">
            <Pencil className="h-3 w-3" /> Edit
          </Link>
        )}
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ember/10 text-ember"
          >
            <ShoppingBag className="h-9 w-9" />
          </motion.div>
          <p className="font-medium">You haven&apos;t ordered yet</p>
          <p className="mt-1 max-w-[220px] text-sm text-ink-soft">
            Browse nearby restaurants and add food within your {formatCurrency(event.budgetPerPerson)} budget.
          </p>
          {reminderText && (
            <p className="mt-3 flex max-w-[280px] items-start gap-1.5 rounded-xl bg-ember/5 px-3 py-2 text-left text-xs text-foreground">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" />
              {reminderText}
            </p>
          )}
          <Link href={ROUTES.restaurants(event.id)} className="mt-5 w-full">
            <Button className="group w-full">
              Add food
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-soft">Ordering from <span className="font-semibold text-foreground">{me.restaurantName}</span></p>
          <div className="space-y-2.5">
            {me.cart.map((item) => (
              <div key={item.menuItemId} className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-ink-soft">Qty {item.quantity}</p>
                </div>
                <span className="font-mono text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <BudgetBar spent={me.cartValue} budget={event.budgetPerPerson} />
        </div>
      )}
    </div>
  );
}
