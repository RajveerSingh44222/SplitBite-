"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, ShoppingBag, Settings, LifeBuoy, LogOut, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants";
import { useUIStore } from "@/store/ui-store";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  colorClass: string;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}

export function QuickActionsGrid() {
  const showToast = useUIStore((s) => s.showToast);

  const actions: QuickAction[] = [
    { label: "Payment methods", icon: CreditCard, colorClass: "text-ember bg-ember/10", href: ROUTES.paymentMethods },
    {
      label: "Past orders",
      icon: ShoppingBag,
      colorClass: "text-kasturi bg-kasturi-light",
      href: `${ROUTES.dashboard}?tab=past`,
    },
    {
      label: "Settings",
      icon: Settings,
      colorClass: "text-ink-soft bg-surface-muted",
      onClick: () => showToast({ title: "Settings", description: "Coming soon.", kind: "info" }),
    },
    {
      label: "Help & support",
      icon: LifeBuoy,
      colorClass: "text-saffron bg-saffron/15",
      onClick: () => showToast({ title: "Help & support", description: "Coming soon.", kind: "info" }),
    },
    { label: "Logout", icon: LogOut, colorClass: "text-chili bg-chili-light", href: ROUTES.home, danger: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {actions.map((action, i) => {
        const content = (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="flex h-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-border-subtle bg-surface p-5 text-center shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.colorClass}`}>
              <action.icon className="h-5 w-5" />
            </span>
            <span className={`text-sm font-semibold ${action.danger ? "text-chili" : ""}`}>{action.label}</span>
          </motion.div>
        );

        if (action.href) {
          return (
            <Link key={action.label} href={action.href} aria-label={action.label}>
              {content}
            </Link>
          );
        }
        return (
          <button key={action.label} onClick={action.onClick} aria-label={action.label} className="text-left">
            {content}
          </button>
        );
      })}
    </div>
  );
}
