"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Share2, UtensilsCrossed, PartyPopper } from "lucide-react";

const STEPS = [
  {
    icon: CalendarPlus,
    title: "Create the event",
    description: "Set a budget, date, and deadline. We'll suggest restaurants everyone will love nearby.",
  },
  {
    icon: Share2,
    title: "Share one link",
    description: "Send a single invite link. No account needed to join, no back-and-forth in the group chat.",
  },
  {
    icon: UtensilsCrossed,
    title: "Everyone orders solo",
    description: "Each guest picks their own restaurant and meal, within budget, at their own pace.",
  },
  {
    icon: PartyPopper,
    title: "One tap, it's placed",
    description: "You review every order, and place the whole event in a single click. Stragglers get an AI pick.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-ember">The flow</span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Four steps between chaos and dinner
        </h2>
      </div>

      <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-border-subtle lg:block" />
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="relative flex flex-col items-start"
          >
            <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-paper shadow-lift">
              <step.icon className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
