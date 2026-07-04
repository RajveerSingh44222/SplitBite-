"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle px-6 py-16 text-center", className)}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-ember/10 text-ember"
      >
        {icon}
      </motion.div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
