import type { Metadata } from "next";
import PackagesPageClient from "./PackagesPageClient";

export const metadata: Metadata = {
  title: "All Packages & Wedding Suites",
  description:
    "Explore Gift Town's signature celebration packages, bridal trousseau baskets, Baat Pakki suites, and luxury birthday hampers delivered all over Pakistan.",
  keywords: [
    "Gift Town packages",
    "wedding packages Pakistan",
    "Baat Pakki trays",
    "bridal trousseau baskets",
    "birthday hampers Pakistan",
    "gift packages delivery Pakistan",
  ],
  alternates: {
    canonical: "https://gift-town.netlify.app/packages",
  },
  openGraph: {
    title: "Signature Packages & Wedding Suites | Gift Town Pakistan",
    description:
      "All-inclusive celebration suites, Baat Pakki packages, and customized hampers delivered nationwide across Pakistan.",
    url: "https://gift-town.netlify.app/packages",
  },
};

export default function PackagesPage() {
  return <PackagesPageClient />;
}
