import type { MenuItem, Restaurant, User } from "@/types";
import { mockRestaurants } from "@/mock/restaurants";
import { getMenuFor } from "@/mock/menus";

/**
 * Rule-based "AI" scoring engine.
 *
 * Nothing in this file calls a model — it's plain, deterministic logic over
 * data we already have (favourite cuisines, past orders, ratings, budget).
 * The results are handed to `ai-explain.ts`, which is the only layer that
 * talks to an LLM, purely to phrase the reasoning as a natural sentence.
 * Keeping the split this way means the picks themselves are instant,
 * reproducible, and free — the model is only ever decorating them.
 */

function cuisineOverlap(a: string[], b: string[]): string[] {
  const bLower = b.map((c) => c.toLowerCase());
  return a.filter((c) => bLower.includes(c.toLowerCase()));
}

function nameMatchesPastOrder(itemName: string, pastOrders: string[]): boolean {
  return pastOrders.some(
    (past) =>
      past.toLowerCase() === itemName.toLowerCase() ||
      itemName.toLowerCase().includes(past.toLowerCase()) ||
      past.toLowerCase().includes(itemName.toLowerCase())
  );
}

/* ----------------------------------------------------------------------- */
/* Feature 1 — Smart Auto Ordering                                         */
/* ----------------------------------------------------------------------- */

export interface AutoOrderFacts {
  userName: string;
  matchedCuisine: string | null;
  restaurantName: string;
  pickedItemName: string;
  pickedFromPastOrders: boolean;
  budgetPerPerson: number;
  total: number;
}

export interface AutoOrderPick {
  restaurant: Restaurant;
  items: MenuItem[];
  total: number;
  facts: AutoOrderFacts;
}

/**
 * Picks a restaurant + cart for a participant who missed the deadline.
 * Preference order: cuisine match > past-order match > bestseller > cheapest.
 */
export function pickAutoOrder(
  user: User,
  budgetPerPerson: number,
  suggestedRestaurantIds: string[],
  preferences?: { vegOnly?: boolean }
): AutoOrderPick | null {
  const pool =
    suggestedRestaurantIds.length > 0
      ? mockRestaurants.filter((r) => suggestedRestaurantIds.includes(r.id))
      : mockRestaurants;

  const ranked = [...pool].sort((a, b) => {
    const aMatch = cuisineOverlap(user.favoriteCuisines, a.cuisines).length;
    const bMatch = cuisineOverlap(user.favoriteCuisines, b.cuisines).length;
    if (aMatch !== bMatch) return bMatch - aMatch;
    if (a.priceForTwo !== b.priceForTwo) return a.priceForTwo - b.priceForTwo;
    return b.rating - a.rating;
  });

  const restaurant = ranked[0] ?? mockRestaurants[0];
  if (!restaurant) return null;

  const menu = getMenuFor(restaurant.id).filter(
    (m) => m.price <= budgetPerPerson && (!preferences?.vegOnly || m.isVeg)
  );
  if (menu.length === 0) return null;

  const matchedCuisine = cuisineOverlap(user.favoriteCuisines, restaurant.cuisines)[0] ?? null;

  const scored = [...menu].sort((a, b) => {
    const aPast = nameMatchesPastOrder(a.name, user.pastOrders) ? 1 : 0;
    const bPast = nameMatchesPastOrder(b.name, user.pastOrders) ? 1 : 0;
    if (aPast !== bPast) return bPast - aPast;
    if (Boolean(a.isBestseller) !== Boolean(b.isBestseller)) return a.isBestseller ? -1 : 1;
    return b.price - a.price; // prefer the more generous option within budget
  });

  const mainItem = scored[0];
  const items: MenuItem[] = [mainItem];
  let total = mainItem.price;

  // Try to add a small side/drink if it still fits the budget.
  const extra = menu
    .filter((m) => m.id !== mainItem.id && m.price + total <= budgetPerPerson)
    .sort((a, b) => a.price - b.price)[0];
  if (extra) {
    items.push(extra);
    total += extra.price;
  }

  return {
    restaurant,
    items,
    total,
    facts: {
      userName: user.name,
      matchedCuisine,
      restaurantName: restaurant.name,
      pickedItemName: mainItem.name,
      pickedFromPastOrders: nameMatchesPastOrder(mainItem.name, user.pastOrders),
      budgetPerPerson,
      total,
    },
  };
}

