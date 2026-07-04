"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { useUIStore } from "@/store/ui-store";
import { buildNotifications } from "@/mock/events";
import { Gift, Clock, UtensilsCrossed, Info } from "lucide-react";
import { motion } from "framer-motion";

const ICONS = { invite: Gift, reminder: Clock, order: UtensilsCrossed, system: Info };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationsPanel() {
  const open = useUIStore((s) => s.notificationsOpen);
  const setOpen = useUIStore((s) => s.setNotificationsOpen);
  const [items] = useState(buildNotifications);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title="Notifications">
      <div className="p-3">
        {items.map((n, i) => {
          const Icon = ICONS[n.kind];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 rounded-xl p-3 hover:bg-surface-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ember" />}
                </div>
                <p className="mt-0.5 text-xs text-ink-soft">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-soft/60">{timeAgo(n.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Drawer>
  );
}
