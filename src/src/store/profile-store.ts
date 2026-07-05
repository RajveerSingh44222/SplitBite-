import { create } from "zustand";
import { randomId } from "@/lib/utils";
import { initialCards, initialUpiAccounts, initialWallets, initialDefaultMethod } from "@/mock/payment";
import type {
  AddCardInput,
  AddUpiInput,
  AddWalletInput,
  DefaultPaymentMethod,
  SavedCard,
  SavedUpi,
  SavedWallet,
} from "@/types/payment";

function detectBrand(cardNumber: string): SavedCard["brand"] {
  const digits = cardNumber.replace(/\s+/g, "");
  if (digits.startsWith("4")) return "visa";
  if (digits.startsWith("5")) return "mastercard";
  if (digits.startsWith("3")) return "amex";
  return "rupay";
}

interface ProfileState {
  cards: SavedCard[];
  upiAccounts: SavedUpi[];
  wallets: SavedWallet[];
  defaultMethod: DefaultPaymentMethod;

  addCard: (input: AddCardInput) => void;
  addUpi: (input: AddUpiInput) => void;
  addWallet: (input: AddWalletInput) => void;

  updateCard: (id: string, patch: Partial<Pick<SavedCard, "holderName" | "expiryMonth" | "expiryYear">>) => void;

  removeCard: (id: string) => void;
  removeUpi: (id: string) => void;
  removeWallet: (id: string) => void;

  setDefaultMethod: (method: DefaultPaymentMethod) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  cards: initialCards,
  upiAccounts: initialUpiAccounts,
  wallets: initialWallets,
  defaultMethod: initialDefaultMethod,

  addCard: (input) =>
    set((state) => {
      const id = randomId("card");
      const newCard: SavedCard = {
        id,
        kind: input.kind,
        brand: detectBrand(input.cardNumber),
        holderName: input.holderName,
        last4: input.cardNumber.replace(/\s+/g, "").slice(-4),
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        isDefault: state.cards.length === 0 && state.upiAccounts.length === 0 && state.wallets.length === 0,
      };
      const cards = [...state.cards, newCard];
      const defaultMethod = newCard.isDefault ? { kind: "card" as const, id } : state.defaultMethod;
      return { cards, defaultMethod };
    }),

  addUpi: (input) =>
    set((state) => {
      const id = randomId("upi");
      const newUpi: SavedUpi = {
        id,
        upiId: input.upiId,
        isDefault: state.cards.length === 0 && state.upiAccounts.length === 0 && state.wallets.length === 0,
      };
      const upiAccounts = [...state.upiAccounts, newUpi];
      const defaultMethod = newUpi.isDefault ? { kind: "upi" as const, id } : state.defaultMethod;
      return { upiAccounts, defaultMethod };
    }),

  addWallet: (input) =>
    set((state) => {
      const id = randomId("wallet");
      const newWallet: SavedWallet = {
        id,
        provider: input.provider,
        linkedPhone: input.linkedPhone,
        isDefault: state.cards.length === 0 && state.upiAccounts.length === 0 && state.wallets.length === 0,
      };
      const wallets = [...state.wallets, newWallet];
      const defaultMethod = newWallet.isDefault ? { kind: "wallet" as const, id } : state.defaultMethod;
      return { wallets, defaultMethod };
    }),

  updateCard: (id, patch) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  removeCard: (id) =>
    set((state) => {
      const cards = state.cards.filter((c) => c.id !== id);
      const wasDefault = get().defaultMethod.kind === "card" && get().defaultMethod.id === id;
      return {
        cards,
        defaultMethod: wasDefault ? pickNextDefault(cards, state.upiAccounts, state.wallets) : state.defaultMethod,
      };
    }),

  removeUpi: (id) =>
    set((state) => {
      const upiAccounts = state.upiAccounts.filter((u) => u.id !== id);
      const wasDefault = get().defaultMethod.kind === "upi" && get().defaultMethod.id === id;
      return {
        upiAccounts,
        defaultMethod: wasDefault ? pickNextDefault(state.cards, upiAccounts, state.wallets) : state.defaultMethod,
      };
    }),

  removeWallet: (id) =>
    set((state) => {
      const wallets = state.wallets.filter((w) => w.id !== id);
      const wasDefault = get().defaultMethod.kind === "wallet" && get().defaultMethod.id === id;
      return {
        wallets,
        defaultMethod: wasDefault ? pickNextDefault(state.cards, state.upiAccounts, wallets) : state.defaultMethod,
      };
    }),

  setDefaultMethod: (method) =>
    set((state) => ({
      defaultMethod: method,
      cards: state.cards.map((c) => ({ ...c, isDefault: method.kind === "card" && c.id === method.id })),
      upiAccounts: state.upiAccounts.map((u) => ({ ...u, isDefault: method.kind === "upi" && u.id === method.id })),
      wallets: state.wallets.map((w) => ({ ...w, isDefault: method.kind === "wallet" && w.id === method.id })),
    })),
}));

/** Falls back to the first remaining card, then UPI, then wallet, after a default method is deleted. */
function pickNextDefault(cards: SavedCard[], upiAccounts: SavedUpi[], wallets: SavedWallet[]): DefaultPaymentMethod {
  if (cards[0]) return { kind: "card", id: cards[0].id };
  if (upiAccounts[0]) return { kind: "upi", id: upiAccounts[0].id };
  if (wallets[0]) return { kind: "wallet", id: wallets[0].id };
  return { kind: "card", id: "" };
}
