import { formatCurrency } from "@/lib/utils";
import type { Participant } from "@/types";

interface RestaurantGroup {
  name: string;
  count: number;
  total: number;
}

function groupByRestaurant(participants: Participant[]): RestaurantGroup[] {
  const map = new Map<string, RestaurantGroup>();
  participants.forEach((p) => {
    const name = p.restaurantName ?? "Unassigned";
    const existing = map.get(name);
    if (existing) {
      existing.count += 1;
      existing.total += p.cartValue;
    } else {
      map.set(name, { name, count: 1, total: p.cartValue });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

/** Read-only breakdown of the final order grouped by restaurant. Completed-screen only. */
export function RestaurantSummary({ participants }: { participants: Participant[] }) {
  const groups = groupByRestaurant(participants);

  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <div key={g.name} className="flex items-center justify-between rounded-xl border border-border-subtle p-3">
          <div>
            <p className="text-sm font-semibold">{g.name}</p>
            <p className="text-xs text-ink-soft">
              {g.count} order{g.count !== 1 ? "s" : ""}
            </p>
          </div>
          <span className="font-mono text-sm font-semibold">{formatCurrency(g.total)}</span>
        </div>
      ))}
    </div>
  );
}
