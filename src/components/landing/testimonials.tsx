"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { mockUsers } from "@/mock/users";

const TESTIMONIALS = [
  {
    quote:
      "Our team lunch used to take 20 minutes of everyone shouting orders across the room. Now everyone just picks their own food on their phone.",
    name: mockUsers[2].name,
    role: "Engineering Manager, Bengaluru",
    avatar: mockUsers[2].avatar,
  },
  {
    quote:
      "The AI auto-pick saved my birthday party. Two friends forgot to order and still got food they actually liked, on budget.",
    name: mockUsers[3].name,
    role: "Host, Diwali Potluck",
    avatar: mockUsers[3].avatar,
  },
  {
    quote:
      "Budget guardrails are genuinely genius. Nobody in our friend group ever orders something that blows up the bill split anymore.",
    name: mockUsers[4].name,
    role: "Regular host, watch parties",
    avatar: mockUsers[4].avatar,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface-muted/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-ember">Hosts, not ads</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Real gatherings, real chaos avoided
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft"
            >
              <div className="flex gap-0.5 text-saffron">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 font-display text-base italic leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <Avatar src={t.avatar} name={t.name} size={38} />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
