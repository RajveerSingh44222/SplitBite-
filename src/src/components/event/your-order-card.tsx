"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetBar } from "@/components/shared/budget-bar";
import type { Participant, PartyEvent } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants";

export function YourOrderCard({ event, me }: { event: PartyEvent; me: Participant }) {
  const isEmpty = me.cart.length === 0;

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
