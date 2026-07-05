export type UserId = string;
export type EventId = string;
export type RestaurantId = string;
export type MenuItemId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
  avatar: string;
  favoriteCuisines: string[];
  pastOrders: string[];
  phone?: string;
  memberSinceISO?: string;
}

export type ParticipantStatus = "invited" | "browsing" | "ordered" | "auto-selected" | "left";

export interface CartLine {
  menuItemId: MenuItemId;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  image: string;
}

export interface Participant {
  userId: UserId;
  name: string;
  avatar: string;
  status: ParticipantStatus;
  restaurantId?: RestaurantId;
  restaurantName?: string;
  cart: CartLine[];
  cartValue: number;
  eta?: string;
  isHost: boolean;
  autoSelected?: boolean;
  joinedAt: string;
}

export interface MenuItem {
  id: MenuItemId;
  restaurantId: RestaurantId;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  category: string;
  image: string;
  isBestseller?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
}

export interface Restaurant {
  id: RestaurantId;
  name: string;
  cuisines: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMins: number;
  priceForTwo: number;
  offer?: string;
  image: string;
  bannerImage: string;
  isPromoted?: boolean;
  distanceKm: number;
  tags: ("Highest Rated" | "Fastest Delivery" | "Most Popular" | "Best Offers")[];
}

export type EventStatus = "draft" | "collecting" | "reviewing" | "ordered" | "delivered" | "completed";

export interface PartyEvent {
  id: EventId;
  name: string;
  description: string;
  address: string;
  date: string;
  time: string;
  budgetPerPerson: number;
  hostId: UserId;
  hostName: string;
  inviteCode: string;
  inviteExpiryMins: number;
  createdAt: string;
  deadlineISO: string;
  status: EventStatus;
  participants: Participant[];
  suggestedRestaurantIds: RestaurantId[];
  coverGradient: [string, string];
}

export type ActivityType =
  | "joined"
  | "ordered"
  | "changed-restaurant"
  | "timer-updated"
  | "ai-selected"
  | "left";

export interface ActivityItem {
  id: string;
  eventId: EventId;
  type: ActivityType;
  actorName: string;
  actorAvatar: string;
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  kind: "invite" | "reminder" | "order" | "system";
}
