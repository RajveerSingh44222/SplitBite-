"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const STATS = [
  { value: 12400, suffix: "+", label: "Gatherings fed" },
  { value: 340000, suffix: "+", label: "Meals ordered together" },
  { value: 96, suffix: "%", label: "Orders placed on time" },
  { value: 4.9, suffix: "/5", label: "Average host rating", decimals: 1 },
];

function Counter({ value, suffix, decimals }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN")),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="font-display text-4xl font-semibold tabular-nums sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border-subtle bg-surface py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
            <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
