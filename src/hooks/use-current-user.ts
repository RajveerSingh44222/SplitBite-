import { currentUser as mockCurrentUser } from "@/mock/users";
import type { User } from "@/types";

/**
 * Hook for use inside React components.
 *
 * Every component that needs "who is the logged-in user" should call this
 * instead of importing `currentUser` from `@/mock/users` directly. Right now
 * it just returns the mock user, but this is the ONE place that needs to
 * change when real auth lands (e.g. read from a session/query hook) — every
 * call site below keeps working unchanged.
 */
export function useCurrentUser(): User {
  return mockCurrentUser;
}

/**
 * Plain (non-hook) accessor for use in Zustand stores, utils, or any other
 * non-component code where React hooks aren't allowed. Mirrors
 * `useCurrentUser()` above — update both together.
 */
export function getCurrentUser(): User {
  return mockCurrentUser;
}
