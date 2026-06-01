export type Category = {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
};

export const categories: Category[] = [
  {
    slug: "kitchen",
    name: "Kitchen",
    description: "Tools and storage solutions for the heart of your home.",
    emoji: "🍳",
    color: "bg-orange-100 text-orange-800",
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    description: "Create a calm, organised sanctuary for better sleep.",
    emoji: "🛏️",
    color: "bg-blue-100 text-blue-800",
  },
  {
    slug: "bathroom",
    name: "Bathroom",
    description: "Declutter and elevate your daily routine.",
    emoji: "🛁",
    color: "bg-teal-100 text-teal-800",
  },
  {
    slug: "living-room",
    name: "Living Room",
    description: "Smart storage that looks as good as it works.",
    emoji: "🛋️",
    color: "bg-purple-100 text-purple-800",
  },
  {
    slug: "home-office",
    name: "Home Office",
    description: "Desk setups and organisation for peak productivity.",
    emoji: "💻",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    slug: "closet",
    name: "Closet & Wardrobe",
    description: "From capsule wardrobes to seasonal storage.",
    emoji: "👗",
    color: "bg-pink-100 text-pink-800",
  },
  {
    slug: "entryway",
    name: "Entryway",
    description: "First impressions and functional entry solutions.",
    emoji: "🚪",
    color: "bg-amber-100 text-amber-800",
  },
  {
    slug: "garage",
    name: "Garage & Utility",
    description: "Heavy-duty organisation for your hardest-working spaces.",
    emoji: "🔧",
    color: "bg-gray-100 text-gray-800",
  },
];
