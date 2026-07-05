"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { BudgetBar } from "@/components/shared/budget-bar";
import { EmptyState } from "@/components/shared/empty-state";
import type { CartLine } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer({
  open,
  onClose,
  restaurantName,
  cart,
  budget,
  onUpdateQty,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  restaurantName?: string;
  cart: CartLine[];
  budget: number;
  onUpdateQty: (menuItemId: string, delta: number) => void;
  onCheckout: () => void;
}) {
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  return (
    <Drawer open={open} onClose={onClose} title="Your cart">
      {cart.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Your cart is empty"
            description="Add some food to get started."
          />
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto p-5">
            <p className="mb-3 text-sm text-ink-soft">
              Ordering from <span className="font-semibold text-foreground">{restaurantName}</span>
            </p>
            {cart.map((item) => (
              <motion.div
                layout
                key={item.menuItemId}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="flex items-center gap-3 border-b border-border-subtle/60 py-3 last:border-0"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-ink-soft">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border-subtle px-1 py-1">
                  <button
                    onClick={() => onUpdateQty(item.menuItemId, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-muted"
                    aria-label="Decrease quantity"
                  >
                    {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-chili" /> : <Minus className="h-3 w-3" />}
                  </button>
                  <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.menuItemId, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4 border-t border-border-subtle p-5">
            <BudgetBar spent={subtotal} budget={budget} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <Button size="lg" className="w-full" onClick={onCheckout} disabled={subtotal > budget}>
              {subtotal > budget ? "Remove items to place order" : "Confirm my order"}
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
