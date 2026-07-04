"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Star } from "lucide-react";
import type { Restaurant } from "@/types";
import { cn } from "@/lib/utils";

export function RestaurantChip({
  restaurant,
  selected,
  onToggle,
}: {
  restaurant: Restaurant;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-2.5 pr-4 text-left transition-colors",
        selected ? "border-ember bg-ember/5" : "border-border-subtle bg-surface hover:border-ink-soft/30"
      )}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
        <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" unoptimized />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{restaurant.name}</p>
        <p className="flex items-center gap-1 text-xs text-ink-soft">
          <Star className="h-3 w-3 fill-saffron text-saffron" /> {restaurant.rating} &middot; {restaurant.cuisines[0]}
        </p>
      </div>
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-ember bg-ember text-white" : "border-border-subtle"
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </div>
    </motion.button>
  );
}
