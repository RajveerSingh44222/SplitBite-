"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Wallet as WalletIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PaymentCardItem } from "@/components/profile/payment-card-item";
import { UpiItem } from "@/components/profile/upi-item";
import { WalletItem } from "@/components/profile/wallet-item";
import { DefaultMethodBanner } from "@/components/profile/default-method-banner";
import { AddPaymentModal } from "@/components/profile/add-payment-modal";
import { useProfileStore } from "@/store/profile-store";
import { useUIStore } from "@/store/ui-store";

export default function PaymentMethodsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const cards = useProfileStore((s) => s.cards);
  const upiAccounts = useProfileStore((s) => s.upiAccounts);
  const wallets = useProfileStore((s) => s.wallets);
  const defaultMethod = useProfileStore((s) => s.defaultMethod);
  const setDefaultMethod = useProfileStore((s) => s.setDefaultMethod);
  const removeCard = useProfileStore((s) => s.removeCard);
  const removeUpi = useProfileStore((s) => s.removeUpi);
  const removeWallet = useProfileStore((s) => s.removeWallet);
  const updateCard = useProfileStore((s) => s.updateCard);
  const showToast = useUIStore((s) => s.showToast);

  const { isLoading } = useQuery({
    queryKey: ["payment-methods-page"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      return true;
    },
  });

  const defaultCard = defaultMethod.kind === "card" ? cards.find((c) => c.id === defaultMethod.id) : undefined;
  const defaultUpi = defaultMethod.kind === "upi" ? upiAccounts.find((u) => u.id === defaultMethod.id) : undefined;
  const defaultWallet = defaultMethod.kind === "wallet" ? wallets.find((w) => w.id === defaultMethod.id) : undefined;

  const isEmpty = cards.length === 0 && upiAccounts.length === 0 && wallets.length === 0;

  return (
    <main className="min-h-screen pb-32">
      <Navbar authed />

      <div className="mx-auto max-w-4xl px-6 pt-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold tracking-tight"
        >
          Payment methods
        </motion.h1>
        <p className="mt-1 text-ink-soft">Manage the cards, UPI IDs and wallets used for your orders.</p>

        {isLoading ? (
          <div className="mt-8 space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : isEmpty ? (
          <div className="mt-10">
            <EmptyState
              icon={<WalletIcon className="h-9 w-9" />}
              title="No payment methods added yet."
              description="Add a card, UPI ID, or wallet to start ordering with your group."
              action={
                <Button size="lg" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Payment Method
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-8">
              <DefaultMethodBanner card={defaultCard} upi={defaultUpi} wallet={defaultWallet} />
            </div>

            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Saved cards</h2>
              </div>
              <div className="mt-4 space-y-3">
                {cards.length === 0 ? (
                  <p className="text-sm text-ink-soft">No cards saved yet.</p>
                ) : (
                  cards.map((card, i) => (
                    <PaymentCardItem
                      key={card.id}
                      card={card}
                      index={i}
                      onSetDefault={() => setDefaultMethod({ kind: "card", id: card.id })}
                      onDelete={() => {
                        removeCard(card.id);
                        showToast({ title: "Card removed", kind: "info" });
                      }}
                      onEdit={(patch) => {
                        updateCard(card.id, patch);
                        showToast({ title: "Card updated", kind: "success" });
                      }}
                    />
                  ))
                )}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-lg font-semibold">UPI IDs</h2>
              <div className="mt-4 space-y-3">
                {upiAccounts.length === 0 ? (
                  <p className="text-sm text-ink-soft">No UPI IDs saved yet.</p>
                ) : (
                  upiAccounts.map((upi, i) => (
                    <UpiItem
                      key={upi.id}
                      upi={upi}
                      index={i}
                      onSetDefault={() => setDefaultMethod({ kind: "upi", id: upi.id })}
                      onDelete={() => {
                        removeUpi(upi.id);
                        showToast({ title: "UPI ID removed", kind: "info" });
                      }}
                    />
                  ))
                )}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-lg font-semibold">Wallets</h2>
              <div className="mt-4 space-y-3">
                {wallets.length === 0 ? (
                  <p className="text-sm text-ink-soft">No wallets linked yet.</p>
                ) : (
                  wallets.map((wallet, i) => (
                    <WalletItem
                      key={wallet.id}
                      wallet={wallet}
                      index={i}
                      onSetDefault={() => setDefaultMethod({ kind: "wallet", id: wallet.id })}
                      onDelete={() => {
                        removeWallet(wallet.id);
                        showToast({ title: "Wallet removed", kind: "info" });
                      }}
                    />
                  ))
                )}
              </div>
            </section>

            <div className="mt-12 flex justify-center">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Add Payment Method
              </Button>
            </div>
          </>
        )}
      </div>

      <AddPaymentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
