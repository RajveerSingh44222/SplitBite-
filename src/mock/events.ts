import type { ActivityItem, Notification, Participant, PartyEvent } from "@/types";
import { mockUsers, currentUser } from "./users";
import { getMenuFor } from "./menus";
import { randomId } from "@/lib/utils";

const GRADIENTS: [string, string][] = [
  ["#F0552B", "#D8A13C"],
  ["#0E6B4F", "#F0552B"],
  ["#C43D3D", "#D8A13C"],
  ["#1C1712", "#F0552B"],
];

function pickGradient(seed: number): [string, string] {
  return GRADIENTS[seed % GRADIENTS.length];
}

function cartFromMenu(restaurantId: string, count: number) {
  const menu = getMenuFor(restaurantId);
  const picks = menu.slice(0, count);
  return picks.map((m) => ({
    menuItemId: m.id,
    name: m.name,
    price: m.price,
    quantity: 1,
    isVeg: m.isVeg,
    image: m.image,
  }));
}

function cartTotal(cart: { price: number; quantity: number }[]) {
  return cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
}

/** Builds the single pre-seeded demo event so the app feels alive on first load. */
export function buildSeedEvent(): PartyEvent {
  const now = Date.now();
  const deadline = new Date(now + 12 * 60 * 1000).toISOString(); // 12 min from now
  const [u1, u2, u3, u4, u5, u6, u7] = mockUsers;

  const cart1 = cartFromMenu("r_1", 2);
  const cart2 = cartFromMenu("r_3", 1);
  const cart3 = cartFromMenu("r_5", 2);

  const participants: Participant[] = [
    {
      userId: u1.id,
      name: u1.name,
      avatar: u1.avatar,
      status: "ordered",
      restaurantId: "r_1",
      restaurantName: "Punjab Grill Express",
      cart: cart1,
      cartValue: cartTotal(cart1),
      eta: "28 min",
      isHost: true,
      joinedAt: new Date(now - 40 * 60 * 1000).toISOString(),
    },
    {
      userId: u2.id,
      name: u2.name,
      avatar: u2.avatar,
      status: "ordered",
      restaurantId: "r_5",
      restaurantName: "Saffron & Spice",
      cart: cart3,
      cartValue: cartTotal(cart3),
      eta: "35 min",
      isHost: false,
      joinedAt: new Date(now - 35 * 60 * 1000).toISOString(),
    },
    {
      userId: u3.id,
      name: u3.name,
      avatar: u3.avatar,
      status: "ordered",
      restaurantId: "r_3",
      restaurantName: "The Burger Lab",
      cart: cart2,
      cartValue: cartTotal(cart2),
      eta: "22 min",
      isHost: false,
      joinedAt: new Date(now - 33 * 60 * 1000).toISOString(),
    },
    {
      userId: u4.id,
      name: u4.name,
      avatar: u4.avatar,
      status: "browsing",
      restaurantId: "r_6",
      restaurantName: "Sushi Sutra",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 20 * 60 * 1000).toISOString(),
    },
    {
      userId: u5.id,
      name: u5.name,
      avatar: u5.avatar,
      status: "invited",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 18 * 60 * 1000).toISOString(),
    },
    {
      userId: u6.id,
      name: u6.name,
      avatar: u6.avatar,
      status: "invited",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 10 * 60 * 1000).toISOString(),
    },
    {
      userId: u7.id,
      name: u7.name,
      avatar: u7.avatar,
      status: "browsing",
      restaurantId: "r_2",
      restaurantName: "Napoli Wood Fire Pizza",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 8 * 60 * 1000).toISOString(),
    },
  ];

  return {
    id: "evt_diwali",
    name: "Diwali Potluck at Aditi's",
    description: "Team celebration \u2014 everyone orders their favourite, we split the joy (and the bill).",
    address: "12th Cross, Indiranagar, Bengaluru",
    date: new Date(now + 2 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "8:00 PM",
    budgetPerPerson: 500,
    hostId: u1.id,
    hostName: u1.name,
    inviteCode: "DIWALI-8F2K",
    inviteExpiryMins: 30,
    createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
    deadlineISO: deadline,
    status: "collecting",
    participants,
    suggestedRestaurantIds: ["r_1", "r_5", "r_3", "r_4", "r_7"],
    coverGradient: pickGradient(1),
  };
}

/**
 * A second live event, hosted by someone else, with `currentUser` as a
 * plain (non-host) guest. Every other seed event either has currentUser as
 * host or omits them entirely — meaning the guest-facing UI (no Host Panel,
 * "waiting for the host" copy, the ability to leave an event) had no real
 * scenario to be exercised in. This one exists specifically for that.
 */
