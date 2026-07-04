"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, History, Crown, Users2 } from "lucide-react";

export function DashboardStats({
  upcoming,
  past,
  hosted,
  joined,
}: {
  upcoming: number;
  past: number;
  hosted: number;
  joined: number;
}) {
  const items = [
    { label: "Upcoming", value: upcoming, icon: CalendarCheck2, color: "text-ember bg-ember/10" },
    { label: "Past events", value: past, icon: History, color: "text-ink-soft bg-surface-muted" },
    { label: "Hosted", value: hosted, icon: Crown, color: "text-saffron bg-saffron/15" },
    { label: "Joined", value: joined, icon: Users2, color: "text-kasturi bg-kasturi-light" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
            <item.icon className="h-5 w-5" />
          </span>
          <p className="mt-3 font-display text-2xl font-semibold">{item.value}</p>
          <p className="text-xs text-ink-soft">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
