import { CheckCircle2, ChefHat, Bike, Home } from "lucide-react";

const STEPS = [
  { label: "Order confirmed", icon: CheckCircle2 },
  { label: "Restaurants preparing", icon: ChefHat },
  { label: "Out for delivery", icon: Bike },
  { label: "Delivered", icon: Home },
];

/**
 * Shared 4-step order timeline.
 *
 * `completedSteps` marks how many of the 4 steps are "done" (filled).
 * The success page (order just placed) passes 2, the Completed event
 * screen (order fully delivered) passes 4. Extracted from the success
 * page so the two screens don't maintain two copies of this markup.
 */
export function DeliveryTimeline({ completedSteps }: { completedSteps: number }) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const done = i < completedSteps;
        return (
          <div key={step.label} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  done ? "bg-kasturi text-white" : "border-2 border-border-subtle text-ink-soft/40"
                }`}
              >
                <step.icon className="h-4.5 w-4.5" />
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 ${done ? "bg-kasturi" : "bg-border-subtle"}`} />
              )}
            </div>
            <span className={`mt-2 text-[11px] font-medium ${done ? "text-foreground" : "text-ink-soft/60"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
