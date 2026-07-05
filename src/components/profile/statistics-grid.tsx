"use client";

import { Crown, Users2, PiggyBank, UtensilsCrossed, Store, Wallet } from "lucide-react";
import { StatTile } from "@/components/profile/stat-tile";
import { formatCurrency } from "@/lib/utils";

interface StatisticsGridProps {
  hostedCount: number;
  joinedCount: number;
  moneySaved: number;
  favouriteCuisine: string;
  favouriteRestaurant: string;
  averageOrderValue: number;
}

export function StatisticsGrid({
  hostedCount,
  joinedCount,
  moneySaved,
  favouriteCuisine,
  favouriteRestaurant,
  averageOrderValue,
}: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatTile label="Hosted events" value={hostedCount} icon={Crown} colorClass="text-saffron bg-saffron/15" index={0} />
      <StatTile label="Joined events" value={joinedCount} icon={Users2} colorClass="text-kasturi bg-kasturi-light" index={1} />
      <StatTile
        label="Money saved"
        value={formatCurrency(moneySaved)}
        icon={PiggyBank}
        colorClass="text-ember bg-ember/10"
        index={2}
      />
      <StatTile
        label="Favourite cuisine"
        value={favouriteCuisine}
        icon={UtensilsCrossed}
        colorClass="text-chili bg-chili-light"
        index={3}
      />
      <StatTile label="Favourite restaurant" value={favouriteRestaurant} icon={Store} colorClass="text-ink-soft bg-surface-muted" index={4} />
      <StatTile
        label="Average order value"
        value={formatCurrency(averageOrderValue)}
        icon={Wallet}
        colorClass="text-saffron bg-saffron/15"
        index={5}
      />
    </div>
  );
}
