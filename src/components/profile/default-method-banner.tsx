"use client";

import { motion } from "framer-motion";
import { CreditCard, Smartphone, Wallet as WalletIcon, ShieldCheck } from "lucide-react";
import type { SavedCard, SavedUpi, SavedWallet } from "@/types/payment";
import { CARD_BRAND_LABEL } from "@/constants";

interface DefaultMethodBannerProps {
  card?: SavedCard;
  upi?: SavedUpi;
  wallet?: SavedWallet;
}

export function DefaultMethodBanner({ card, upi, wallet }: DefaultMethodBannerProps) {
  const hasMethod = card || upi || wallet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-gradient-to-r from-ember/10 to-saffron/10 p-5 shadow-soft"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-ember shadow-soft">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Default payment method</p>
        {!hasMethod ? (
          <p className="mt-0.5 font-display text-lg font-semibold text-ink-soft">None selected</p>
        ) : card ? (
          <p className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-semibold">
            <CreditCard className="h-4 w-4 text-ember" /> {CARD_BRAND_LABEL[card.brand]} •••• {card.last4}
          </p>
        ) : upi ? (
          <p className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-semibold">
            <Smartphone className="h-4 w-4 text-ember" /> {upi.upiId}
          </p>
        ) : wallet ? (
          <p className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-semibold">
            <WalletIcon className="h-4 w-4 text-ember" /> {wallet.provider}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
