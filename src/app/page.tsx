import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import GiftsOfTheMonth from "@/components/home/GiftsOfTheMonth";
import SentimentsSection from "@/components/SentimentsSection";
import GildedRibbonStream from "@/components/GildedRibbonStream";
import FeaturedPackagesSection from "@/components/FeaturedPackagesSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import BuildSurpriseSection from "@/components/BuildSurpriseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import RibbonSectionDivider from "@/components/RibbonSectionDivider";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fce3e0] selection:bg-rose selection:text-white">
      {/* Navbar with matching soft pastel pinkish palette */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip bg-[#fce3e0]">
        {/* 1. Hero */}
        <Hero />

        {/* 2 & 3. Featured Bestsellers & Featured Products */}
        <div className="relative overflow-hidden bg-[#fce3e0]">
          {/* Subtle perimeter corner gift ties */}
          <GildedRibbonStream />

          {/* 2. Featured Packages / Bestsellers (Directly below Hero) */}
          <FeaturedPackagesSection />

          {/* 3. Featured Products Catalog (Directly below Featured Bestsellers) */}
          <FeaturedProductsSection />
        </div>

        {/* Ribbon & Bow Divider: Featured Products → Gifts By Sentiments */}
        <RibbonSectionDivider
          variant="rose-satin"
          direction="down-right"
          bowPosition="right"
          bowSize={150}
        />

        {/* 4. Gifts By Sentiments */}
        <SentimentsSection />

        {/* Ribbon & Bow Divider: Gifts By Sentiments → Gifts Of The Month */}
        <RibbonSectionDivider
          variant="rose-satin"
          direction="down-left"
          bowPosition="left"
          bowSize={150}
        />

        {/* 5. Gifts Of The Month (Below Gifts By Sentiments) */}
        <GiftsOfTheMonth />

        {/* Ribbon & Bow Divider: Gifts Of The Month → How to Build Your Surprise */}
        <RibbonSectionDivider
          variant="gold-champagne"
          direction="down-right"
          bowPosition="center"
          bowSize={150}
        />

        {/* 6. How to Build Your Surprise */}
        <BuildSurpriseSection />

        {/* Ribbon & Bow Divider: Custom Hamper → Testimonials (Downward swoop toward right with bow) */}
        <RibbonSectionDivider
          variant="gold-champagne"
          direction="down-right"
          bowPosition="right"
          bowSize={150}
        />

        {/* 6. Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* Ribbon & Bow Divider: Testimonials → Gallery (Center-sloped bow) */}
        <RibbonSectionDivider
          variant="blush-silk"
          direction="down-left"
          bowPosition="center"
          bowSize={150}
        />

        {/* 7. Instagram / Recent Creations Gallery */}
        <GallerySection />

        {/* Ribbon & Bow Divider: Gallery → Footer (Downward swoop toward right with bow) */}
        <RibbonSectionDivider
          variant="rose-satin"
          direction="down-right"
          bowPosition="right"
          bowSize={150}
        />
      </main>

      {/* 8. Final CTA & Rich Boutique Footer */}
      <Footer />
    </div>
  );
}
