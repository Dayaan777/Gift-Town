"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Star,
  MessageCircle,
  Eye,
  Heart,
  ArrowRight,
  Filter,
} from "lucide-react";
import StickerBadge from "@/components/StickerBadge";
import { supabase } from "@/lib/supabase";

export interface CatalogProduct {
  id: string;
  name: string;
  categoryTag: string;
  category: "all" | "bouquets" | "hampers" | "boxes" | "chocolates";
  badge?: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewsCount: number;
  highlight: string;
  image: string;
  whatsappMessage: string;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

const DEFAULT_PRODUCTS: CatalogProduct[] = [
  {
    id: "cat-1",
    name: "Heart-Shaped Money & Lights Bouquet",
    categoryTag: "Currency & Floral Bouquet",
    category: "bouquets",
    badge: "Most Loved",
    price: "6,500",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 58,
    highlight: "100+ artfully folded currency cones with warm micro fairy lights and fresh white roses.",
    image: "/images/products/heart-money-lights-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Heart-Shaped Money & Lights Bouquet'.",
  },
  {
    id: "cat-2",
    name: "Candy Pillow Box & Treats Favor",
    categoryTag: "Boutique Treat Box",
    category: "boxes",
    badge: "Trending",
    price: "3,800",
    originalPrice: "4,500",
    rating: 4.9,
    reviewsCount: 42,
    highlight: "Clear acetate candy pillow box with flared ribbon wings, Ferrero Rocher & movie snacks.",
    image: "/images/products/candy-pillow-treats.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Candy Pillow Box & Treats Favor'.",
  },
  {
    id: "cat-3",
    name: "Snack & Love Apology Bouquet",
    categoryTag: "Snack & Floral Bouquet",
    category: "bouquets",
    badge: "Bestseller",
    price: "5,200",
    originalPrice: "6,000",
    rating: 5.0,
    reviewsCount: 64,
    highlight: "Deluxe black wrapper with handwritten love notes, assorted chocolates and collectible toys.",
    image: "/images/products/snack-love-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Snack & Love Apology Bouquet'.",
  },
  {
    id: "cat-4",
    name: "Grand Gourmet Chocolate Wicker Basket",
    categoryTag: "Luxury Chocolate Basket",
    category: "hampers",
    badge: "Signature Craft",
    price: "6,800",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 51,
    highlight: "Handwoven white wicker basket brimming with Cadbury Wholenut, Galaxy, Mars, Twix & KitKat.",
    image: "/images/products/gourmet-chocolate-basket.png",
    whatsappMessage: "Hi Gift Town! I want to book the 'Grand Gourmet Chocolate Wicker Basket'.",
  },
  {
    id: "cat-5",
    name: "Grand Birthday Celebration Hamper",
    categoryTag: "Celebration Hamper",
    category: "hampers",
    badge: "Festive Favorite",
    price: "5,800",
    originalPrice: "6,600",
    rating: 5.0,
    reviewsCount: 47,
    highlight: "Celebration mini cake with pearl frosting, plush teddy bear mascot and wrapped fresh rose bouquet.",
    image: "/images/products/grand-birthday-hamper.png",
    whatsappMessage: "Hi Gift Town! I want to book the 'Grand Birthday Celebration Hamper'.",
  },
  {
    id: "cat-6",
    name: "Red Rose Heart Pedestal Box",
    categoryTag: "Floral Keepsake Box",
    category: "boxes",
    badge: "Romantic",
    price: "5,500",
    originalPrice: "6,200",
    rating: 5.0,
    reviewsCount: 39,
    highlight: "Velvet heart box packed with fragrant red roses, golden Ferrero Rocher & satin bows.",
    image: "/images/card-heart-box.jpg",
    whatsappMessage: "Hi Gift Town! I want to order the 'Red Rose Heart Pedestal Box'.",
  },
  {
    id: "cat-7",
    name: "Artisan Chocolate Treats Casket",
    categoryTag: "Confectionery Hamper",
    category: "chocolates",
    badge: "Imported Treats",
    price: "4,600",
    originalPrice: "5,400",
    rating: 4.9,
    reviewsCount: 33,
    highlight: "Deluxe confectionery tray loaded with Dairy Milk Silk, Snickers, Galaxy & KitKat Chunky bars.",
    image: "/images/card-hamper.jpg",
    whatsappMessage: "Hi Gift Town! I want to order the 'Artisan Chocolate Treats Casket'.",
  },
  {
    id: "cat-8",
    name: "Signature Fresh Floral Cascade",
    categoryTag: "Hand-Tied Bouquet",
    category: "bouquets",
    badge: "Fresh Blooms",
    price: "4,200",
    originalPrice: "4,900",
    rating: 5.0,
    reviewsCount: 45,
    highlight: "Handcrafted imported wrapping with seasonal baby's breath, pastel roses and calligraphy note.",
    image: "/images/card-bouquet.jpg",
    whatsappMessage: "Hi Gift Town! I want to order the 'Signature Fresh Floral Cascade'.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "bouquets", label: "Bouquets" },
  { id: "hampers", label: "Hampers" },
  { id: "boxes", label: "Gift Boxes" },
  { id: "chocolates", label: "Chocolates" },
];

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<CatalogProduct | null>(null);

  // Load from Supabase with instant realtime updates
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("featured_products")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: CatalogProduct[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            categoryTag: d.category_tag || "Boutique Gift",
            category: d.category || "bouquets",
            badge: d.badge || undefined,
            price: d.price,
            originalPrice: d.original_price || undefined,
            rating: Number(d.rating) || 5.0,
            reviewsCount: Number(d.reviews_count) || 45,
            highlight: d.highlight || "",
            image: d.image,
            whatsappMessage:
              d.whatsapp_message ||
              `Hi Gift Town! I want to order the '${d.name}'.`,
            image_scale: Number(d.image_scale) || 100,
            image_position: d.image_position || "center",
            image_offset_y: Number(d.image_offset_y) || 0,
            image_offset_x: Number(d.image_offset_x) || 0,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Using fallback featured products:", err);
      }
    }

