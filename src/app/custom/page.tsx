import type { Metadata } from "next";
import CustomStudioPageClient from "./CustomStudioPageClient";

export const metadata: Metadata = {
  title: "Custom Gift Studio | Create Your Own Hamper",
  description:
    "Design and personalize your own custom gift hamper, chocolate basket, or floral arrangement with Gift Town. Express nationwide delivery across Pakistan.",
  keywords: [
    "custom gift studio Pakistan",
    "pack your own hamper online",
    "personalized gift baskets Pakistan",
    "make your own gift box Pakistan",
    "Gift Town custom studio",
  ],
  alternates: {
    canonical: "https://gift-town.netlify.app/custom",
  },
  openGraph: {
    title: "Custom Gift Studio | Gift Town Pakistan",
    description:
      "Handpick items, chocolates, flowers, and cards to create your customized surprise gift delivered anywhere in Pakistan.",
    url: "https://gift-town.netlify.app/custom",
  },
};

export default function CustomPage() {
  return <CustomStudioPageClient />;
}
