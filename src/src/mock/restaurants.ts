import type { Restaurant } from "@/types";

export const mockRestaurants: Restaurant[] = [
  {
    id: "r_1",
    name: "Punjab Grill Express",
    cuisines: ["North Indian", "Mughlai", "Tandoor"],
    rating: 4.5,
    ratingCount: 2840,
    deliveryTimeMins: 28,
    priceForTwo: 600,
    offer: "50% OFF up to \u20b9100",
    image:
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
    distanceKm: 1.2,
    isPromoted: true,
    tags: ["Most Popular", "Best Offers"],
  },
  {
    id: "r_2",
    name: "Napoli Wood Fire Pizza",
    cuisines: ["Italian", "Pizza", "Pasta"],
    rating: 4.7,
    ratingCount: 1920,
    deliveryTimeMins: 32,
    priceForTwo: 750,
    offer: "Buy 1 Get 1",
    image:
      "https://images.unsplash.com/photo-1601924287811-e34de5d052a4?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=1200&q=80",
    distanceKm: 2.4,
    tags: ["Highest Rated"],
  },
  {
    id: "r_3",
    name: "The Burger Lab",
    cuisines: ["Burgers", "American", "Fast Food"],
    rating: 4.3,
    ratingCount: 3510,
    deliveryTimeMins: 22,
    priceForTwo: 450,
    offer: "Flat \u20b950 OFF",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80",
    distanceKm: 0.8,
    tags: ["Fastest Delivery"],
  },
  {
    id: "r_4",
    name: "Dragon Wok",
    cuisines: ["Chinese", "Momos", "Thai"],
    rating: 4.4,
    ratingCount: 2100,
    deliveryTimeMins: 25,
    priceForTwo: 500,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200&q=80",
    distanceKm: 1.6,
    tags: ["Most Popular"],
  },
  {
    id: "r_5",
    name: "Saffron & Spice",
    cuisines: ["Biryani", "Hyderabadi", "Mughlai"],
    rating: 4.6,
    ratingCount: 4200,
    deliveryTimeMins: 35,
    priceForTwo: 550,
    offer: "20% OFF above \u20b9400",
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80",
    distanceKm: 3.1,
    isPromoted: true,
    tags: ["Highest Rated", "Best Offers"],
  },
  {
    id: "r_6",
    name: "Sushi Sutra",
    cuisines: ["Japanese", "Sushi", "Asian"],
    rating: 4.5,
    ratingCount: 980,
    deliveryTimeMins: 40,
    priceForTwo: 900,
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&q=80",
    distanceKm: 4.0,
    tags: ["Highest Rated"],
  },
  {
    id: "r_7",
    name: "South Central Tiffin",
    cuisines: ["South Indian", "Filter Coffee"],
    rating: 4.2,
    ratingCount: 1560,
    deliveryTimeMins: 20,
    priceForTwo: 300,
    offer: "\u20b930 OFF",
    image:
      "https://images.unsplash.com/photo-1630383249896-051e6cbb17a6?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=80",
    distanceKm: 1.0,
    tags: ["Fastest Delivery", "Best Offers"],
  },
  {
    id: "r_8",
    name: "Green Bowl Co.",
    cuisines: ["Healthy", "Salads", "Continental"],
    rating: 4.4,
    ratingCount: 740,
    deliveryTimeMins: 24,
    priceForTwo: 480,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
    distanceKm: 1.9,
    tags: ["Most Popular"],
  },
];
