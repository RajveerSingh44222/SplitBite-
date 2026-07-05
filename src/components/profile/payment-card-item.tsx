"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Pencil, Trash2 } from "lucide-react";
import type { SavedCard } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CARD_BRAND_LABEL } from "@/constants";

interface PaymentCardItemProps {
  card: SavedCard;
  index: number;
  onSetDefault: () => void;
  onDelete: () => void;
  onEdit: (patch: { holderName: string; expiryMonth: string; expiryYear: string }) => void;
}

export function PaymentCardItem({ card, index, onSetDefault, onDelete, onEdit }: PaymentCardItemProps) {
  const [editing, setEditing] = useState(false);
  const [holderName, setHolderName] = useState(card.holderName);
  const [expiryMonth, setExpiryMonth] = useState(card.expiryMonth);
  const [expiryYear, setExpiryYear] = useState(card.expiryYear);

  function handleSave() {
    onEdit({ holderName, expiryMonth, expiryYear });
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: editing ? 0 : -2 }}
      className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{CARD_BRAND_LABEL[card.brand]}</p>
              {card.isDefault && <Badge variant="kasturi">Default</Badge>}
              <Badge variant="outline" className="capitalize">
                {card.kind.replace("-", " ")}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-sm text-ink-soft">•••• •••• •••• {card.last4}</p>
            <p className="text-xs text-ink-soft">
              Expires {card.expiryMonth}/{card.expiryYear} · {card.holderName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!card.isDefault && (
            <Button variant="ghost" size="sm" onClick={onSetDefault}>
              Set default
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit card ending ${card.last4}`}
            onClick={() => setEditing((e) => !e)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Delete card ending ${card.last4}`} onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-chili" />
          </Button>
        </div>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 grid gap-3 border-t border-border-subtle pt-4 sm:grid-cols-3"
        >
          <Input label="Cardholder name" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
          <Input label="Expiry month" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} maxLength={2} />
          <Input label="Expiry year" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} maxLength={2} />
          <div className="flex items-end gap-2 sm:col-span-3">
            <Button size="sm" onClick={handleSave}>
              Save changes
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