    fetchProducts();

    // Instant Realtime Subscription
    const channel = supabase
      .channel("realtime-featured-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "featured_products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="featured-products"
      className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 bg-[#fce3e0] z-10"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        {/* ── Section Header (Exact same typography, font, and color styling as FEATUREDBESTSELLERS) ── */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center mb-4">
            <StickerBadge variant="rose" rotate="-2" size="sm">
              <Sparkles className="w-3.5 h-3.5 fill-[#d46f83] text-[#d46f83]" />
              <span>Complete Boutique Collection</span>
            </StickerBadge>
          </div>

          <h2 className="font-display font-black text-[clamp(44px,5.8vw,88px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            <span className="block">FEATURED</span>
            <span className="block">PRODUCTS</span>
          </h2>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Browse our full repertoire of artisanal bouquets, curated hampers, and celebration gift boxes designed to spark unforgettable moments.
          </p>

          {/* ── Category Filter Pills ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-rose text-white shadow-md scale-105"
                      : "bg-white/80 hover:bg-white text-maroon/70 hover:text-rose border border-rose/15 hover:shadow-xs"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product Grid (Responsive: 1-col mobile, 2-col tablet, 4-col desktop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => {
            const isLiked = !!likedMap[product.id];

            return (
              <div
                key={product.id}
                className="group relative rounded-[28px] bg-white border border-rose/15 shadow-[0_10px_28px_rgba(107,21,53,0.06)] hover:shadow-[0_18px_42px_rgba(107,21,53,0.12)] hover:border-rose/30 transition-all duration-400 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Image Showcase */}
                <div className="relative w-full h-56 sm:h-64 p-4 bg-gradient-to-b from-[#fef8f9] via-[#fdf4f6] to-[#faedf0] overflow-hidden flex items-center justify-center">
                  {/* Badge & Heart Button */}
                  <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                    {product.badge ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-maroon border border-rose/15 shadow-2xs">
                        {product.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      onClick={() => toggleLike(product.id)}
                      className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-rose/15 flex items-center justify-center text-maroon/60 hover:text-rose hover:bg-white shadow-2xs transition-all active:scale-90 cursor-pointer"
                      aria-label="Save to favorites"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isLiked ? "fill-rose text-rose" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <div
                      className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-106 group-hover:-translate-y-1"
                      style={{
                        transform: `scale(${(product.image_scale ?? 100) / 100}) translate3d(${product.image_offset_x ?? 0}px, ${product.image_offset_y ?? 0}px, 0)`,
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain drop-shadow-md"
                        style={{
                          objectPosition: product.image_position || "center",
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Inspect Button on Hover */}
                  <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none z-20">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(product)}
                      className="pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-maroon/90 hover:bg-maroon text-[#FFF4D0] text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-md active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Details Card */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Rating & Tag */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[10px] uppercase tracking-wider text-rose">
                        {product.categoryTag}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif font-bold text-base text-maroon group-hover:text-rose transition-colors duration-200 line-clamp-1 mb-1.5">
                      {product.name}
                    </h3>

                    {/* Highlight Description */}
                    <p className="font-body text-xs text-maroon/70 leading-relaxed line-clamp-2 mb-3">
                      {product.highlight}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-2 pt-3 border-t border-rose/15 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[9px] uppercase font-bold tracking-widest text-maroon/50">
                        Price
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-black text-base sm:text-lg text-maroon">
                          PKR {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-maroon/40 line-through">
                            PKR {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(product.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white px-3.5 py-2 rounded-full font-body font-bold text-[11px] uppercase tracking-wider shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Inspect Modal ── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-maroon/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-rose/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-rose/15">
              <span className="text-xs font-bold uppercase tracking-wider text-rose">
                {previewItem.categoryTag}
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-rose/10 hover:bg-rose/20 text-maroon flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-64 sm:h-72 my-4 bg-gradient-to-b from-[#fef8f9] to-[#faedf0] rounded-2xl flex items-center justify-center p-4 overflow-hidden">
              <div
                className="relative w-full h-full"
                style={{
                  transform: `scale(${(previewItem.image_scale ?? 100) / 100}) translate3d(${previewItem.image_offset_x ?? 0}px, ${previewItem.image_offset_y ?? 0}px, 0)`,
                }}
              >
                <Image
                  src={previewItem.image}
                  alt={previewItem.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  style={{
                    objectPosition: previewItem.image_position || "center",
                  }}
                />
              </div>
            </div>

            <h3 className="font-serif font-black text-xl text-maroon mb-2">
              {previewItem.name}
            </h3>
            <p className="font-body text-xs sm:text-sm text-maroon/80 leading-relaxed mb-5">
              {previewItem.highlight}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-rose/15">
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-maroon/50">
                  Total Price
                </span>
                <span className="font-display font-black text-xl text-maroon">
                  PKR {previewItem.price}
                </span>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(previewItem.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose to-[#d43751] text-white px-6 py-2.5 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat to Order</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
