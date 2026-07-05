export type CardBrand = "visa" | "mastercard" | "rupay" | "amex";
export type CardKind = "credit-card" | "debit-card";
export type WalletProvider = "PhonePe" | "Amazon Pay" | "Paytm";
export type PaymentMethodKind = "card" | "upi" | "wallet";

export interface SavedCard {
  id: string;
  kind: CardKind;
  brand: CardBrand;
  holderName: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface SavedUpi {
  id: string;
  upiId: string;
  isDefault: boolean;
}

export interface SavedWallet {
  id: string;
  provider: WalletProvider;
  linkedPhone: string;
  isDefault: boolean;
}

export interface DefaultPaymentMethod {
  kind: PaymentMethodKind;
  id: string;
}

export interface AddCardInput {
  kind: CardKind;
  holderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface AddUpiInput {
  upiId: string;
}

export interface AddWalletInput {
  provider: WalletProvider;
  linkedPhone: string;
}

export type AddPaymentMethodInput =
  | { type: "credit-card" | "debit-card"; data: AddCardInput }
  | { type: "upi"; data: AddUpiInput }
  | { type: "wallet"; data: AddWalletInput };
