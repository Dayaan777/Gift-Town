"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedPackagesSection from "@/components/FeaturedPackagesSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import GildedRibbonStream from "@/components/GildedRibbonStream";
import RibbonSectionDivider from "@/components/RibbonSectionDivider";
import LazySection from "@/components/LazySection";
import { preloadGalleryMedia } from "@/lib/preloadGalleryMedia";

// Code-split mid and bottom sections to keep initial bundle ultra-light
const SentimentsSection = dynamic(() => import("@/components/SentimentsSection"), {
  loading: () => <div className="min-h-[420px] bg-[#fce3e0]" />,
});

const GiftsOfTheMonth = dynamic(() => import("@/components/home/GiftsOfTheMonth"), {
  loading: () => <div className="min-h-[480px] bg-[#fce3e0]" />,
});

const BuildSurpriseSection = dynamic(() => import("@/components/BuildSurpriseSection"), {
  ssr: false,
  loading: () => <div className="min-h-[700px] bg-[#fce3e0]" />,
});

const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  loading: () => <div className="min-h-[450px] bg-[#fce3e0]" />,
});

const GallerySection = dynamic(() => import("@/components/GallerySection"), {
  ssr: false,
  loading: () => <div className="min-h-[650px] bg-[#fce3e0]" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[300px] bg-[#fff8f9]" />,
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fce3e0] selection:bg-rose selection:text-white">
      {/* 0. Navbar with matching soft pastel pinkish palette */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip bg-[#fce3e0]">
        {/* 1. Hero Banner */}
        <Hero />

        {/* 2 & 3. Featured Bestsellers & Featured Products (Loaded immediately for instant display & click responsiveness) */}
        <div className="relative overflow-hidden bg-[#fce3e0]">
          {/* Subtle perimeter corner gift ties */}
          <GildedRibbonStream />

          {/* 2. Featured Packages / Bestsellers */}
          <FeaturedPackagesSection />

          {/* 3. Featured Products Catalog */}
          <FeaturedProductsSection />
        </div>

        {/* Ribbon & Bow Divider: Featured Products → Gifts By Sentiments */}
        <RibbonSectionDivider
          variant="rose-satin"
          direction="down-right"
          bowPosition="right"
          bowSize={150}
        />

        {/* 4. Gifts By Sentiments (Progressively loaded) */}
        <LazySection id="sentiments" minHeight="420px" rootMargin="500px">
          <SentimentsSection />
        </LazySection>

        {/* Ribbon & Bow Divider: Gifts By Sentiments → Gifts Of The Month */}
        <RibbonSectionDivider
          variant="rose-satin"
          direction="down-left"
          bowPosition="left"
          bowSize={150}
        />

        {/* 5. Gifts Of The Month */}
        <LazySection id="gifts-of-the-month" minHeight="480px" rootMargin="500px">
          <GiftsOfTheMonth />
        </LazySection>

        {/* Ribbon & Bow Divider: Gifts Of The Month → How to Build Your Surprise */}
        <RibbonSectionDivider
          variant="gold-champagne"
          direction="down-right"
          bowPosition="center"
          bowSize={150}
        />

        {/* 6. How to Build Your Surprise (Interactive Hamper Studio - Triggers anticipatory Gallery media caching) */}
        <LazySection
          id="build-surprise"
          minHeight="700px"
          rootMargin="600px"
          onVisible={preloadGalleryMedia}
        >
          <BuildSurpriseSection />
        </LazySection>

        {/* Ribbon & Bow Divider: Custom Hamper → Testimonials */}
        <RibbonSectionDivider
          variant="gold-champagne"
          direction="down-right"
          bowPosition="right"
          bowSize={150}
        />

        {/* 7. Testimonials & Social Proof (Also preloads Gallery media in advance) */}
        <LazySection
          id="testimonials"
          minHeight="450px"
          rootMargin="500px"
          onVisible={preloadGalleryMedia}
        >
          <TestimonialsSection />
        </LazySection>

        {/* Ribbon & Bow Divider: Testimonials → Gallery */}
        <RibbonSectionDivider
          variant="blush-silk"
          direction="down-left"
          bowPosition="center"
          bowSize={150}
        />

        {/* 8. Instagram / Recent Creations Gallery (Media & videos pre-warmed before arrival) */}
        <LazySection id="gallery" minHeight="650px" rootMargin="600px">
          <GallerySection />
        </LazySection>

        {/* Ribbon & Bow Divider: Gallery → Footer */}
        <RibbonSectionDivider
          variant="rose-satin"
          direction="down-right"
          bowPosition="right"
          bowSize={150}
        />
      </main>

      {/* 9. Final CTA & Rich Boutique Footer */}
      <LazySection minHeight="300px" rootMargin="300px">
        <Footer />
      </LazySection>
    </div>
  );
}
