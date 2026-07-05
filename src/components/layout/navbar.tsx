"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Menu, Moon, Sun, X, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useUIStore } from "@/store/ui-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROUTES } from "@/constants";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";

export function Navbar({ authed }: { authed?: boolean }) {
  const currentUser = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const notificationsOpen = useUIStore((s) => s.notificationsOpen);
  const setNotificationsOpen = useUIStore((s) => s.setNotificationsOpen);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-3 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-6xl sm:top-4 sm:w-[calc(100%-2rem)]"
      >
        <div className="glass flex items-center justify-between rounded-2xl border border-border-subtle px-4 py-3 shadow-soft sm:px-5">
          <Link href={authed ? ROUTES.dashboard : ROUTES.home} className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ember text-white">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
            PartyPlatter
          </Link>

          {!authed && (
            <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
              <a href="#how-it-works" className="hover:text-foreground">How it works</a>
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#testimonials" className="hover:text-foreground">Stories</a>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-surface-muted"
            >
              {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {authed ? (
              <>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-surface-muted"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-ember" />
                </button>
                <Dropdown
                  trigger={
                    <button className="ml-1">
                      <Avatar src={currentUser.avatar} name={currentUser.name} size={38} />
                    </button>
                  }
                >
                  {(close) => (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold">{currentUser.name}</p>
                        <p className="text-xs text-ink-soft">{currentUser.email}</p>
                      </div>
                      <Link href={ROUTES.profile} onClick={close}>
                        <DropdownItem>Profile settings</DropdownItem>
                      </Link>
                      <Link href={ROUTES.paymentMethods} onClick={close}>
                        <DropdownItem>Payment methods</DropdownItem>
                      </Link>
                      <Link href={ROUTES.home} onClick={close}>
                        <DropdownItem danger>Log out</DropdownItem>
                      </Link>
                    </>
                  )}
                </Dropdown>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href={ROUTES.login}>
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href={ROUTES.signup}>
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass mt-2 flex flex-col gap-1 rounded-2xl border border-border-subtle p-3 shadow-soft md:hidden"
          >
            {!authed && (
              <>
                <a href="#how-it-works" className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-muted">How it works</a>
                <a href="#features" className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-muted">Features</a>
                <Link href={ROUTES.login} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-muted">Log in</Link>
                <Link href={ROUTES.signup}>
                  <Button className="mt-1 w-full">Get started</Button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </motion.header>
      {authed && <NotificationsPanel />}
    </>
  );
}
