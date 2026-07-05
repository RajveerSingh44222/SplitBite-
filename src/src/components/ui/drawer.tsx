"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "right" | "bottom";
  className?: string;
}

export function Drawer({ open, onClose, children, title, side = "right", className }: DrawerProps) {
  const isRight = side === "right";
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={isRight ? { x: "100%" } : { y: "100%" }}
            animate={isRight ? { x: 0 } : { y: 0 }}
            exit={isRight ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className={cn(
              "relative z-10 flex h-full w-full max-w-md flex-col bg-surface shadow-lift",
              !isRight && "mt-auto max-h-[85vh] w-full max-w-none rounded-t-3xl",
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-surface-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
