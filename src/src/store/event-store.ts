import { create } from "zustand";
import type { ActivityItem, CartLine, PartyEvent, ParticipantStatus } from "@/types";
import { buildSeedEvent, buildActivityFeed, buildPastEvents } from "@/mock/events";
import { currentUser } from "@/mock/users";
import { mockRestaurants } from "@/mock/restaurants";
import { randomId } from "@/lib/utils";

interface CreateEventInput {
  name: string;
  description: string;
  address: string;
  date: string;
  time: string;
  budgetPerPerson: number;
  inviteExpiryMins: number;
  suggestedRestaurantIds: string[];
}

interface EventState {
  events: Record<string, PartyEvent>;
  activities: Record<string, ActivityItem[]>;
  order: string[];

  createEvent: (input: CreateEventInput) => string;
  getEvent: (id: string) => PartyEvent | undefined;
  listMine: () => PartyEvent[];
  pushActivity: (eventId: string, activity: Omit<ActivityItem, "id" | "eventId">) => void;

  setParticipantRestaurant: (eventId: string, userId: string, restaurantId: string, restaurantName: string) => void;
  updateCart: (eventId: string, userId: string, cart: CartLine[]) => void;
  markOrdered: (eventId: string, userId: string) => void;
  setParticipantStatus: (eventId: string, userId: string, status: ParticipantStatus) => void;
  autoSelectRemaining: (eventId: string) => void;
  placeEventOrder: (eventId: string) => void;
  extendTimer: (eventId: string, minutes: number) => void;
  removeParticipant: (eventId: string, userId: string) => void;
}

const seed = buildSeedEvent();
const pastEvents = buildPastEvents();

export const useEventStore = create<EventState>((set, get) => ({
  events: {
    [seed.id]: seed,
    ...Object.fromEntries(pastEvents.map((e) => [e.id, e])),
  },
  activities: {
    [seed.id]: buildActivityFeed(seed.id),
  },
  order: [seed.id, ...pastEvents.map((e) => e.id)],

  createEvent: (input) => {
    const id = randomId("evt");
    const deadlineISO = new Date(Date.now() + input.inviteExpiryMins * 60 * 1000).toISOString();
    const inviteCode = `${input.name.split(" ")[0].toUpperCase().slice(0, 6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const newEvent: PartyEvent = {
      id,
      name: input.name,
      description: input.description,
      address: input.address,
      date: input.date,
      time: input.time,
      budgetPerPerson: input.budgetPerPerson,
      hostId: currentUser.id,
      hostName: currentUser.name,
      inviteCode,
      inviteExpiryMins: input.inviteExpiryMins,
      createdAt: new Date().toISOString(),
      deadlineISO,
      status: "collecting",
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          status: "invited",
          cart: [],
          cartValue: 0,
          isHost: true,
          joinedAt: new Date().toISOString(),
        },
      ],
      suggestedRestaurantIds:
        input.suggestedRestaurantIds.length > 0
          ? input.suggestedRestaurantIds
          : mockRestaurants.slice(0, 5).map((r) => r.id),
      coverGradient: ["#F0552B", "#D8A13C"],
    };
    set((state) => ({
      events: { ...state.events, [id]: newEvent },
      activities: {
        ...state.activities,
        [id]: [
          {
            id: randomId("act"),
            eventId: id,
            type: "joined",
            actorName: currentUser.name,
            actorAvatar: currentUser.avatar,
            message: "created the event",
            timestamp: new Date().toISOString(),
          },
        ],
      },
      order: [id, ...state.order],
    }));
    return id;
  },

  getEvent: (id) => get().events[id],

  listMine: () => get().order.map((id) => get().events[id]).filter(Boolean),

  pushActivity: (eventId, activity) =>
    set((state) => ({
      activities: {
        ...state.activities,
        [eventId]: [{ ...activity, id: randomId("act"), eventId }, ...(state.activities[eventId] ?? [])],
      },
    })),

  setParticipantRestaurant: (eventId, userId, restaurantId, restaurantName) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const participants = event.participants.map((p) =>
        p.userId === userId
          ? { ...p, restaurantId, restaurantName, status: "browsing" as ParticipantStatus }
          : p
      );
      return { events: { ...state.events, [eventId]: { ...event, participants } } };
    }),

  updateCart: (eventId, userId, cart) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const cartValue = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
      const participants = event.participants.map((p) =>
        p.userId === userId ? { ...p, cart, cartValue } : p
      );
      return { events: { ...state.events, [eventId]: { ...event, participants } } };
    }),

  markOrdered: (eventId, userId) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const participants = event.participants.map((p) =>
        p.userId === userId
          ? { ...p, status: "ordered" as ParticipantStatus, eta: `${20 + Math.floor(Math.random() * 20)} min` }
          : p
      );
      return { events: { ...state.events, [eventId]: { ...event, participants } } };
    }),

  setParticipantStatus: (eventId, userId, status) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const participants = event.participants.map((p) => (p.userId === userId ? { ...p, status } : p));
      return { events: { ...state.events, [eventId]: { ...event, participants } } };
    }),

  autoSelectRemaining: (eventId) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const fallbackRestaurant = mockRestaurants.find((r) => event.suggestedRestaurantIds.includes(r.id)) ?? mockRestaurants[0];
      const participants = event.participants.map((p) => {
        if (p.status === "ordered") return p;
        const price = Math.min(event.budgetPerPerson - 20, 280);
        return {
          ...p,
          status: "auto-selected" as ParticipantStatus,
          autoSelected: true,
          restaurantId: p.restaurantId ?? fallbackRestaurant.id,
          restaurantName: p.restaurantName ?? fallbackRestaurant.name,
          cart: p.cart.length
            ? p.cart
            : [
                {
                  menuItemId: randomId("auto"),
                  name: "Chef's Recommended Combo",
                  price,
                  quantity: 1,
                  isVeg: true,
                  image: fallbackRestaurant.image,
                },
              ],
          cartValue: p.cartValue || price,
          eta: p.eta ?? `${25 + Math.floor(Math.random() * 15)} min`,
        };
      });
      return { events: { ...state.events, [eventId]: { ...event, participants, status: "reviewing" } } };
    }),

  placeEventOrder: (eventId) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      return { events: { ...state.events, [eventId]: { ...event, status: "ordered" } } };
    }),

  extendTimer: (eventId, minutes) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const newDeadline = new Date(new Date(event.deadlineISO).getTime() + minutes * 60000).toISOString();
      return { events: { ...state.events, [eventId]: { ...event, deadlineISO: newDeadline } } };
    }),

  removeParticipant: (eventId, userId) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      return {
        events: {
          ...state.events,
          [eventId]: { ...event, participants: event.participants.filter((p) => p.userId !== userId) },
        },
      };
    }),
}));
