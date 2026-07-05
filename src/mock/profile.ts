import { mockUsers } from "./users";

export interface ProfileInvitation {
  id: string;
  eventName: string;
  hostName: string;
  hostAvatar: string;
  timestamp: string;
}

const now = Date.now();

export const mockInvitations: ProfileInvitation[] = [
  {
    id: "inv_1",
    eventName: "Saturday Game Night",
    hostName: mockUsers[3].name,
    hostAvatar: mockUsers[3].avatar,
    timestamp: new Date(now - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "inv_2",
    eventName: "Office Potluck Friday",
    hostName: mockUsers[5].name,
    hostAvatar: mockUsers[5].avatar,
    timestamp: new Date(now - 26 * 3600 * 1000).toISOString(),
  },
];

/** Stats that aren't naturally derivable from event/order history are seeded here. */
export const mockMoneySaved = 1840;
export const mockFavouriteRestaurant = "Punjab Grill Express";
