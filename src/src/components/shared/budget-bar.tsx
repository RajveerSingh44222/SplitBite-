"use client";

import { motion } from "framer-motion";
import { formatCurrency, clamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function BudgetBar({
  spent,
  budget,
  className,
}: {
  spent: number;
  budget: number;
  className?: string;
}) {
  const pct = clamp((spent / budget) * 100, 0, 100);
  const remaining = budget - spent;
  const over = remaining < 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink-soft">Budget</span>
        <span className={cn("font-mono font-semibold", over ? "text-chili" : "text-foreground")}>
          {formatCurrency(spent)} <span className="text-ink-soft">/ {formatCurrency(budget)}</span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={cn("h-full rounded-full", over ? "bg-chili" : pct > 80 ? "bg-saffron" : "bg-kasturi")}
        />
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
        {over ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5 text-chili" />
            <span className="font-medium text-chili">Exceeds budget by {formatCurrency(Math.abs(remaining))}</span>
          </>
        ) : (
          <span className="text-ink-soft">{formatCurrency(remaining)} remaining</span>
        )}
      </div>
    </div>
  );
}
