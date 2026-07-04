import type { MenuItem } from "@/types";

const img = (id: string) => `https://images.unsplash.com/${id}?w=400&q=80`;

export const mockMenus: Record<string, MenuItem[]> = {
  r_1: [
    { id: "m_101", restaurantId: "r_1", name: "Paneer Butter Masala", description: "Cottage cheese cubes in a velvety tomato-butter gravy.", price: 320, isVeg: true, category: "Chef's Specials", image: img("photo-1631452180519-c014fe946bc7"), isBestseller: true, spiceLevel: 1 },
    { id: "m_102", restaurantId: "r_1", name: "Butter Chicken", description: "Tandoori chicken simmered in a rich, creamy tomato sauce.", price: 380, isVeg: false, category: "Chef's Specials", image: img("photo-1588166524941-3bf61a9c41db"), isBestseller: true, spiceLevel: 1 },
    { id: "m_103", restaurantId: "r_1", name: "Dal Makhani", description: "Slow-cooked black lentils finished with cream.", price: 260, isVeg: true, category: "Mains", image: img("photo-1546833999-b9f581a1996d"), spiceLevel: 1 },
    { id: "m_104", restaurantId: "r_1", name: "Tandoori Roti (2pc)", description: "Whole wheat bread from the clay oven.", price: 60, isVeg: true, category: "Breads", image: img("photo-1601050690597-df0568f70950"), spiceLevel: 0 },
    { id: "m_105", restaurantId: "r_1", name: "Seekh Kebab", description: "Minced lamb skewers with warm spices.", price: 340, isVeg: false, category: "Starters", image: img("photo-1633945274405-b6c8069047b0"), spiceLevel: 2 },
    { id: "m_106", restaurantId: "r_1", name: "Veg Samosa (2pc)", description: "Crisp pastry filled with spiced potato.", price: 90, isVeg: true, category: "Starters", image: img("photo-1601050690597-df0568f70950"), spiceLevel: 1 },
    { id: "m_107", restaurantId: "r_1", name: "Gulab Jamun (2pc)", description: "Milk dumplings soaked in rose-cardamom syrup.", price: 120, isVeg: true, category: "Desserts", image: img("photo-1571877227200-a0d98ea607e9"), spiceLevel: 0 },
  ],
  r_2: [
    { id: "m_201", restaurantId: "r_2", name: "Margherita Pizza", description: "San Marzano tomato, fior di latte, fresh basil.", price: 420, isVeg: true, category: "Wood Fired Pizza", image: img("photo-1574071318508-1cdbab80d002"), isBestseller: true, spiceLevel: 0 },
    { id: "m_202", restaurantId: "r_2", name: "Pepperoni Pizza", description: "Spicy pepperoni, mozzarella, san marzano base.", price: 520, isVeg: false, category: "Wood Fired Pizza", image: img("photo-1628840042765-356cda07504e"), isBestseller: true, spiceLevel: 1 },
    { id: "m_203", restaurantId: "r_2", name: "Truffle Mushroom Pasta", description: "Fettuccine, wild mushrooms, truffle cream.", price: 480, isVeg: true, category: "Pasta", image: img("photo-1621996346565-e3dbc353d2e5"), spiceLevel: 0 },
    { id: "m_204", restaurantId: "r_2", name: "Garlic Bread", description: "Toasted focaccia, garlic butter, parsley.", price: 180, isVeg: true, category: "Starters", image: img("photo-1573140401552-3fab0b24427f"), spiceLevel: 0 },
    { id: "m_205", restaurantId: "r_2", name: "Caprese Salad", description: "Buffalo mozzarella, heirloom tomato, basil oil.", price: 260, isVeg: true, category: "Starters", image: img("photo-1608897013039-887f21d8c804"), spiceLevel: 0 },
    { id: "m_206", restaurantId: "r_2", name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone cream.", price: 220, isVeg: true, category: "Desserts", image: img("photo-1571877227200-a0d98ea607e9"), spiceLevel: 0 },
  ],
  r_3: [
    { id: "m_301", restaurantId: "r_3", name: "Cheese Burst Burger", description: "Double patty, molten cheddar, smoked mayo.", price: 260, isVeg: false, category: "Burgers", image: img("photo-1568901346375-23c9450c58cd"), isBestseller: true, spiceLevel: 1 },
    { id: "m_302", restaurantId: "r_3", name: "Classic Veg Burger", description: "Crispy potato patty, lettuce, secret sauce.", price: 180, isVeg: true, category: "Burgers", image: img("photo-1550547660-d9450f859349"), spiceLevel: 0 },
    { id: "m_303", restaurantId: "r_3", name: "Loaded Fries", description: "Fries, cheese sauce, jalapenos, chipotle drizzle.", price: 200, isVeg: true, category: "Sides", image: img("photo-1585109649139-366815a0d713"), spiceLevel: 2 },
    { id: "m_304", restaurantId: "r_3", name: "Grilled Chicken Wings", description: "Six pieces, smoky BBQ glaze.", price: 280, isVeg: false, category: "Sides", image: img("photo-1567620832903-9fc6debc209f"), spiceLevel: 2 },
    { id: "m_305", restaurantId: "r_3", name: "Choco Lava Shake", description: "Thick chocolate shake, molten fudge core.", price: 190, isVeg: true, category: "Beverages", image: img("photo-1572490122747-3968b75cc699"), spiceLevel: 0 },
  ],
  r_4: [
    { id: "m_401", restaurantId: "r_4", name: "Chicken Momos (Steamed)", description: "Handfolded dumplings, chili-garlic dip.", price: 180, isVeg: false, category: "Momos", image: img("photo-1496116218417-1a781b1c416c"), isBestseller: true, spiceLevel: 2 },
    { id: "m_402", restaurantId: "r_4", name: "Veg Momos (Fried)", description: "Crisp fried dumplings, schezwan chutney.", price: 160, isVeg: true, category: "Momos", image: img("photo-1496116218417-1a781b1c416c"), spiceLevel: 2 },
    { id: "m_403", restaurantId: "r_4", name: "Veg Hakka Noodles", description: "Wok-tossed noodles, julienned vegetables.", price: 220, isVeg: true, category: "Mains", image: img("photo-1585032226651-759b368d7246"), spiceLevel: 1 },
    { id: "m_404", restaurantId: "r_4", name: "Chilli Paneer", description: "Crispy paneer, capsicum, soy-chilli glaze.", price: 260, isVeg: true, category: "Starters", image: img("photo-1631452180519-c014fe946bc7"), isBestseller: true, spiceLevel: 3 },
    { id: "m_405", restaurantId: "r_4", name: "Thai Green Curry", description: "Coconut curry, thai basil, bamboo shoots.", price: 300, isVeg: false, category: "Mains", image: img("photo-1455619452474-d2be8b1e70cd"), spiceLevel: 3 },
  ],
  r_5: [
    { id: "m_501", restaurantId: "r_5", name: "Hyderabadi Chicken Biryani", description: "Dum-cooked basmati, saffron, tender chicken.", price: 340, isVeg: false, category: "Biryani", image: img("photo-1563379091339-03b21ab4a4f8"), isBestseller: true, spiceLevel: 2 },
    { id: "m_502", restaurantId: "r_5", name: "Veg Dum Biryani", description: "Layered basmati with mixed vegetables and mint.", price: 260, isVeg: true, category: "Biryani", image: img("photo-1631452180519-c014fe946bc7"), spiceLevel: 2 },
    { id: "m_503", restaurantId: "r_5", name: "Mutton Biryani", description: "Slow-cooked mutton, aromatic basmati rice.", price: 420, isVeg: false, category: "Biryani", image: img("photo-1633945274405-b6c8069047b0"), isBestseller: true, spiceLevel: 2 },
    { id: "m_504", restaurantId: "r_5", name: "Mirchi Ka Salan", description: "Chilli in a tangy peanut-sesame gravy.", price: 160, isVeg: true, category: "Sides", image: img("photo-1546833999-b9f581a1996d"), spiceLevel: 3 },
    { id: "m_505", restaurantId: "r_5", name: "Double Ka Meetha", description: "Bread pudding in saffron-milk reduction.", price: 140, isVeg: true, category: "Desserts", image: img("photo-1571877227200-a0d98ea607e9"), spiceLevel: 0 },
  ],
  r_6: [
    { id: "m_601", restaurantId: "r_6", name: "California Roll (8pc)", description: "Crab stick, avocado, cucumber, tobiko.", price: 380, isVeg: false, category: "Sushi", image: img("photo-1579584425555-c3ce17fd4351"), isBestseller: true, spiceLevel: 0 },
    { id: "m_602", restaurantId: "r_6", name: "Vegetable Gyoza", description: "Pan-seared dumplings, ponzu dip.", price: 260, isVeg: true, category: "Starters", image: img("photo-1496116218417-1a781b1c416c"), spiceLevel: 0 },
    { id: "m_603", restaurantId: "r_6", name: "Salmon Nigiri (4pc)", description: "Fresh salmon over seasoned sushi rice.", price: 420, isVeg: false, category: "Sushi", image: img("photo-1553621042-f6e147245754"), isBestseller: true, spiceLevel: 0 },
    { id: "m_604", restaurantId: "r_6", name: "Miso Soup", description: "Traditional soybean broth, tofu, scallions.", price: 140, isVeg: true, category: "Soups", image: img("photo-1547592166-23ac45744acd"), spiceLevel: 0 },
  ],
  r_7: [
    { id: "m_701", restaurantId: "r_7", name: "Masala Dosa", description: "Crisp rice crepe, spiced potato filling.", price: 130, isVeg: true, category: "Dosa", image: img("photo-1630383249896-051e6cbb17a6"), isBestseller: true, spiceLevel: 1 },
    { id: "m_702", restaurantId: "r_7", name: "Idli Sambar (4pc)", description: "Steamed rice cakes, lentil sambar, chutney.", price: 100, isVeg: true, category: "Tiffin", image: img("photo-1589301760014-d929f3979dbc"), spiceLevel: 1 },
    { id: "m_703", restaurantId: "r_7", name: "Filter Coffee", description: "South Indian decoction coffee with milk froth.", price: 60, isVeg: true, category: "Beverages", image: img("photo-1572442388796-11668a67e53d"), spiceLevel: 0 },
    { id: "m_704", restaurantId: "r_7", name: "Medu Vada (2pc)", description: "Crisp lentil doughnuts, coconut chutney.", price: 90, isVeg: true, category: "Tiffin", image: img("photo-1589301760014-d929f3979dbc"), spiceLevel: 1 },
  ],
  r_8: [
    { id: "m_801", restaurantId: "r_8", name: "Quinoa Buddha Bowl", description: "Quinoa, roasted veg, tahini dressing.", price: 340, isVeg: true, category: "Bowls", image: img("photo-1512621776951-a57141f2eefd"), isBestseller: true, spiceLevel: 0 },
    { id: "m_802", restaurantId: "r_8", name: "Grilled Chicken Salad", description: "Mixed greens, grilled chicken, citrus vinaigrette.", price: 380, isVeg: false, category: "Salads", image: img("photo-1512621776951-a57141f2eefd"), spiceLevel: 0 },
    { id: "m_803", restaurantId: "r_8", name: "Avocado Toast", description: "Sourdough, smashed avocado, chilli flakes.", price: 260, isVeg: true, category: "Light Bites", image: img("photo-1541519227354-08fa5d50c44d"), spiceLevel: 1 },
    { id: "m_804", restaurantId: "r_8", name: "Cold Pressed Juice", description: "Beetroot, carrot, apple, ginger.", price: 180, isVeg: true, category: "Beverages", image: img("photo-1622597467836-f3285f2131b8"), spiceLevel: 0 },
  ],
};

export function getMenuFor(restaurantId: string): MenuItem[] {
  return mockMenus[restaurantId] ?? [];
}
