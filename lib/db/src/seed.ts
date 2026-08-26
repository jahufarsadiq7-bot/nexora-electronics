import { db, products } from "./index";

const seedProducts = [
  {
    name: "Arc One",
    slug: "arc-one",
    description:
      "A sculptural audio hub for rooms that deserve a quieter presence.",
    price: "29999.00",
    category: "Gadgets",
    stock: 10,
    images: ["/nexora-hub.jpg"],
    isActive: true,
  },
  {
    name: "Halo Buds",
    slug: "halo-buds",
    description:
      "Compact wireless earbuds shaped for commutes and slow mornings.",
    price: "15999.00",
    category: "Accessories",
    stock: 10,
    images: ["/nexora-earbuds.jpg"],
    isActive: true,
  },
  {
    name: "Beam Mini",
    slug: "beam-mini",
    description:
      "A small ambient speaker for desks, shelves, and bedside tables.",
    price: "19999.00",
    category: "Gadgets",
    stock: 10,
    images: [],
    isActive: true,
  },
  {
    name: "Form Dock",
    slug: "form-dock",
    description:
      "A considered charging dock for an uncluttered workspace.",
    price: "10999.00",
    category: "Accessories",
    stock: 10,
    images: [],
    isActive: true,
  },
  {
    name: "Trace Tag",
    slug: "trace-tag",
    description:
      "A pocket-sized finder for the everyday things you carry.",
    price: "3999.00",
    category: "Accessories",
    stock: 10,
    images: [],
    isActive: true,
  },
  {
    name: "Pulse Watch",
    slug: "pulse-watch",
    description:
      "A pared-back wearable for staying close to your daily rhythm.",
    price: "23999.00",
    category: "Gadgets",
    stock: 10,
    images: [],
    isActive: true,
  },
];

await db.insert(products).values(seedProducts).onConflictDoNothing();

console.log("Seeded Nexora products:", seedProducts.length);

process.exit(0);
