import type { DefaultPaymentMethod, SavedCard, SavedUpi, SavedWallet } from "@/types/payment";

export const initialCards: SavedCard[] = [
  {
    id: "card_1",
    kind: "credit-card",
    brand: "visa",
    holderName: "Aditi Rao",
    last4: "4921",
    expiryMonth: "09",
    expiryYear: "27",
    isDefault: true,
  },
  {
    id: "card_2",
    kind: "debit-card",
    brand: "mastercard",
    holderName: "Aditi Rao",
    last4: "7735",
    expiryMonth: "02",
    expiryYear: "26",
    isDefault: false,
  },
];

export const initialUpiAccounts: SavedUpi[] = [
  { id: "upi_1", upiId: "rajveer@okhdfc", isDefault: false },
  { id: "upi_2", upiId: "rajveer@oksbi", isDefault: false },
];

export const initialWallets: SavedWallet[] = [
  { id: "wallet_1", provider: "PhonePe", linkedPhone: "+91 98765 43210", isDefault: false },
  { id: "wallet_2", provider: "Amazon Pay", linkedPhone: "+91 98765 43210", isDefault: false },
  { id: "wallet_3", provider: "Paytm", linkedPhone: "+91 98765 43210", isDefault: false },
];

export const initialDefaultMethod: DefaultPaymentMethod = { kind: "card", id: "card_1" };

export const WALLET_PROVIDERS = ["PhonePe", "Amazon Pay", "Paytm"] as const;
