"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Flame } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useState } from "react";

const VegIcon = ({ isVeg }: { isVeg: boolean }) => (
  <span
    className={cn(
      "flex h-4 w-4 items-center justify-center rounded-sm border-2",
      isVeg ? "border-kasturi" : "border-chili"
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", isVeg ? "bg-kasturi" : "bg-chili")} />
  </span>
);

export function FoodCard({
  item,
  quantity,
  remainingBudget,
  onAdd,
  onRemove,
  index = 0,
}: {
  item: MenuItem;
  quantity: number;
  remainingBudget: number;
  onAdd: () => void;
  onRemove: () => void;
  index?: number;
}) {
  const [favorite, setFavorite] = useState(false);
  const exceedsBudget = quantity === 0 && item.price > remainingBudget;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.03 }}
      className={cn(
        "flex gap-4 rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft transition-opacity",
        exceedsBudget && "opacity-50"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <VegIcon isVeg={item.isVeg} />
          {item.isBestseller && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-saffron">
              <Flame className="h-3 w-3" /> Bestseller
            </span>
          )}
        </div>
        <h4 className="mt-1.5 truncate font-display text-base font-semibold">{item.name}</h4>
        <p className="mt-0.5 font-mono text-sm font-semibold">{formatCurrency(item.price)}</p>
        <p className="mt-1.5 line-clamp-2 text-xs text-ink-soft">{item.description}</p>
        {exceedsBudget && <p className="mt-1.5 text-xs font-semibold text-chili">Exceeds budget</p>}
      </div>

      <div className="relative w-28 shrink-0">
        <div className="relative h-24 w-28 overflow-hidden rounded-xl">
          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
        </div>
        <button
          onClick={() => setFavorite((f) => !f)}
          aria-label="Favorite"
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-soft"
        >
          <Heart className={cn("h-3 w-3", favorite ? "fill-chili text-chili" : "text-ink-soft")} />
        </button>

        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onAdd}
              disabled={exceedsBudget}
              className={cn(
                "rounded-lg border bg-surface px-4 py-1.5 text-xs font-bold shadow-soft transition-colors",
                exceedsBudget
                  ? "cursor-not-allowed border-border-subtle text-ink-soft"
                  : "border-ember text-ember hover:bg-ember hover:text-white"
              )}
            >
              ADD
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 rounded-lg border border-ember bg-surface px-2 py-1.5 shadow-soft"
            >
              <button onClick={onRemove} aria-label="Remove one" className="text-ember">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-4 text-center text-xs font-bold">{quantity}</span>
              <button onClick={onAdd} aria-label="Add one" disabled={item.price > remainingBudget} className="text-ember disabled:opacity-30">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
