"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeaderCard } from "@/components/profile/profile-header-card";
import { QuickActionsGrid } from "@/components/profile/quick-actions-grid";
import { StatisticsGrid } from "@/components/profile/statistics-grid";
import { RecentActivityPanel, type RecentOrderEntry } from "@/components/profile/recent-activity-panel";
import { useEventStore } from "@/store/event-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { mockInvitations, mockMoneySaved, mockFavouriteRestaurant } from "@/mock/profile";

export default function ProfilePage() {
  const currentUser = useCurrentUser();
  const order = useEventStore((s) => s.order);
  const events = useEventStore((s) => s.events);

  const { isLoading } = useQuery({
    queryKey: ["profile-page"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      return true;
    },
  });

  const myEvents = useMemo(() => order.map((id) => events[id]).filter(Boolean), [order, events]);

  const hosted = useMemo(() => myEvents.filter((e) => e.hostId === currentUser.id), [myEvents, currentUser.id]);
  const joined = useMemo(() => myEvents.filter((e) => e.hostId !== currentUser.id), [myEvents, currentUser.id]);

  const latestEvents = useMemo(
    () => [...myEvents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [myEvents]
  );

  const latestOrders: RecentOrderEntry[] = useMemo(() => {
    const entries: RecentOrderEntry[] = [];
    for (const event of myEvents) {
      const mine = event.participants.find((p) => p.userId === currentUser.id);
      if (mine && (mine.status === "ordered" || mine.status === "auto-selected") && mine.restaurantName) {
        entries.push({
          id: `${event.id}_${mine.userId}`,
          eventId: event.id,
          eventName: event.name,
          restaurantName: mine.restaurantName,
          cartValue: mine.cartValue,
          aiSelected: mine.status === "auto-selected",
          timestamp: event.createdAt,
        });
      }
    }
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [myEvents, currentUser.id]);
  const totalOrders = latestOrders.length;
  const aiOrders = latestOrders.filter((o) => o.aiSelected).length;
  const averageOrderValue = totalOrders > 0 ? latestOrders.reduce((sum, o) => sum + o.cartValue, 0) / totalOrders : 0;
  const favouriteCuisine = currentUser.favoriteCuisines[0] ?? "—";

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold tracking-tight"
        >
          My account
        </motion.h1>
        <p className="mt-1 text-ink-soft">Manage your profile, payments and gathering history.</p>

        <div className="mt-8">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ProfileHeaderCard
              user={currentUser}
              hostedCount={hosted.length}
              joinedCount={joined.length}
              totalOrders={totalOrders}
              aiOrders={aiOrders}
            />
          )}
        </div>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Quick actions</h2>
          <div className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full" />
                ))}
              </div>
            ) : (
              <QuickActionsGrid />
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Statistics</h2>
          <div className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full" />
                ))}
              </div>
            ) : (
              <StatisticsGrid
                hostedCount={hosted.length}
                joinedCount={joined.length}
                moneySaved={mockMoneySaved}
                favouriteCuisine={favouriteCuisine}
                favouriteRestaurant={mockFavouriteRestaurant}
                averageOrderValue={averageOrderValue}
              />
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Recent activity</h2>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <RecentActivityPanel latestEvents={latestEvents} latestOrders={latestOrders} invitations={mockInvitations} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
