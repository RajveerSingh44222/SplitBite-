"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import type { ActivityItem } from "@/types";
import { UserPlus, UtensilsCrossed, RefreshCcw, TimerReset, Sparkles, LogOut } from "lucide-react";

const ICONS: Record<ActivityItem["type"], React.ElementType> = {
  joined: UserPlus,
  ordered: UtensilsCrossed,
  "changed-restaurant": RefreshCcw,
  "timer-updated": TimerReset,
  "ai-selected": Sparkles,
  left: LogOut,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function ActivityFeed({ items, className }: { items: ActivityItem[]; className?: string }) {
  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const Icon = ICONS[item.type];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -12, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex items-start gap-3 border-b border-border-subtle/60 py-3 last:border-0"
            >
              <div className="relative shrink-0">
                <Avatar src={item.actorAvatar} name={item.actorName} size={32} />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-surface p-0.5">
                  <Icon className="h-3 w-3 text-ember" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{item.actorName}</span>{" "}
                  <span className="text-ink-soft">{item.message}</span>
                </p>
                <p className="text-xs text-ink-soft/70">{timeAgo(item.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
