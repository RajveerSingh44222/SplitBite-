import type { User } from "@/types";

export const currentUser: User = {
  id: "u_you",
  name: "Aditi Rao",
  email: "aditi.rao@example.com",
  avatar: "https://i.pravatar.cc/150?img=47",
  favoriteCuisines: ["North Indian", "Italian", "Momos"],
  pastOrders: ["Paneer Butter Masala", "Margherita Pizza", "Chicken Momos"],
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: "u_2",
    name: "Rajveer Singh",
    email: "rajveer@example.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    favoriteCuisines: ["Biryani", "Mughlai"],
    pastOrders: ["Hyderabadi Biryani", "Seekh Kebab"],
  },
  {
    id: "u_3",
    name: "Aman Gupta",
    email: "aman@example.com",
    avatar: "https://i.pravatar.cc/150?img=33",
    favoriteCuisines: ["Burgers", "American"],
    pastOrders: ["Cheese Burst Burger", "Loaded Fries"],
  },
  {
    id: "u_4",
    name: "Riya Malhotra",
    email: "riya@example.com",
    avatar: "https://i.pravatar.cc/150?img=25",
    favoriteCuisines: ["Sushi", "Thai"],
    pastOrders: ["California Roll", "Pad Thai"],
  },
  {
    id: "u_5",
    name: "Karan Mehta",
    email: "karan@example.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    favoriteCuisines: ["South Indian"],
    pastOrders: ["Masala Dosa", "Filter Coffee"],
  },
  {
    id: "u_6",
    name: "Sana Sheikh",
    email: "sana@example.com",
    avatar: "https://i.pravatar.cc/150?img=48",
    favoriteCuisines: ["Chinese", "Momos"],
    pastOrders: ["Veg Hakka Noodles", "Chilli Paneer"],
  },
  {
    id: "u_7",
    name: "Devansh Kapoor",
    email: "devansh@example.com",
    avatar: "https://i.pravatar.cc/150?img=52",
    favoriteCuisines: ["Pizza", "Italian"],
    pastOrders: ["Farmhouse Pizza", "Garlic Bread"],
  },
  {
    id: "u_8",
    name: "Neha Joshi",
    email: "neha@example.com",
    avatar: "https://i.pravatar.cc/150?img=44",
    favoriteCuisines: ["Healthy", "Salads"],
    pastOrders: ["Quinoa Bowl", "Greek Salad"],
  },
];
