"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CompassIcon, type LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

interface RouteNotFoundProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Defaults to a "Back to dashboard" button. Pass `false` to hide it entirely. */
  action?: React.ReactNode | false;
  /** Whether to show the authed navbar. Set false for pages reachable while logged out. */
  authed?: boolean;
}

/**
 * The one "this thing doesn't exist" screen for the whole app.
 *
 * Used for two different situations that need to look the same to the
 * person hitting them: a URL pattern that matches a real route but the
 * ID in it doesn't resolve to anything (e.g. /events/some-made-up-id),
 * and — via app/not-found.tsx — a URL that doesn't match any route at all
 * (e.g. /profile/random). Both should feel like a deliberate, branded page,
 * never a blank screen or a raw framework error.
 */
export function RouteNotFound({ icon: Icon = CompassIcon, title, description, action, authed = true }: RouteNotFoundProps) {
  return (
    <main className="min-h-screen">
      <Navbar authed={authed} />
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ember/10 text-ember"
        >
          <Icon className="h-9 w-9" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-2xl font-semibold"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-sm text-ink-soft"
        >
          {description}
        </motion.p>
        {action !== false && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-7">
            {action ?? (
              <Link href={ROUTES.dashboard}>
                <Button size="lg">Back to dashboard</Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
