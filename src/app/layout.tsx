import type { Metadata } from "next";
import { Unbounded, Jost } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Gift Town | A Little World of Extraordinary Gifts",
  description: "Thoughtfully curated gifts, handcrafted with love for every occasion. Fresh flower arrangements, money bouquets, customized gift hampers, and chocolate baskets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${unbounded.variable} ${jost.variable} h-full`}>
      <body className="min-h-full bg-cream text-maroon font-body antialiased selection:bg-rose selection:text-white">
        {children}
      </body>
    </html>
  );
}
