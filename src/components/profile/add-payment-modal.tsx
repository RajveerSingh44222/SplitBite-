"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Landmark, Smartphone, Wallet as WalletIcon, ChevronLeft } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profile-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { WALLET_PROVIDERS } from "@/mock/payment";
import type { WalletProvider } from "@/types/payment";

type MethodType = "credit-card" | "debit-card" | "upi" | "wallet";

const METHOD_OPTIONS: { type: MethodType; label: string; icon: React.ElementType }[] = [
  { type: "credit-card", label: "Credit Card", icon: CreditCard },
  { type: "debit-card", label: "Debit Card", icon: Landmark },
  { type: "upi", label: "UPI", icon: Smartphone },
  { type: "wallet", label: "Wallet", icon: WalletIcon },
];

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddPaymentModal({ open, onClose }: AddPaymentModalProps) {
  const currentUser = useCurrentUser();
  const [selected, setSelected] = useState<MethodType | null>(null);

  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [provider, setProvider] = useState<WalletProvider>(WALLET_PROVIDERS[0]);
  const [error, setError] = useState<string | null>(null);

  const addCard = useProfileStore((s) => s.addCard);
  const addUpi = useProfileStore((s) => s.addUpi);
  const addWallet = useProfileStore((s) => s.addWallet);
  const showToast = useUIStore((s) => s.showToast);

  function resetForm() {
    setSelected(null);
    setHolderName("");
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setUpiId("");
    setProvider(WALLET_PROVIDERS[0]);
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSave() {
    if (selected === "credit-card" || selected === "debit-card") {
      const digits = cardNumber.replace(/\s+/g, "");
      if (!holderName.trim()) return setError("Enter the cardholder name.");
      if (digits.length < 12) return setError("Enter a valid card number.");
      if (!/^\d{2}$/.test(expiryMonth) || !/^\d{2}$/.test(expiryYear)) return setError("Enter a valid expiry (MM / YY).");
      if (!/^\d{3,4}$/.test(cvv)) return setError("Enter a valid CVV.");
      addCard({ kind: selected, holderName: holderName.trim(), cardNumber: digits, expiryMonth, expiryYear, cvv });
      showToast({ title: "Card added", description: `Ending in ${digits.slice(-4)}`, kind: "success" });
    } else if (selected === "upi") {
      if (!/^[\w.\-]+@[\w.\-]+$/.test(upiId.trim())) return setError("Enter a valid UPI ID.");
      addUpi({ upiId: upiId.trim() });
      showToast({ title: "UPI ID added", description: upiId.trim(), kind: "success" });
    } else if (selected === "wallet") {
      addWallet({ provider, linkedPhone: currentUser.phone ?? "" });
      showToast({ title: "Wallet added", description: provider, kind: "success" });
    }
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {!selected ? (
        <>
          <h2 className="font-display text-xl font-semibold">Add payment method</h2>
          <p className="mt-1 text-sm text-ink-soft">Choose a payment type to continue.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {METHOD_OPTIONS.map((opt) => (
              <motion.button
                key={opt.type}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setError(null);
                  setSelected(opt.type);
                }}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-border-subtle bg-surface p-5 text-center shadow-soft transition-shadow hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember/10 text-ember">
                  <opt.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setError(null);
              setSelected(null);
            }}
            className="mb-3 flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="font-display text-xl font-semibold">
            {METHOD_OPTIONS.find((o) => o.type === selected)?.label}
          </h2>

          <div className="mt-5 space-y-4">
            {(selected === "credit-card" || selected === "debit-card") && (
              <>
                <Input label="Name on card" placeholder="Aditi Rao" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                <Input
                  label="Card number"
                  placeholder="4921 1234 5678 9012"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  inputMode="numeric"
                />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="MM" placeholder="09" maxLength={2} value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} />
                  <Input label="YY" placeholder="27" maxLength={2} value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} />
                  <Input label="CVV" placeholder="123" maxLength={4} type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                </div>
              </>
            )}

            {selected === "upi" && (
              <Input label="UPI ID" placeholder="yourname@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            )}

            {selected === "wallet" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {WALLET_PROVIDERS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        provider === p
                          ? "border-ember bg-ember/10 text-ember-dark"
                          : "border-border-subtle bg-surface hover:bg-surface-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm font-medium text-chili">{error}</p>}

            <Button className="w-full" size="lg" onClick={handleSave}>
              Save payment method
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
