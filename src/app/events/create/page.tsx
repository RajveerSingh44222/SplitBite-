"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Wallet, Timer, Sparkles, ArrowRight, Users } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { RestaurantChip } from "@/components/restaurant/restaurant-chip";
import { mockRestaurants } from "@/mock/restaurants";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { rankRestaurantsForEvent, type RestaurantRecommendation } from "@/lib/ai-scoring";
import { buildFallbackExplanation, explainWithAI } from "@/lib/ai-explain";

export default function CreateEventPage() {
  const router = useRouter();
  const createEvent = useEventStore((s) => s.createEvent);
  const showToast = useUIStore((s) => s.showToast);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [time, setTime] = useState("20:00");
  const [budget, setBudget] = useState(500);
  const [expiry, setExpiry] = useState(30);
  const [guestCount, setGuestCount] = useState(6);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>(
    mockRestaurants.slice(0, 3).map((r) => r.id)
  );
  const [submitting, setSubmitting] = useState(false);
  const [reasons, setReasons] = useState<Record<string, string>>({});

  /**
   * Feature 2 — Restaurant Selection Assistant. Ranks every restaurant
   * against this event's budget and guest count (rule-based, instant), then
   * asks an LLM to phrase the top picks' reasoning in one sentence each.
   */
  const ranked: RestaurantRecommendation[] = useMemo(
    () => rankRestaurantsForEvent({ budgetPerPerson: budget, guestCount }),
    [budget, guestCount]
  );
  const aiSuggested = useMemo(() => ranked.slice(0, 6).map((r) => r.restaurant), [ranked]);

  useEffect(() => {
    let cancelled = false;
    const top = ranked.slice(0, 6);

    // Instant, deterministic reasons first — never wait on the network for these.
    setReasons(Object.fromEntries(top.map((r) => [r.restaurant.id, buildFallbackExplanation("restaurant-pick", r.facts)])));

    // Then upgrade each one with an LLM-phrased sentence as it arrives.
    top.forEach((r) => {
      explainWithAI("restaurant-pick", r.facts).then((text) => {
        if (cancelled) return;
        setReasons((prev) => ({ ...prev, [r.restaurant.id]: text }));
      });
    });

    return () => {
      cancelled = true;
    };
  }, [ranked]);

  function toggleRestaurant(id: string) {
    setSelectedRestaurants((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const id = createEvent({
        name,
        description: description || "Let's order together!",
        address: address || "Location shared in group",
        date,
        time: new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        budgetPerPerson: budget,
        inviteExpiryMins: expiry,
        suggestedRestaurantIds: selectedRestaurants,
      });
      setSubmitting(false);
      showToast({ title: "Event created!", description: "Share the invite link with your crew", kind: "success" });
      router.push(ROUTES.event(id));
    }, 900);
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Create an event</h1>
          <p className="mt-1 text-ink-soft">Set the details once. Everyone else just picks their food.</p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft sm:p-8"
          >
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Basics</h2>
              <Input label="Event name" placeholder="Diwali Potluck at Aditi's" value={name} onChange={(e) => setName(e.target.value)} required />
              <Textarea
                label="Description"
                placeholder="Team celebration — everyone orders their favourite!"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Address"
                icon={<MapPin className="h-4 w-4" />}
                placeholder="12th Cross, Indiranagar, Bengaluru"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" icon={<Calendar className="h-4 w-4" />} value={date} onChange={(e) => setDate(e.target.value)} />
                <Input label="Time" type="time" icon={<Clock className="h-4 w-4" />} value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Budget &amp; timing</h2>
              <div>
                <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-soft">
                  <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4" /> Budget per person</span>
                  <span className="font-mono font-semibold text-foreground">{formatCurrency(budget)}</span>
                </label>
                <input
                  type="range"
                  min={150}
                  max={1500}
                  step={50}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-ember"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-soft">
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Expected guests</span>
                  <span className="font-mono font-semibold text-foreground">{guestCount}</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-ember"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-soft">
                  <span className="flex items-center gap-1.5"><Timer className="h-4 w-4" /> Invite expires in</span>
                  <span className="font-mono font-semibold text-foreground">{expiry} min</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={expiry}
                  onChange={(e) => setExpiry(Number(e.target.value))}
                  className="w-full accent-ember"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-ink-soft">
                <Sparkles className="h-4 w-4 text-ember" /> AI suggested restaurants
              </h2>
              <p className="text-sm text-ink-soft">Pick which restaurants your guests can choose from.</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {aiSuggested.map((r) => (
                  <RestaurantChip
                    key={r.id}
                    restaurant={r}
                    selected={selectedRestaurants.includes(r.id)}
                    onToggle={() => toggleRestaurant(r.id)}
                    reason={reasons[r.id]}
                  />
                ))}
              </div>
            </section>

            <Button type="submit" size="lg" loading={submitting} className="group w-full sm:w-auto">
              Create event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.form>

          {/* Live preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-fit lg:sticky lg:top-24"
          >
            <p className="mb-3 text-sm font-semibold text-ink-soft">Live preview</p>
            <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-lift">
              <div className="relative h-28" style={{ background: "linear-gradient(120deg, #F0552B, #D8A13C)" }}>
                <div className="absolute inset-0 flex items-end p-5">
                  <h3 className="font-display text-xl font-semibold text-white drop-shadow">
                    {name || "Your event name"}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm text-ink-soft">{description || "Add a description to tell your guests what's up."}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatShortDate(date)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {time}</span>
                  <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" /> {formatCurrency(budget)}/person</span>
                </div>
                <p className="flex items-center gap-1 text-xs text-ink-soft">
                  <MapPin className="h-3.5 w-3.5" /> {address || "Location"}
                </p>
                <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-ink-soft">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Invite expires in {expiry} min</span>
                  <span>{selectedRestaurants.length} restaurants</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
