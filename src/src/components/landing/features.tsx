"use client";

import { motion } from "framer-motion";
import { Wallet, Bot, Radio, ShieldCheck } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-ember">Why hosts love it</span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for the person who always ends up collecting the money
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="row-span-2 rounded-2xl border border-border-subtle bg-surface p-8 shadow-soft md:col-span-2"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember">
            <Wallet className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold">Budget guardrails, per person</h3>
          <p className="mt-2 max-w-md text-sm text-ink-soft">
            Set one budget for the whole event. Every guest sees exactly what they can spend, and
            items over their remaining balance grey out automatically.
          </p>
          <div className="mt-6 flex items-center gap-6 rounded-2xl bg-surface-muted p-5">
            <ProgressRing progress={78} size={84} color="var(--color-kasturi)">
              <span className="font-mono text-sm font-semibold">78%</span>
            </ProgressRing>
            <div className="text-sm">
              <p className="font-semibold">\u20b9690 of \u20b9800 used</p>
              <p className="text-ink-soft">\u20b9110 left &middot; 4 items still in reach</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-soft"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/15 text-saffron">
            <Bot className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-lg font-semibold">AI never lets anyone go hungry</h3>
          <p className="mt-2 text-sm text-ink-soft">
            If someone misses the deadline, AI picks a meal from their order history within budget.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-soft"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kasturi-light text-kasturi">
            <Radio className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-lg font-semibold">Live, for everyone</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Watch the activity feed as guests join, browse, and order in real time &mdash; no refreshing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-soft"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chili-light text-chili">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-lg font-semibold">One payment, one host</h3>
          <p className="mt-2 text-sm text-ink-soft">
            No splitting apps, no reminders. The host places one order; everyone gets their own delivery.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
