"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center text-paper sm:px-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(circle at 30% 20%, var(--color-ember) 0%, transparent 55%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 80% 80%, var(--color-saffron) 0%, transparent 55%)" }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Your next gathering deserves better than a group chat spreadsheet
          </h2>
          <p className="mx-auto mt-4 max-w-md text-paper/70">
            Free to create. Free for guests to join. Ready in under two minutes.
          </p>
          <Link href={ROUTES.signup}>
            <Button size="lg" className="group mt-8">
              Create your first event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