/* ----------------------------------------------------------------------- */
/* Feature 2 — Restaurant Selection Assistant                              */
/* ----------------------------------------------------------------------- */

export interface RestaurantRecommendationFacts {
  restaurantName: string;
  rating: number;
  deliveryTimeMins: number;
  cuisines: string[];
  fitsBudget: boolean;
  priceForTwo: number;
  guestCount: number;
}

export interface RestaurantRecommendation {
  restaurant: Restaurant;
  score: number;
  facts: RestaurantRecommendationFacts;
}

/**
 * Ranks restaurants for a new event given the host's budget-per-person and
 * guest count. Weighs budget fit heaviest, then rating, then speed.
 */
export function rankRestaurantsForEvent(params: {
  budgetPerPerson: number;
  guestCount: number;
  restaurants?: Restaurant[];
}): RestaurantRecommendation[] {
  const { budgetPerPerson, guestCount, restaurants = mockRestaurants } = params;

  return restaurants
    .map((r) => {
      const perPersonEstimate = r.priceForTwo / 2;
      const fitsBudget = perPersonEstimate <= budgetPerPerson;
      const budgetScore = fitsBudget
        ? 1 - Math.abs(perPersonEstimate - budgetPerPerson) / Math.max(budgetPerPerson, 1)
        : -0.5;
      const ratingScore = r.rating / 5;
      const speedScore = 1 - Math.min(r.deliveryTimeMins, 60) / 60;
      const groupScore = guestCount >= 10 && r.tags.includes("Most Popular") ? 0.15 : 0;

      const score = budgetScore * 0.5 + ratingScore * 0.3 + speedScore * 0.15 + groupScore;

      return {
        restaurant: r,
        score,
        facts: {
          restaurantName: r.name,
          rating: r.rating,
          deliveryTimeMins: r.deliveryTimeMins,
          cuisines: r.cuisines,
          fitsBudget,
          priceForTwo: r.priceForTwo,
          guestCount,
        },
      };
    })
    .sort((a, b) => b.score - a.score);
}

/* ----------------------------------------------------------------------- */
/* Feature 4 — Smart Personalized Reminders                                */
/* ----------------------------------------------------------------------- */

export interface ReminderFacts {
  userName: string;
  minutesLeft: number;
  matchedCuisine: string | null;
  restaurantName: string | null;
  fitsBudget: boolean;
  budgetPerPerson: number;
}

/**
 * Reuses the same restaurant-matching logic as auto-order, but stops short
 * of picking food — it just surfaces "here's what you'd probably want and
 * it's available right now" so the person can act instead of being ordered for.
 */
export function buildReminderFacts(
  user: User,
  budgetPerPerson: number,
  suggestedRestaurantIds: string[],
  minutesLeft: number
): ReminderFacts {
  const pool =
    suggestedRestaurantIds.length > 0
      ? mockRestaurants.filter((r) => suggestedRestaurantIds.includes(r.id))
      : mockRestaurants;

  const best = [...pool].sort((a, b) => {
    const aMatch = cuisineOverlap(user.favoriteCuisines, a.cuisines).length;
    const bMatch = cuisineOverlap(user.favoriteCuisines, b.cuisines).length;
    return bMatch - aMatch;
  })[0];

  const matchedCuisine = best ? cuisineOverlap(user.favoriteCuisines, best.cuisines)[0] ?? null : null;
  const fitsBudget = best ? best.priceForTwo / 2 <= budgetPerPerson : false;

  return {
    userName: user.name,
    minutesLeft,
    matchedCuisine,
    restaurantName: best?.name ?? null,
    fitsBudget,
    budgetPerPerson,
  };
}
