import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EventStatus, Participant } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `\u20b9${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function msUntil(iso: string): number {
  return new Date(iso).getTime() - Date.now();
}

export function formatDuration(ms: number): { mm: string; ss: string; hh: string } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return {
    hh: String(hh).padStart(2, "0"),
    mm: String(mm).padStart(2, "0"),
    ss: String(ss).padStart(2, "0"),
  };
}

export function randomId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * The UI only ever needs to branch on 4 lifecycle phases, but the store's
 * EventStatus has extra terminal sub-states ("ordered" / "delivered") that
 * all render as the same read-only "completed" screen. This is the single
 * source of truth for that mapping so no component re-implements it.
 */
export type EventPhase = "draft" | "collecting" | "reviewing" | "completed";

export function getEventPhase(status: EventStatus): EventPhase {
  switch (status) {
    case "draft":
      return "draft";
    case "collecting":
      return "collecting";
    case "reviewing":
      return "reviewing";
    case "ordered":
    case "delivered":
    case "completed":
      return "completed";
    default:
      return "collecting";
  }
}

function parseEtaMinutes(eta?: string): number | null {
  if (!eta) return null;
  const match = eta.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/** Average ETA across participants for the Completed screen, "—" if unknown. */
export function averageEtaLabel(participants: Pick<Participant, "eta">[]): string {
  const minutes = participants
    .map((p) => parseEtaMinutes(p.eta))
    .filter((n): n is number => n !== null);
  if (minutes.length === 0) return "\u2014";
  const avg = Math.round(minutes.reduce((sum, n) => sum + n, 0) / minutes.length);
  return `${avg} min`;
}
