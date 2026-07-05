"use client";

import { motion } from "framer-motion";
import { Wallet as WalletIcon, Trash2 } from "lucide-react";
import type { SavedWallet } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WALLET_PROVIDER_COLOR } from "@/constants";

interface WalletItemProps {
  wallet: SavedWallet;
  index: number;
  onSetDefault: () => void;
  onDelete: () => void;
}

export function WalletItem({ wallet, index, onSetDefault, onDelete }: WalletItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${WALLET_PROVIDER_COLOR[wallet.provider]}`}>
          <WalletIcon className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{wallet.provider}</p>
            {wallet.isDefault && <Badge variant="kasturi">Default</Badge>}
          </div>
          <p className="text-xs text-ink-soft">Linked to {wallet.linkedPhone}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {!wallet.isDefault && (
          <Button variant="ghost" size="sm" onClick={onSetDefault}>
            Set default
          </Button>
        )}
        <Button variant="ghost" size="icon" aria-label={`Delete ${wallet.provider} wallet`} onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-chili" />
        </Button>
      </div>
    </motion.div>
  );
}
