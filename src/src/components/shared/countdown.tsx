"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDuration, msUntil, clamp } from "@/lib/utils";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";

interface CountdownProps {
  deadlineISO: string;
  totalMs?: number;
  onComplete?: () => void;
  size?: "sm" | "lg";
  className?: string;
}

export function Countdown({ deadlineISO, totalMs, onComplete, size = "lg", className }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => msUntil(deadlineISO));
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const ms = msUntil(deadlineISO);
      setRemaining(ms);
      if (ms <= 0 && !fired) {
        setFired(true);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineISO, onComplete, fired]);

  const total = totalMs ?? 15 * 60 * 1000;
  const progress = clamp((remaining / total) * 100, 0, 100);
  const { hh, mm, ss } = formatDuration(remaining);
  const urgent = remaining < 60 * 1000 && remaining > 0;
  const done = remaining <= 0;

  if (size === "sm") {
    return (
      <div className={cn("flex items-center gap-2 font-mono text-sm font-medium", urgent && "text-chili", className)}>
        <motion.span animate={urgent ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}>
          {done ? "00:00" : `${hh !== "00" ? hh + ":" : ""}${mm}:${ss}`}
        </motion.span>
      </div>
    );
  }

  return (
    <ProgressRing
      progress={progress}
      size={140}
      strokeWidth={8}
      color={done ? "var(--color-chili)" : urgent ? "var(--color-chili)" : "var(--color-ember)"}
      className={className}
    >
      <div className="flex flex-col items-center">
        <motion.span
          animate={urgent ? { scale: [1, 1.06, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          className="font-mono text-2xl font-semibold tabular-nums"
        >
          {done ? "00:00" : `${hh !== "00" ? hh + ":" : ""}${mm}:${ss}`}
        </motion.span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-soft">
          {done ? "closed" : "left to order"}
        </span>
      </div>
    </ProgressRing>
  );
}
