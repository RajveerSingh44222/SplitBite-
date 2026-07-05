"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Flame } from "lucide-react";
import type { Restaurant } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function RestaurantCard({
  restaurant,
  href,
  index = 0,
}: {
  restaurant: Restaurant;
  href: string;
  index?: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -5 }}
    >
      <Link href={href}>
        <div className="group overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-soft transition-shadow hover:shadow-lift">
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            {restaurant.offer && (
              <div className="absolute left-3 top-3">
                <Badge variant="ember" className="bg-white/95 shadow-soft">
                  <Flame className="h-3 w-3" /> {restaurant.offer}
                </Badge>
              </div>
            )}
            {restaurant.isPromoted && (
              <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                Promoted
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-display text-base font-semibold transition-colors group-hover:text-ember">
                {restaurant.name}
              </h3>
              <span className="flex shrink-0 items-center gap-1 rounded-md bg-kasturi px-1.5 py-0.5 text-xs font-semibold text-white">
                <Star className="h-3 w-3 fill-current" /> {restaurant.rating}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-ink-soft">{restaurant.cuisines.join(", ")}</p>
            <div className="mt-2.5 flex items-center justify-between text-xs text-ink-soft">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {restaurant.deliveryTimeMins} min</span>
              <span>{formatCurrency(restaurant.priceForTwo)} for two</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
