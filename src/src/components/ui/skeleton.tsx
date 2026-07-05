import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-surface-muted via-border-subtle to-surface-muted bg-[length:200%_100%]",
        className
      )}
      style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
    />
  );
}
