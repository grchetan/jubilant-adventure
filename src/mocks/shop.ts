export type ShopProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge: string;
};

export const shopProducts: ShopProduct[] = [
  {
    id: "table-stand",
    name: "Acrylic Table Stand",
    description: "Clear acrylic stand that holds your QR card at table height. Wipes clean, stands steady, looks good on any table.",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
    badge: "Coming soon",
  },
  {
    id: "wall-poster",
    name: "Wall Poster A3",
    description: "Matte A3 poster with your QR code, logo and a short line. Ideal for the entrance, counter or pickup window.",
    price: "₹349",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    badge: "Coming soon",
  },
  {
    id: "stickers",
    name: "QR Sticker Pack",
    description: "Twelve weather-proof stickers for tables, takeaway boxes, cash counters and delivery bags.",
    price: "₹249",
    image:
      "https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=800&q=80",
    badge: "Coming soon",
  },
  {
    id: "table-tent",
    name: "Folded Table Tent",
    description: "Double-sided tent card with your restaurant name on one side and the QR code on the other.",
    price: "₹399",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    badge: "Coming soon",
  },
];

export const shopSteps = [
  { title: "Pick a product", text: "Table stands, posters and stickers — everything that carries your QR code." },
  { title: "Payment & delivery", text: "Secure checkout and courier delivery will be switched on in the next release." },
  { title: "We print your code", text: "Your logo, your colours and the live menu link, printed exactly as you see it here." },
];