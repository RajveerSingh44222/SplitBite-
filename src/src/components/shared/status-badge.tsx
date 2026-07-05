import { Badge } from "@/components/ui/badge";
import type { ParticipantStatus } from "@/types";
import { CheckCircle2, Clock, Sparkles, UtensilsCrossed, LogOut } from "lucide-react";

const CONFIG: Record<ParticipantStatus, { label: string; variant: "kasturi" | "default" | "ember" | "saffron" | "chili"; icon: React.ElementType }> = {
  ordered: { label: "Ordered", variant: "kasturi", icon: CheckCircle2 },
  browsing: { label: "Browsing", variant: "ember", icon: UtensilsCrossed },
  invited: { label: "Waiting", variant: "default", icon: Clock },
  "auto-selected": { label: "Auto-selected", variant: "saffron", icon: Sparkles },
  left: { label: "Left", variant: "chili", icon: LogOut },
};

export function StatusBadge({ status }: { status: ParticipantStatus }) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}
