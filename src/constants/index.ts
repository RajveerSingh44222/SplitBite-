export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  createEvent: "/events/create",
  event: (id: string) => `/events/${id}`,
  restaurants: (id: string) => `/events/${id}/restaurants`,
  restaurant: (id: string, restaurantId: string) => `/events/${id}/restaurants/${restaurantId}`,
  review: (id: string) => `/events/${id}/review`,
  payment: (id: string) => `/events/${id}/payment`,
  success: (id: string) => `/events/${id}/success`,
  join: (code: string) => `/join/${code}`,
  joinEntry: "/join",
  profile: "/profile",
  paymentMethods: "/profile/payment",
};

export const APP_NAME = "SplitBite";
export const APP_TAGLINE = "Collaborative food ordering for every gathering.";

export const CARD_BRAND_LABEL: Record<"visa" | "mastercard" | "rupay" | "amex", string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  rupay: "RuPay",
  amex: "Amex",
};

export const WALLET_PROVIDER_COLOR: Record<"PhonePe" | "Amazon Pay" | "Paytm", string> = {
  PhonePe: "text-kasturi bg-kasturi-light",
  "Amazon Pay": "text-ink bg-surface-muted",
  Paytm: "text-ember bg-ember/10",
};
