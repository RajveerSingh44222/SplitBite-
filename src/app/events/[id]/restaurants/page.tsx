"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, SearchX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { RouteNotFound } from "@/components/shared/route-not-found";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useEventStore } from "@/store/event-store";
import { mockRestaurants } from "@/mock/restaurants";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Highest Rated", "Fastest Delivery", "Most Popular", "Best Offers"] as const;

export default function RestaurantBrowserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const event = useEventStore((s) => s.events[params.id]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const { isLoading } = useQuery({
    queryKey: ["restaurants", params.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      return true;
    },
  });

  const filtered = useMemo(() => {
    let list = mockRestaurants;
    if (filter !== "All") list = list.filter((r) => r.tags.includes(filter));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.cuisines.some((c) => c.toLowerCase().includes(q)));
    }
    return list;
  }, [filter, query]);

  if (!event) {
    return (
      <RouteNotFound
        title="Event not found"
        description="This event may have expired, been deleted, or the link is incorrect."
      />
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <button
          onClick={() => router.push(ROUTES.event(event.id))}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {event.name}
        </button>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Choose a restaurant</h1>
            <p className="mt-1 text-ink-soft">Budget: {formatCurrency(event.budgetPerPerson)} per person</p>
          </div>
        </div>

        <div className="sticky top-20 z-20 mt-6 space-y-3 rounded-2xl border border-border-subtle bg-surface/90 p-4 shadow-soft backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or cuisines"
              className="h-12 w-full rounded-xl border border-border-subtle bg-surface pl-11 pr-4 text-sm outline-none focus:border-ember focus:ring-4 focus:ring-ember/10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                  filter === f
                    ? "border-ember bg-ember text-white"
                    : "border-border-subtle bg-surface text-ink-soft hover:border-ink-soft/40"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-9 w-9" />}
              title="No restaurants match"
              description="Try a different search term or clear the filter."
            />
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} href={ROUTES.restaurant(event.id, r.id)} index={i} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
}
