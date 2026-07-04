"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { AvatarGroup } from "@/components/ui/avatar";
import { mockUsers } from "@/mock/users";

const floatCards = [
  { img: "https://images.unsplash.com/photo-1601924287811-e34de5d052a4?w=200&q=80", label: "Margherita Pizza", top: "8%", left: "3%", delay: 0, anim: "float-slow" },
  { img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80", label: "Hyderabadi Biryani", top: "62%", left: "0%", delay: 0.4, anim: "float-slower" },
  { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80", label: "Cheese Burst Burger", top: "12%", left: "82%", delay: 0.2, anim: "float-slower" },
  { img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&q=80", label: "Steamed Momos", top: "68%", left: "85%", delay: 0.6, anim: "float-slow" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      {/* animated gradient blob background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-ember) 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-saffron) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* floating food cards - desktop only */}
      <div className="pointer-events-none absolute inset-0 -z-[5] hidden lg:block">
        {floatCards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + c.delay, duration: 0.6 }}
            style={{
              position: "absolute",
              top: c.top,
              left: c.left,
              animation: `${c.anim} ${6 + i}s ease-in-out infinite`,
              animationDelay: `${c.delay}s`,
            }}
          >
            <div className="glass flex items-center gap-2.5 rounded-2xl border border-border-subtle p-2.5 pr-4 shadow-lift">
              <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                <Image src={c.img} alt={c.label} fill className="object-cover" unoptimized />
              </div>
              <span className="text-xs font-semibold">{c.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-soft"
        >
          <Sparkles className="h-3.5 w-3.5 text-ember" />
          Powered by Swiggy MCP &middot; AI auto-order included
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
        >
          Stop collecting orders in a{" "}
          <span className="relative whitespace-nowrap text-ember">
            group chat
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <motion.path
                d="M2 9C60 2 240 2 298 9"
                stroke="var(--color-ember)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-ink-soft"
        >
          Create an event, share one link, and let everyone order their own food from nearby restaurants.
          One tap places it all &mdash; together, on time, on budget.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href={ROUTES.signup}>
            <Button size="lg" className="group">
              Create your first event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href={ROUTES.join("DIWALI-8F2K")}>
            <Button size="lg" variant="outline">
              I have an invite link
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-3 text-sm text-ink-soft"
        >
          <AvatarGroup users={mockUsers.slice(0, 5)} size={30} />
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            12,400+ gatherings fed this month
          </span>
        </motion.div>
      </div>
    </section>
  );
}
