"use client";

import { motion } from "framer-motion";
import { Mail, Phone, CalendarDays, Crown, Users2, ShoppingBag, Sparkles } from "lucide-react";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/profile/stat-tile";

interface ProfileHeaderCardProps {
  user: User;
  hostedCount: number;
  joinedCount: number;
  totalOrders: number;
  aiOrders: number;
}

function formatMemberSince(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function ProfileHeaderCard({ user, hostedCount, joinedCount, totalOrders, aiOrders }: ProfileHeaderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-soft"
    >
      <div className="relative h-20 w-full bg-gradient-to-r from-ember to-saffron sm:h-24" />
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar
              src={user.avatar}
              name={user.name}
              size={96}
              ring
              className="-mt-10 border-4 border-surface shadow-lift sm:-mt-12"
            />
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold tracking-tight">{user.name}</h1>
                <Badge variant="saffron">
                  <Crown className="h-3 w-3" />
                  Member
                </Badge>
              </div>
              <div className="mt-1.5 flex flex-col gap-1 text-sm text-ink-soft sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Member since {formatMemberSince(user.memberSinceISO)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Hosted events" value={hostedCount} icon={Crown} colorClass="text-saffron bg-saffron/15" index={0} />
          <StatTile label="Joined events" value={joinedCount} icon={Users2} colorClass="text-kasturi bg-kasturi-light" index={1} />
          <StatTile label="Total orders" value={totalOrders} icon={ShoppingBag} colorClass="text-ember bg-ember/10" index={2} />
          <StatTile label="AI orders" value={aiOrders} icon={Sparkles} colorClass="text-ink-soft bg-surface-muted" index={3} />
        </div>
      </div>
    </motion.div>
  );
}
