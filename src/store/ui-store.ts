import { create } from "zustand";
import { randomId } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
}

interface UIState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;

  toasts: ToastItem[];
  showToast: (t: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;

  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  setTheme: (t) => set({ theme: t }),

  toasts: [],
  showToast: (t) =>
    set((s) => {
      const id = randomId("toast");
      setTimeout(() => {
        set((s2) => ({ toasts: s2.toasts.filter((x) => x.id !== id) }));
      }, 3600);
      return { toasts: [...s.toasts, { ...t, id }] };
    }),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),

  notificationsOpen: false,
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));
