import type { Metadata } from "next";
import { Unbounded, Jost } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gift-town.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gift Town | Luxury Gift Hampers, Money Bouquets & Surprises Pakistan",
    template: "%s | Gift Town Pakistan",
  },
  description:
    "Gift Town is Pakistan's premier online gift boutique. Handcrafted custom gift hampers, money bouquets, fresh flowers, chocolate boxes, and grand wedding celebration suites delivered nationwide across Pakistan.",
  keywords: [
    "Gift Town",
    "Gift Town Pakistan",
    "GiftTown",
    "Gift Town online",
    "online gift delivery Pakistan",
    "money bouquet Pakistan",
    "cash bouquet delivery Pakistan",
    "custom gift hampers Pakistan",
    "wedding packages Pakistan",
    "Baat Pakki trays Pakistan",
    "bridal trousseau baskets",
    "chocolate bouquets Pakistan",
    "midnight gift delivery Pakistan",
    "send gifts to Pakistan from overseas",
    "custom gift studio Pakistan",
  ],
  authors: [{ name: "Gift Town", url: siteUrl }],
  creator: "Gift Town",
  publisher: "Gift Town",
  applicationName: "Gift Town",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Gift Town",
    title: "Gift Town | Luxury Gift Hampers, Money Bouquets & Surprises Pakistan",
    description:
      "Handcrafted custom gift hampers, money bouquets, chocolate boxes, and bespoke wedding suites delivered nationwide across Pakistan.",
    images: [
      {
        url: "/images/hero-banner-pc-hd.png",
        width: 1024,
        height: 506,
        alt: "Gift Town - A Little World of Extraordinary Gifts in Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Town | Luxury Gift Hampers & Surprises Pakistan",
    description:
      "Handcrafted custom gift hampers, money bouquets, and celebration packages with nationwide delivery in Pakistan.",
    images: ["/images/hero-banner-pc-hd.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  other: {
    "geo.region": "PK",
    "geo.placename": "Pakistan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${unbounded.variable} ${jost.variable} h-full`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full bg-cream text-maroon font-body antialiased selection:bg-rose selection:text-white">
        {children}
      </body>
    </html>
  );
}