export function buildGuestSeedEvent(): PartyEvent {
  const now = Date.now();
  const deadline = new Date(now + 25 * 60 * 1000).toISOString();
  const [u1, u2, u3, , u5, u6, u7] = mockUsers; // u1=currentUser, u4 (Riya) is host here

  const hostCart = cartFromMenu("r_3", 2);
  const yourCart = cartFromMenu("r_4", 1);

  const participants: Participant[] = [
    {
      userId: u3.id, // Riya Malhotra hosts this one
      name: "Riya Malhotra",
      avatar: u3.avatar,
      status: "ordered",
      restaurantId: "r_3",
      restaurantName: "The Burger Lab",
      cart: hostCart,
      cartValue: cartTotal(hostCart),
      eta: "24 min",
      isHost: true,
      joinedAt: new Date(now - 20 * 60 * 1000).toISOString(),
    },
    {
      userId: u2.id,
      name: u2.name,
      avatar: u2.avatar,
      status: "browsing",
      restaurantId: "r_4",
      restaurantName: "Dragon Wok",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 15 * 60 * 1000).toISOString(),
    },
    {
      userId: u5.id,
      name: u5.name,
      avatar: u5.avatar,
      status: "invited",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 10 * 60 * 1000).toISOString(),
    },
    {
      userId: u6.id,
      name: u6.name,
      avatar: u6.avatar,
      status: "invited",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date(now - 9 * 60 * 1000).toISOString(),
    },
    {
      userId: u7.id,
      name: u7.name,
      avatar: u7.avatar,
      status: "ordered",
      restaurantId: "r_4",
      restaurantName: "Dragon Wok",
      cart: cartFromMenu("r_4", 1),
      cartValue: cartTotal(cartFromMenu("r_4", 1)),
      eta: "26 min",
      isHost: false,
      joinedAt: new Date(now - 7 * 60 * 1000).toISOString(),
    },
    {
      userId: u1.id, // currentUser — a guest here, not the host
      name: u1.name,
      avatar: u1.avatar,
      status: "browsing",
      restaurantId: "r_4",
      restaurantName: "Dragon Wok",
      cart: yourCart,
      cartValue: cartTotal(yourCart),
      isHost: false,
      joinedAt: new Date(now - 4 * 60 * 1000).toISOString(),
    },
  ];

  return {
    id: "evt_movie_night",
    name: "Friday Movie Night",
    description: "IPL semifinal + a movie after \u2014 order whatever gets you through it.",
    address: "Riya's Place, Koramangala 5th Block, Bengaluru",
    date: new Date(now + 5 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "7:30 PM",
    budgetPerPerson: 400,
    hostId: u3.id,
    hostName: "Riya Malhotra",
    inviteCode: "MOVIENIGHT-7Q2",
    inviteExpiryMins: 30,
    createdAt: new Date(now - 22 * 60 * 1000).toISOString(),
    deadlineISO: deadline,
    status: "collecting",
    participants,
    suggestedRestaurantIds: ["r_3", "r_4", "r_2", "r_6"],
    coverGradient: pickGradient(2),
  };
}

function buildMovieNightActivityFeed(eventId: string): ActivityItem[] {
  const now = Date.now();
  const items: Omit<ActivityItem, "id" | "eventId">[] = [
    { type: "joined", actorName: "Riya Malhotra", actorAvatar: mockUsers[3].avatar, message: "created the event", timestamp: new Date(now - 22 * 60000).toISOString() },
    { type: "joined", actorName: "Rajveer Singh", actorAvatar: mockUsers[1].avatar, message: "joined the event", timestamp: new Date(now - 15 * 60000).toISOString() },
    { type: "ordered", actorName: "Riya Malhotra", actorAvatar: mockUsers[3].avatar, message: "ordered from The Burger Lab", timestamp: new Date(now - 14 * 60000).toISOString() },
    { type: "joined", actorName: "Karan Mehta", actorAvatar: mockUsers[4].avatar, message: "joined the event", timestamp: new Date(now - 10 * 60000).toISOString() },
    { type: "joined", actorName: "Sana Sheikh", actorAvatar: mockUsers[5].avatar, message: "joined the event", timestamp: new Date(now - 9 * 60000).toISOString() },
    { type: "joined", actorName: "Devansh Kapoor", actorAvatar: mockUsers[6].avatar, message: "joined the event", timestamp: new Date(now - 7 * 60000).toISOString() },
    { type: "ordered", actorName: "Devansh Kapoor", actorAvatar: mockUsers[6].avatar, message: "ordered from Dragon Wok", timestamp: new Date(now - 6 * 60000).toISOString() },
    { type: "joined", actorName: "Aditi Rao", actorAvatar: currentUser.avatar, message: "joined the event", timestamp: new Date(now - 4 * 60000).toISOString() },
  ];
  return items.map((it) => ({ ...it, id: randomId("act"), eventId }));
}

