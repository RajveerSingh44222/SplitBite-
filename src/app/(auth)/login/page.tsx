"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { useUIStore } from "@/store/ui-store";

export default function LoginPage() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("aditi.rao@example.com");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({ title: "Welcome back, Aditi!", kind: "success" });
      router.push(ROUTES.dashboard);
    }, 900);
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-paper-dim px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(circle at 20% 10%, var(--color-ember) 0%, transparent 45%)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-8 shadow-lift sm:p-10"
      >
        <Link href={ROUTES.home} className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ember text-white">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          PartyPlatter
        </Link>

        <h1 className="text-center font-display text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1.5 text-center text-sm text-ink-soft">Log in to manage your events</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <div>
            <Input
              label="Password"
              type="password"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
            />
            <div className="mt-2 text-right">
              <Link href="#" className="text-xs font-medium text-ember hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" size="lg" loading={loading} className="group w-full">
            Log in
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs font-medium text-ink-soft">
          <div className="h-px flex-1 bg-border-subtle" />
          OR
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            showToast({ title: "Signed in with Google", kind: "success" });
            router.push(ROUTES.dashboard);
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-ink-soft">
          New to PartyPlatter?{" "}
          <Link href={ROUTES.signup} className="font-semibold text-ember hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
