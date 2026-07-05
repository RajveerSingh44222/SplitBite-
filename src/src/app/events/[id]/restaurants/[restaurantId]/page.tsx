"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Search, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { FoodCard } from "@/components/restaurant/food-card";
import { CartDrawer } from "@/components/restaurant/cart-drawer";
import { Badge } from "@/components/ui/badge";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { mockRestaurants } from "@/mock/restaurants";
import { getMenuFor } from "@/mock/menus";
import { currentUser } from "@/mock/users";
import { formatCurrency, cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string; restaurantId: string }>();
  const router = useRouter();
  const event = useEventStore((s) => s.events[params.id]);
  const setParticipantRestaurant = useEventStore((s) => s.setParticipantRestaurant);
  const updateCart = useEventStore((s) => s.updateCart);
  const markOrdered = useEventStore((s) => s.markOrdered);
  const pushActivity = useEventStore((s) => s.pushActivity);
  const showToast = useUIStore((s) => s.showToast);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const cartDrawerOpen = useUIStore((s) => s.cartDrawerOpen);

  const restaurant = mockRestaurants.find((r) => r.id === params.restaurantId);
  const menu = useMemo(() => getMenuFor(params.restaurantId), [params.restaurantId]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const me = event?.participants.find((p) => p.userId === currentUser.id);
  const cart = me?.cart ?? [];
  const cartValue = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const remainingBudget = (event?.budgetPerPerson ?? 0) - cartValue;

  const categories = useMemo(() => ["all", ...Array.from(new Set(menu.map((m) => m.category)))], [menu]);

  const filteredMenu = useMemo(() => {
    let list = menu;
    if (activeCategory !== "all") list = list.filter((m) => m.category === activeCategory);
    if (search.trim()) list = list.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [menu, activeCategory, search]);

  if (!event || !restaurant || !me) {
    return (
      <main className="min-h-screen">
        <Navbar authed />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Restaurant not found</h1>
        </div>
      </main>
    );
  }

  function quantityOf(menuItemId: string) {
    return cart.find((c) => c.menuItemId === menuItemId)?.quantity ?? 0;
  }

  function addItem(item: (typeof menu)[number]) {
    if (!me) return;
    if (item.price > remainingBudget) {
      showToast({ title: "Exceeds your remaining budget", kind: "error" });
      return;
    }
    if (me.restaurantId && me.restaurantId !== restaurant!.id && me.cart.length > 0) {
      showToast({ title: "Switched restaurant", description: "Your previous cart was cleared", kind: "info" });
    }
    const isNewRestaurant = me.restaurantId !== restaurant!.id;
    const baseCart = isNewRestaurant ? [] : me.cart;
    const existing = baseCart.find((c) => c.menuItemId === item.id);
    const newCart = existing
      ? baseCart.map((c) => (c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      : [...baseCart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, isVeg: item.isVeg, image: item.image }];

    setParticipantRestaurant(event.id, currentUser.id, restaurant!.id, restaurant!.name);
    updateCart(event.id, currentUser.id, newCart);
  }

  function removeItem(menuItemId: string) {
    const newCart = me!.cart
      .map((c) => (c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c))
      .filter((c) => c.quantity > 0);
    updateCart(event.id, currentUser.id, newCart);
  }

  function updateQtyFromDrawer(menuItemId: string, delta: number) {
    if (delta > 0) {
      const item = menu.find((m) => m.id === menuItemId);
      if (item) addItem(item);
    } else {
      removeItem(menuItemId);
    }
  }

  function checkout() {
    markOrdered(event.id, currentUser.id);
    pushActivity(event.id, {
      type: "ordered",
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      message: `ordered from ${restaurant!.name}`,
      timestamp: new Date().toISOString(),
    });
    setCartDrawerOpen(false);
    showToast({ title: "Order confirmed!", description: "You're all set for this event", kind: "success" });
    router.push(ROUTES.event(event.id));
  }

  return (
    <main className="min-h-screen pb-28">
      <Navbar authed />

      <div className="mx-auto max-w-4xl px-6 pt-6">
        <button
          onClick={() => router.push(ROUTES.restaurants(event.id))}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to restaurants
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-52 w-full overflow-hidden rounded-3xl sm:h-64"
        >
          <Image src={restaurant.bannerImage} alt={restaurant.name} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{restaurant.name}</h1>
            <p className="mt-1 text-sm text-white/85">{restaurant.cuisines.join(" \u00b7 ")}</p>
          </div>
        </motion.div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1 rounded-lg bg-kasturi px-2 py-1 font-semibold text-white">
            <Star className="h-3.5 w-3.5 fill-current" /> {restaurant.rating}
          </span>
          <span className="text-ink-soft">{restaurant.ratingCount.toLocaleString("en-IN")} ratings</span>
          <span className="flex items-center gap-1 text-ink-soft"><Clock className="h-3.5 w-3.5" /> {restaurant.deliveryTimeMins} min</span>
          {restaurant.offer && <Badge variant="ember">{restaurant.offer}</Badge>}
        </div>

        <div className="mt-3 rounded-xl bg-surface-muted px-4 py-2.5 text-sm">
          Your remaining budget:{" "}
          <span className={cn("font-mono font-semibold", remainingBudget < 0 ? "text-chili" : "text-kasturi")}>
            {formatCurrency(Math.max(0, remainingBudget))}
          </span>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search in ${restaurant.name}`}
            className="h-12 w-full rounded-xl border border-border-subtle bg-surface pl-11 pr-4 text-sm outline-none focus:border-ember focus:ring-4 focus:ring-ember/10"
          />
        </div>

        {/* Sticky category tabs */}
        <div className="sticky top-20 z-20 mt-4 flex gap-2 overflow-x-auto border-b border-border-subtle bg-background/95 py-2 backdrop-blur-md">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors",
                activeCategory === c
                  ? "border-ember bg-ember text-white"
                  : "border-border-subtle bg-surface text-ink-soft hover:border-ink-soft/40"
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {filteredMenu.map((item, i) => (
            <FoodCard
              key={item.id}
              item={item}
              quantity={quantityOf(item.id)}
              remainingBudget={remainingBudget + quantityOf(item.id) * item.price}
              onAdd={() => addItem(item)}
              onRemove={() => removeItem(item.id)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Floating checkout bar */}
      {cart.length > 0 && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setCartDrawerOpen(true)}
          className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink px-6 py-4 text-white shadow-lift"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm font-semibold">{cart.reduce((s, c) => s + c.quantity, 0)} items</span>
          <span className="h-4 w-px bg-white/30" />
          <span className="font-mono text-sm font-semibold">{formatCurrency(cartValue)}</span>
        </motion.button>
      )}

      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        restaurantName={restaurant.name}
        cart={cart}
        budget={event.budgetPerPerson}
        onUpdateQty={updateQtyFromDrawer}
        onCheckout={checkout}
      />
    </main>
  );
}
