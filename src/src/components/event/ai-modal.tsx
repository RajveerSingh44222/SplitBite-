"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Search, UtensilsCrossed, CheckCircle2, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const STEPS = [
  { label: "Checking order history", icon: History },
  { label: "Finding nearby restaurants", icon: Search },
  { label: "Selecting food within budget", icon: UtensilsCrossed },
  { label: "Completed", icon: CheckCircle2 },
];

export function AIModal({
  open,
  onClose,
  onComplete,
  guestCount,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  guestCount: number;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i + 1), (i + 1) * 900)
    );
    const completeTimer = setTimeout(() => onComplete(), STEPS.length * 900 + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} hideClose>
      <div className="py-4 text-center">
        <motion.div
          animate={{ rotate: step < STEPS.length ? 360 : 0 }}
          transition={{ repeat: step < STEPS.length ? Infinity : 0, duration: 2, ease: "linear" }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ember/10 text-ember"
        >
          <Sparkles className="h-7 w-7" />
        </motion.div>
        <h2 className="mt-5 font-display text-xl font-semibold">AI is finishing the order</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          {guestCount} guest{guestCount !== 1 ? "s" : ""} didn&apos;t order in time. We&apos;ve got them covered.
        </p>

        <div className="mx-auto mt-8 max-w-xs space-y-3 text-left">
          {STEPS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    done
                      ? "border-kasturi bg-kasturi text-white"
                      : active
                      ? "border-ember text-ember"
                      : "border-border-subtle text-ink-soft/40"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </div>
                <span className={`text-sm ${done || active ? "font-medium text-foreground" : "text-ink-soft/50"}`}>
                  {s.label}
                </span>
                <AnimatePresence>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-ember"
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {step >= STEPS.length && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <Button onClick={onClose} className="w-full">
              Review final order
            </Button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
