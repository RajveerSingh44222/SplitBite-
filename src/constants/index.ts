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
  success: (id: string) => `/events/${id}/success`,
  join: (code: string) => `/join/${code}`,
  joinEntry: "/join"
};

export const APP_NAME = "PartyPlatter";
export const APP_TAGLINE = "Collaborative food ordering for every gathering.";
