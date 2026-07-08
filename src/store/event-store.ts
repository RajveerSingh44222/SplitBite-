import { create } from "zustand";
import type { ActivityItem, CartLine, Participant, PartyEvent, ParticipantStatus } from "@/types";
import { buildSeedEvent, buildGuestSeedEvent, buildActivityFeed, buildPastEvents } from "@/mock/events";
import { getCurrentUser } from "@/hooks/use-current-user";
import { useProfileStore } from "@/store/profile-store";
import { mockRestaurants } from "@/mock/restaurants";
import { mockUsers } from "@/mock/users";
import { randomId } from "@/lib/utils";
import { pickAutoOrder } from "@/lib/ai-scoring";
import { buildFallbackExplanation } from "@/lib/ai-explain";

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
  joinEvent: (eventId: string, guestName?: string) => { alreadyJoined: boolean };

  setParticipantRestaurant: (eventId: string, userId: string, restaurantId: string, restaurantName: string) => void;
  updateCart: (eventId: string, userId: string, cart: CartLine[]) => void;
  markOrdered: (eventId: string, userId: string) => void;
  setParticipantStatus: (eventId: string, userId: string, status: ParticipantStatus) => void;
  autoSelectRemaining: (eventId: string) => void;
  setAutoSelectReason: (eventId: string, userId: string, reason: string) => void;
  placeEventOrder: (eventId: string) => void;
  extendTimer: (eventId: string, minutes: number) => void;
  removeParticipant: (eventId: string, userId: string) => void;
}

const seed = buildSeedEvent();
const guestSeed = buildGuestSeedEvent();
const pastEvents = buildPastEvents();

export const useEventStore = create<EventState>((set, get) => ({
  events: {
    [seed.id]: seed,
    [guestSeed.id]: guestSeed,
    ...Object.fromEntries(pastEvents.map((e) => [e.id, e])),
  },
  activities: {
    [seed.id]: buildActivityFeed(seed.id),
    [guestSeed.id]: buildActivityFeed(guestSeed.id),
  },
  order: [seed.id, guestSeed.id, ...pastEvents.map((e) => e.id)],

  createEvent: (input) => {
    const currentUser = getCurrentUser();
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

  /**
   * Actually adds the logged-in user as a participant of the event, instead
   * of only writing an activity-feed entry (which was purely cosmetic and
   * never showed the new guest in Participants / Host Panel / budget math).
   *
   * Returns { alreadyJoined: true } if this user is already a participant
   * (e.g. the host revisiting their own invite link) so the caller can skip
   * showing a duplicate "joined" activity/toast.
   */
  joinEvent: (eventId, guestName) => {
    const currentUser = getCurrentUser();
    const event = get().events[eventId];
    if (!event) return { alreadyJoined: false };

    const alreadyJoined = event.participants.some((p) => p.userId === currentUser.id);
    if (alreadyJoined) return { alreadyJoined: true };

    const newParticipant: Participant = {
      userId: currentUser.id,
      name: guestName?.trim() || currentUser.name,
      avatar: currentUser.avatar,
      status: "invited",
      cart: [],
      cartValue: 0,
      isHost: false,
      joinedAt: new Date().toISOString(),
    };

    set((state) => {
      const current = state.events[eventId];
      if (!current) return state;
      return {
        events: {
          ...state.events,
          [eventId]: { ...current, participants: [...current.participants, newParticipant] },
        },
      };
    });

    return { alreadyJoined: false };
  },

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

  /**
   * Rule-based "Smart Auto Ordering": for every participant who didn't order
   * in time, picks a restaurant + items using their favourite cuisines, past
   * orders, and the event budget (see `lib/ai-scoring.ts`). Nothing here
   * calls a model — the reasoning text is a deterministic template that gets
   * upgraded asynchronously by `setAutoSelectReason` once the LLM-phrased
   * version comes back, so the UI never blocks waiting on it.
   */
  autoSelectRemaining: (eventId) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const fallbackRestaurant = mockRestaurants.find((r) => event.suggestedRestaurantIds.includes(r.id)) ?? mockRestaurants[0];
      const currentUserId = getCurrentUser().id;
      const aiPreferences = useProfileStore.getState().aiPreferences;

      const participants = event.participants.map((p) => {
        if (p.status === "ordered") return p;

        // The logged-in user is the only participant with real, configurable
        // AI preferences — everyone else here is a mock crew member without
        // a settings screen. Opting out means they simply don't get an
        // order placed for them; they stay "invited"/"browsing" and the
        // host sees them as a guest who missed the deadline, same as before
        // this feature existed.
        if (p.userId === currentUserId && !aiPreferences.autoOrderEnabled) {
          return p;
        }

        const user = mockUsers.find((u) => u.id === p.userId);
        const preferences = p.userId === currentUserId ? { vegOnly: aiPreferences.vegOnly } : undefined;
        const pick = user ? pickAutoOrder(user, event.budgetPerPerson, event.suggestedRestaurantIds, preferences) : null;

        if (pick) {
          return {
            ...p,
            status: "auto-selected" as ParticipantStatus,
            autoSelected: true,
            restaurantId: p.restaurantId ?? pick.restaurant.id,
            restaurantName: p.restaurantName ?? pick.restaurant.name,
            cart: p.cart.length
              ? p.cart
              : pick.items.map((item) => ({
                  menuItemId: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                  isVeg: item.isVeg,
                  image: item.image,
                })),
            cartValue: p.cartValue || pick.total,
            autoSelectReason: buildFallbackExplanation("auto-order", pick.facts),
            eta: p.eta ?? `${25 + Math.floor(Math.random() * 15)} min`,
          };
        }

        // No user profile / no menu fit within budget — safe generic fallback.
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

  setAutoSelectReason: (eventId, userId, reason) =>
    set((state) => {
      const event = state.events[eventId];
      if (!event) return state;
      const participants = event.participants.map((p) => (p.userId === userId ? { ...p, autoSelectReason: reason } : p));
      return { events: { ...state.events, [eventId]: { ...event, participants } } };
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
