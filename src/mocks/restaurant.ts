export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
  veg: boolean;
  available: boolean;
};

export type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Restaurant = {
  name: string;
  slug: string;
  logo: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  categories: Category[];
};

export const defaultRestaurant: Restaurant = {
  name: "Cafe Mocha",
  slug: "cafe-mocha",
  logo: "",
  address: "12, MG Road, Indore, Madhya Pradesh",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  hours: "Open daily · 9:00 AM – 11:00 PM",
  categories: [
    {
      id: "cat-starters",
      name: "Starters",
      items: [
        {
          id: "item-paneer-tikka",
          name: "Paneer Tikka",
          description: "Char-grilled cottage cheese, mint chutney, pickled onion",
          price: 220,
          photo:
            "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
          veg: true,
          available: true,
        },
        {
          id: "item-chicken-wings",
          name: "Peri Peri Wings",
          description: "Six wings tossed in house peri peri butter",
          price: 280,
          photo: "",
          veg: false,
          available: true,
        },
        {
          id: "item-garlic-bread",
          name: "Cheesy Garlic Bread",
          description: "Sourdough, garlic butter, mozzarella pull",
          price: 160,
          photo: "",
          veg: true,
          available: false,
        },
      ],
    },
    {
      id: "cat-main",
      name: "Main Course",
      items: [
        {
          id: "item-butter-chicken",
          name: "Butter Chicken",
          description: "Slow-cooked gravy, cream, cinnamon, butter naan",
          price: 340,
          photo: "",
          veg: false,
          available: true,
        },
        {
          id: "item-malai-kofta",
          name: "Malai Kofta",
          description: "Cashew gravy with paneer dumplings and saffron",
          price: 300,
          photo: "",
          veg: true,
          available: true,
        },
        {
          id: "item-veggie-pasta",
          name: "Garden Veg Pasta",
          description: "Penne, seasonal vegetables, basil pesto",
          price: 260,
          photo: "",
          veg: true,
          available: true,
        },
      ],
    },
    {
      id: "cat-drinks",
      name: "Drinks",
      items: [
        {
          id: "item-cold-coffee",
          name: "Cold Coffee",
          description: "Double shot, cold milk, one scoop of vanilla",
          price: 140,
          photo:
            "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80",
          veg: true,
          available: true,
        },
        {
          id: "item-masala-chai",
          name: "Masala Chai",
          description: "Ginger, cardamom and clove brewed with full-fat milk",
          price: 40,
          photo: "",
          veg: true,
          available: true,
        },
        {
          id: "item-fresh-lime",
          name: "Fresh Lime Soda",
          description: "Sweet or salted, served over crushed ice",
          price: 80,
          photo: "",
          veg: true,
          available: true,
        },
      ],
    },
    {
      id: "cat-desserts",
      name: "Desserts",
      items: [
        {
          id: "item-choco-lava",
          name: "Choco Lava Cake",
          description: "Warm centre, cocoa dust, vanilla ice cream",
          price: 190,
          photo: "",
          veg: true,
          available: true,
        },
        {
          id: "item-tiramisu",
          name: "Classic Tiramisu",
          description: "Coffee soaked sponge, mascarpone, cocoa",
          price: 220,
          photo: "",
          veg: true,
          available: false,
        },
      ],
    },
  ],
};

export const supportContact = {
  brand: "ScanDish",
  whatsapp: "919876543210",
  whatsappLabel: "+91 98765 43210",
  email: "hello@scandish.app",
  hours: "Mon – Sat · 10:00 AM – 7:00 PM",
};