export function buildActivityFeed(eventId: string): ActivityItem[] {
  if (eventId === "evt_movie_night") return buildMovieNightActivityFeed(eventId);
  const now = Date.now();
  const items: Omit<ActivityItem, "id" | "eventId">[] = [
    { type: "joined", actorName: "Aditi Rao", actorAvatar: mockUsers[0].avatar, message: "created the event", timestamp: new Date(now - 45 * 60000).toISOString() },
    { type: "joined", actorName: "Rajveer Singh", actorAvatar: mockUsers[1].avatar, message: "joined the event", timestamp: new Date(now - 35 * 60000).toISOString() },
    { type: "ordered", actorName: "Rajveer Singh", actorAvatar: mockUsers[1].avatar, message: "ordered from Saffron & Spice", timestamp: new Date(now - 30 * 60000).toISOString() },
    { type: "joined", actorName: "Aman Gupta", actorAvatar: mockUsers[2].avatar, message: "joined the event", timestamp: new Date(now - 33 * 60000).toISOString() },
    { type: "ordered", actorName: "Aman Gupta", actorAvatar: mockUsers[2].avatar, message: "ordered from The Burger Lab", timestamp: new Date(now - 28 * 60000).toISOString() },
    { type: "joined", actorName: "Riya Malhotra", actorAvatar: mockUsers[3].avatar, message: "joined the event", timestamp: new Date(now - 20 * 60000).toISOString() },
    { type: "changed-restaurant", actorName: "Riya Malhotra", actorAvatar: mockUsers[3].avatar, message: "switched to Sushi Sutra", timestamp: new Date(now - 12 * 60000).toISOString() },
    { type: "joined", actorName: "Devansh Kapoor", actorAvatar: mockUsers[6].avatar, message: "joined the event", timestamp: new Date(now - 8 * 60000).toISOString() },
    { type: "timer-updated", actorName: "Aditi Rao", actorAvatar: mockUsers[0].avatar, message: "extended the timer by 5 minutes", timestamp: new Date(now - 3 * 60000).toISOString() },
  ];
  return items.map((it) => ({ ...it, id: randomId("act"), eventId }));
}

export function buildNotifications(): Notification[] {
  const now = Date.now();
  return [
    { id: randomId("ntf"), title: "You're invited! \ud83c\udf89", body: "Aditi Rao invited you to Diwali Potluck at Aditi's", timestamp: new Date(now - 5 * 60000).toISOString(), read: false, kind: "invite" },
    { id: randomId("ntf"), title: "8 minutes left", body: "Order for Diwali Potluck closes soon", timestamp: new Date(now - 2 * 60000).toISOString(), read: false, kind: "reminder" },
    { id: randomId("ntf"), title: "Order placed", body: "Your team lunch order was placed successfully", timestamp: new Date(now - 26 * 3600 * 1000).toISOString(), read: true, kind: "order" },
    { id: randomId("ntf"), title: "Welcome to SplitBite", body: "Create your first event and invite your crew", timestamp: new Date(now - 96 * 3600 * 1000).toISOString(), read: true, kind: "system" },
  ];
}

export function buildPastEvents(): PartyEvent[] {
  const now = Date.now();
  return [
    {
      id: "evt_past_1",
      name: "Friday Team Lunch",
      description: "Weekly team sync lunch order",
      address: "WeWork Galaxy, Residency Road, Bengaluru",
      date: new Date(now - 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      time: "1:00 PM",
      budgetPerPerson: 350,
      hostId: currentUser.id,
      hostName: currentUser.name,
      inviteCode: "TEAMLUNCH-9X",
      inviteExpiryMins: 30,
      createdAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      deadlineISO: new Date(now - 3 * 24 * 3600 * 1000 + 30 * 60000).toISOString(),
      status: "completed",
      participants: mockUsers.slice(0, 5).map((u, i) => ({
        userId: u.id,
        name: u.name,
        avatar: u.avatar,
        status: "ordered" as const,
        restaurantId: "r_7",
        restaurantName: "South Central Tiffin",
        cart: cartFromMenu("r_7", 1),
        cartValue: cartTotal(cartFromMenu("r_7", 1)),
        isHost: i === 0,
        joinedAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      })),
      suggestedRestaurantIds: ["r_7"],
      coverGradient: pickGradient(2),
    },
    {
      id: "evt_past_2",
      name: "Match Night Munchies",
      description: "IPL final watch party \u2014 snacks for everyone",
      address: "Aman's Apartment, Koramangala, Bengaluru",
      date: new Date(now - 10 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      time: "7:00 PM",
      budgetPerPerson: 400,
      hostId: mockUsers[2].id,
      hostName: mockUsers[2].name,
      inviteCode: "MATCHNIGHT-3Q",
      inviteExpiryMins: 45,
      createdAt: new Date(now - 10 * 24 * 3600 * 1000).toISOString(),
      deadlineISO: new Date(now - 10 * 24 * 3600 * 1000 + 45 * 60000).toISOString(),
      status: "completed",
      participants: mockUsers.slice(1, 6).map((u, i) => ({
        userId: u.id,
        name: u.name,
        avatar: u.avatar,
        status: "ordered" as const,
        restaurantId: "r_3",
        restaurantName: "The Burger Lab",
        cart: cartFromMenu("r_3", 2),
        cartValue: cartTotal(cartFromMenu("r_3", 2)),
        isHost: i === 0,
        joinedAt: new Date(now - 10 * 24 * 3600 * 1000).toISOString(),
      })),
      suggestedRestaurantIds: ["r_3"],
      coverGradient: pickGradient(3),
    },
  ];
}
