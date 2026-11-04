import type { Metadata } from "next";
import AllProductsPageClient from "./AllProductsPageClient";

export const metadata: Metadata = {
  title: "All Products, Bouquets & Hampers",
  description:
    "Browse Gift Town's complete collection of fresh flowers, money bouquets, chocolates, luxury baskets, and treat boxes with nationwide delivery in Pakistan.",
  keywords: [
    "Gift Town products",
    "money bouquets Pakistan",
    "chocolate baskets Pakistan",
    "flower bouquet delivery Pakistan",
    "all products Gift Town",
  ],
  alternates: {
    canonical: "https://gift-town.netlify.app/all-products",
  },
  openGraph: {
    title: "All Products & Bouquets | Gift Town Pakistan",
    description:
      "Explore handcrafted bouquets, celebration hampers, and chocolate boxes available for express delivery across Pakistan.",
    url: "https://gift-town.netlify.app/all-products",
  },
};

export default function AllProductsPage() {
  return <AllProductsPageClient />;
}
