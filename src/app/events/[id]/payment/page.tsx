"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Wallet as WalletIcon, ShieldCheck, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { RouteNotFound } from "@/components/shared/route-not-found";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useEventStore } from "@/store/event-store";
import { useProfileStore } from "@/store/profile-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency, cn } from "@/lib/utils";
import { ROUTES, CARD_BRAND_LABEL, WALLET_PROVIDER_COLOR } from "@/constants";

type SelectedMethod = { kind: "card" | "upi" | "wallet"; id: string } | null;

export default function PaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useCurrentUser();

  const event = useEventStore((s) => s.events[params.id]);
  const placeEventOrder = useEventStore((s) => s.placeEventOrder);
  const showToast = useUIStore((s) => s.showToast);

  const cards = useProfileStore((s) => s.cards);
  const upiAccounts = useProfileStore((s) => s.upiAccounts);
  const wallets = useProfileStore((s) => s.wallets);
  const defaultMethod = useProfileStore((s) => s.defaultMethod);

  const [selected, setSelected] = useState<SelectedMethod>(defaultMethod ?? null);
  const [paying, setPaying] = useState(false);

  const readyParticipants = useMemo(
    () => event?.participants.filter((p) => p.status === "ordered" || p.status === "auto-selected") ?? [],
    [event]
  );
  const grandTotal = useMemo(() => (event ? event.participants.reduce((sum, p) => sum + p.cartValue, 0) : 0), [event]);

  if (!event) {
    return (
      <RouteNotFound
        title="Event not found"
        description="This event may have expired, been deleted, or the link is incorrect."
      />
    );
  }

  const isHost = event.hostId === currentUser.id;
  if (!isHost) {
    return (
      <RouteNotFound
        title="Only the host can pay for this event"
        description="Ask the host to place the order from their side."
        action={
          <Link href={ROUTES.event(event.id)}>
            <Button size="lg">Back to event</Button>
          </Link>
        }
      />
    );
  }

  const hasAnyMethod = cards.length > 0 || upiAccounts.length > 0 || wallets.length > 0;

  function handlePay() {
    if (!selected) {
      showToast({ title: "Choose a payment method first", kind: "error" });
      return;
    }
    setPaying(true);
    setTimeout(() => {
      placeEventOrder(event!.id);
      setPaying(false);
      showToast({ title: "Payment successful", description: "Order placed for everyone", kind: "success" });
      router.push(ROUTES.success(event!.id));
    }, 1400);
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar authed />

      <div className="mx-auto max-w-2xl px-6 pt-8">
        <button
          onClick={() => router.push(ROUTES.review(event.id))}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to review
        </button>

        <h1 className="font-display text-3xl font-semibold tracking-tight">Pay for {event.name}</h1>
        <p className="mt-1 text-ink-soft">{readyParticipants.length} orders, one payment from you as host.</p>

        <div className="mt-6 rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-soft">Grand total</span>
            <span className="font-display text-2xl font-semibold">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold">Payment method</h2>

          {!hasAnyMethod ? (
            <EmptyState
              className="mt-4"
              icon={<CreditCard className="h-9 w-9" />}
              title="No payment methods saved"
              description="Add a card, UPI ID, or wallet to pay for this event."
              action={
                <Link href={ROUTES.paymentMethods}>
                  <Button>Add a payment method</Button>
                </Link>
              }
            />
          ) : (
            <div className="mt-4 space-y-2.5">
              {cards.map((c) => (
                <PaymentOption
                  key={c.id}
                  icon={CreditCard}
                  label={`${CARD_BRAND_LABEL[c.brand]} \u2022\u2022\u2022\u2022 ${c.last4}`}
                  sublabel={c.holderName}
                  selected={selected?.kind === "card" && selected.id === c.id}
                  onSelect={() => setSelected({ kind: "card", id: c.id })}
                />
              ))}
              {upiAccounts.map((u) => (
                <PaymentOption
                  key={u.id}
                  icon={Smartphone}
                  label={u.upiId}
                  sublabel="UPI"
                  selected={selected?.kind === "upi" && selected.id === u.id}
                  onSelect={() => setSelected({ kind: "upi", id: u.id })}
                />
              ))}
              {wallets.map((w) => (
                <PaymentOption
                  key={w.id}
                  icon={WalletIcon}
                  label={w.provider}
                  sublabel={w.linkedPhone}
                  iconClassName={WALLET_PROVIDER_COLOR[w.provider]}
                  selected={selected?.kind === "wallet" && selected.id === w.id}
                  onSelect={() => setSelected({ kind: "wallet", id: w.id })}
                />
              ))}

              <Link href={ROUTES.paymentMethods} className="block pt-1 text-sm font-semibold text-ember hover:underline">
                Manage payment methods
              </Link>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-6 mt-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-lift"
        >
          <Button
            size="lg"
            loading={paying}
            disabled={!hasAnyMethod || !selected}
            onClick={handlePay}
            className="group w-full"
          >
            Pay {formatCurrency(grandTotal)} &amp; place order
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5" /> Payments are simulated in this demo \u2014 no real charge is made.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function PaymentOption({
  icon: Icon,
  label,
  sublabel,
  selected,
  onSelect,
  iconClassName,
}: {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  selected: boolean;
  onSelect: () => void;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
        selected ? "border-ember bg-ember/5" : "border-border-subtle bg-surface hover:border-ink-soft/30"
      )}
    >
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-soft", iconClassName)}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{label}</p>
        <p className="truncate text-xs text-ink-soft">{sublabel}</p>
      </div>
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-ember bg-ember text-white" : "border-border-subtle"
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </div>
    </button>
  );
}
