"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants";
import type { PartyEvent } from "@/types";

/**
 * Draft-phase placeholder. A draft event hasn't been published to guests
 * yet, so there is nothing to browse, order, or review — just a nudge to
 * finish setup. Deliberately tiny; there is no live data to show.
 */
export function DraftEvent({ event }: { event: PartyEvent }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <EmptyState
          icon={<PenLine className="h-9 w-9" />}
          title={`"${event.name}" is still a draft`}
          description="Finish setting up this event before you invite anyone to order."
          action={
            <Link href={ROUTES.createEvent}>
              <Button>Finish setup</Button>
            </Link>
          }
        />
      </motion.div>
    </div>
  );
}
