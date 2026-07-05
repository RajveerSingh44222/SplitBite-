"use client";

import { motion } from "framer-motion";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  index?: number;
}

export function StatTile({ label, value, icon: Icon, colorClass, index = 0 }: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft transition-shadow hover:shadow-lift"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </motion.div>
  );
}
