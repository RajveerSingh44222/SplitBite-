"use client";

import { motion } from "framer-motion";
import { Smartphone, Trash2 } from "lucide-react";
import type { SavedUpi } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UpiItemProps {
  upi: SavedUpi;
  index: number;
  onSetDefault: () => void;
  onDelete: () => void;
}

export function UpiItem({ upi, index, onSetDefault, onDelete }: UpiItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kasturi-light text-kasturi">
          <Smartphone className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{upi.upiId}</p>
            {upi.isDefault && <Badge variant="kasturi">Default</Badge>}
          </div>
          <p className="text-xs text-ink-soft">UPI</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {!upi.isDefault && (
          <Button variant="ghost" size="sm" onClick={onSetDefault}>
            Set default
          </Button>
        )}
        <Button variant="ghost" size="icon" aria-label={`Delete UPI ${upi.upiId}`} onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-chili" />
        </Button>
      </div>
    </motion.div>
  );
}
