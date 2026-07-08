"use client";

import { Sparkles, Leaf } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useProfileStore } from "@/store/profile-store";
import { useUIStore } from "@/store/ui-store";

/**
 * Settings for SplitBite's AI auto-select feature. These only affect the
 * logged-in user — everyone else in an event is a mock crew member without
 * a settings screen of their own. Read by `autoSelectRemaining` in
 * event-store.ts when the countdown runs out.
 */
export function AIPreferencesCard() {
  const autoOrderEnabled = useProfileStore((s) => s.aiPreferences.autoOrderEnabled);
  const vegOnly = useProfileStore((s) => s.aiPreferences.vegOnly);
  const setAutoOrderEnabled = useProfileStore((s) => s.setAutoOrderEnabled);
  const setVegOnly = useProfileStore((s) => s.setVegOnly);
  const showToast = useUIStore((s) => s.showToast);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-ember" />
          <div>
            <p className="text-sm font-semibold">Auto-order for me</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              If you miss an event&apos;s deadline, let AI pick something for you within budget.
            </p>
          </div>
        </div>
        <Switch
          checked={autoOrderEnabled}
          onCheckedChange={(checked) => {
            setAutoOrderEnabled(checked);
            showToast({
              title: checked ? "Auto-order turned on" : "Auto-order turned off",
              description: checked
                ? "AI will order for you if you miss a deadline"
                : "You'll be left waiting if you miss a deadline — no order will be placed",
              kind: checked ? "success" : "info",
            });
          }}
          aria-label="Toggle AI auto-order"
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-kasturi" />
          <div>
            <p className="text-sm font-semibold">Vegetarian only</p>
            <p className="mt-0.5 text-xs text-ink-soft">Auto-order will only ever pick vegetarian items for you.</p>
          </div>
        </div>
        <Switch
          checked={vegOnly}
          onCheckedChange={(checked) => {
            setVegOnly(checked);
            showToast({ title: checked ? "Veg-only auto-order enabled" : "Veg-only auto-order disabled", kind: "success" });
          }}
          disabled={!autoOrderEnabled}
          aria-label="Toggle vegetarian-only auto-order"
        />
      </div>
    </div>
  );
}
