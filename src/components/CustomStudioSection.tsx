"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Sparkles,
  Search,
  Check,
  Plus,
  Eye,
  MessageCircle,
  ArrowRight,
  Gift,
  ShoppingBag,
  RotateCcw,
  Cake,
  Heart,
  Package,
} from "lucide-react";
import StickerBadge from "@/components/StickerBadge";
import { supabase } from "@/lib/supabase";

export interface CustomStudioItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "bouquets" | "cakes" | "chocolates" | "baskets" | "apparel" | "balloons";
  packageSource?: string;
}

// 24 Real authentic ceremonial and birthday items from all 4 packages
export const DEFAULT_STUDIO_ITEMS: CustomStudioItem[] = [
  // ── Bouquets & Flowers ──
  {
    id: "item-1",
    name: "Artificial Pink Flowers Bouquet",
    price: 3500,
    category: "bouquets",
    packageSource: "The Engagement Suite",
    description: "Artfully arranged artificial pink rose blooms with satin ribbon wrap and delicate pearl accents.",
    image: "/images/packages/engagement-baat-pakki/item-1-pink-rose-bouquet.webp",
  },
  {
    id: "item-hd-1",
    name: "Pipe Cleaner Lily Flowers Bouquet",
    price: 3500,
    category: "bouquets",
    packageSource: "Birthday for Husband & Dad",
    description: "Artisanal red and white lily blooms handcrafted with soft pipe cleaners, pearls, frosted newspaper-print wrap, and red satin bow.",
    image: "/images/packages/birthday-husband-dad/husband-dad-3.jpeg",
  },
  {
    id: "item-bsf-1",
    name: "Loaded Confectionery Candy Bouquet",
    price: 3200,
    category: "bouquets",
    packageSource: "Midnight Surprise for BSF",
    description: "Artfully assembled giant candy bouquet packed with Lays 2x, Cocomo 2x, Marshmallows 2x, Smile Donuts 2x, Knorr Chatpatta 3x, Yums, Dairy Milk 2x, and Chilli Milli 5x with satin bow.",
    image: "/images/packages/midnight-bsf/midnight-bsf-candy-bouquet.webp",
  },
  {
    id: "item-bsf-3",
    name: "Fresh Pink Roses Floral Bouquet",
    price: 2400,
    category: "bouquets",
    packageSource: "Midnight Surprise for BSF",
    description: "Lush bouquet of freshly plucked deep pink celebration roses enveloped in frosted white luxury florist paper and calligraphy ribbon.",
    image: "/images/packages/midnight-bsf/midnight-bsf-roses-bouquet.webp",
  },

  // ── Cakes & Confectionery ──
  {
    id: "item-2",
    name: "2-Pound Chocolate Cake in Decorated PVP Box",
    price: 4500,
    category: "cakes",
    packageSource: "The Engagement Suite",
    description: "Fresh 2-pound gourmet chocolate cake presented in an illuminated transparent PVP display box with floral topper.",
    image: "/images/packages/engagement-baat-pakki/item-2-chocolate-cake-pvp.webp",
  },
  {
    id: "item-fh-1",
    name: "1-Pound Rehmat-e-Shereen Cake in Decorated PVP Box",
    price: 4200,
    category: "cakes",
    packageSource: "Birthday for Him",
    description: "Rich 1-pound chocolate fudge cake from Rehmat-e-Shereen presented in an illuminated transparent PVP box with fairy lights and gold Happy Birthday topper.",
    image: "/images/packages/birthday-for-him/birthday-him-cover.webp",
  },
  {
    id: "item-bsf-2",
    name: "2-Pound Red Velvet Customized Calendar Cake",
    price: 3800,
    category: "cakes",
    packageSource: "Midnight Surprise for BSF",
    description: "Fresh gourmet 2-pound red velvet cake adorned with calendar birthday date marker, gold spherical pearls, and an acrylic Happy Birthday topper.",
    image: "/images/packages/midnight-bsf/midnight-bsf-calendar-cake.webp",
  },

  // ── Chocolates & Dry Fruits ──
  {
    id: "item-3",
    name: "Royal Dry Fruits Wooden Basket",
    price: 9500,
    category: "chocolates",
    packageSource: "The Engagement Suite",
    description: "6-compartment wooden platter filled with almonds, walnuts, cashews, pistachios, roasted chickpeas, and 8x Dairy Milk Bubbly with gold Baat Pakki tag.",
    image: "/images/packages/engagement-baat-pakki/baat-pakki-6.jpeg",
  },
  {
    id: "item-5",
    name: "Choco-Floral Heart Shape Keepsake Box",
    price: 5000,
    category: "chocolates",
    packageSource: "The Engagement Suite",
    description: "Heart box filled with Ferrero Rocher golden chocolates and white scented roses with calligraphy ribbon.",
    image: "/images/packages/engagement-baat-pakki/item-5-choco-floral-heart.webp",
  },
  {
    id: "item-10",
    name: "Grand Loaded Snack Basket with Imported Flowers",
    price: 5500,
    category: "chocolates",
    packageSource: "The Engagement Suite",
    description: "Lavish celebration snack basket with Lays 4x, Noms nachos 2x, Pop Nosh popcorn, Cocomo 2x, Kurkure, wafers, Frisky, Heaven biscuits, Nestle cold coffee, Fabulous biscuits, Dairy Milk, Nestle juices, Pepsi, Danisa butter cookies & floral accents.",
    image: "/images/packages/engagement-baat-pakki/item-10-loaded-snack-basket.webp",
  },

  // ── Baskets & Trays ──
  {
    id: "item-4",
    name: "1kg Mithai Wooden Tray with Baat Pakki Tag",
    price: 5500,
    category: "baskets",
    packageSource: "The Engagement Suite",
    description: "1kg artisan assorted celebration mithai arranged in a handcrafted wooden tray with bespoke gold Baat Pakki Urdu acrylic tag.",
    image: "/images/packages/engagement-baat-pakki/baat-pakki-8.jpeg",
  },
  {
    id: "item-6",
    name: "Small Wooden Basket with Baat Pakki Dupatta",
    price: 4000,
    category: "baskets",
    packageSource: "The Engagement Suite",
    description: "Bespoke wooden basket carrying the ceremonial crimson embroidered Baat Pakki dupatta with gold trim.",
    image: "/images/packages/engagement-baat-pakki/baat-pakki-dupatta-basket.webp",
  },
  {
    id: "item-7",
    name: "Medium Decorated Wooden Basket (Saya Dresses & Gajras)",
    price: 12500,
    category: "baskets",
    packageSource: "The Engagement Suite",
    description: "Decorated wooden trousseau basket with 2 unstitched Saya designer dresses, luxury handbag, and artificial ribbon gajra pairs.",
    image: "/images/packages/engagement-baat-pakki/saya-dresses-gajras-basket.webp",
  },
  {
    id: "item-8",
    name: "Medium Decorated Wooden Basket (Branded Dress, Watch & J. Perfume)",
    price: 14500,
    category: "baskets",
    packageSource: "The Engagement Suite",
    description: "Luxury wooden basket with an unstitched branded designer dress, elegant wristwatch, purse, and authentic J. (Junaid Jamshed) Perfume.",
    image: "/images/packages/engagement-baat-pakki/item-8-dress-watch-perfume.webp",
  },
  {
    id: "item-9",
    name: "Large Wooden Decorated Basket (Embroidered Shawl & Heels)",
    price: 10500,
    category: "baskets",
    packageSource: "The Engagement Suite",
    description: "Large ceremonial wooden basket with black heavy gold-embroidered velvet shawl, designer heels, and bridal watch set.",
    image: "/images/packages/engagement-baat-pakki/item-9-embroidered-shawl-heels.webp",
  },
  {
    id: "item-hd-2",
    name: "Decorated Wooden Basket (2 Branded Shirts & Trousers)",
    price: 8500,
    category: "baskets",
    packageSource: "Birthday for Husband & Dad",
    description: "Handcrafted decorated wooden trousseau basket carrying 2 premium branded shirts and stylish trousers with fairy lights and ribbon trim.",
    image: "/images/packages/birthday-husband-dad/husband-dad-shirts-basket.webp",
  },

  // ── Apparel, Watches & Perfumes ──
  {
    id: "item-hd-3",
    name: "Luofu Comfort Slippers & Grooming Set",
    price: 5500,
    category: "apparel",
    packageSource: "Birthday for Husband & Dad",
    description: "Authentic Luofu comfort slippers paired with revitalizing face wash, J. (Junaid Jamshed) Zarar body spray, and fragrance spray.",
    image: "/images/packages/birthday-husband-dad/husband-dad-master.webp",
  },
  {
    id: "item-hd-4",
    name: "Maaz Safder Signature Perfume Bottle",
    price: 4500,
    category: "apparel",
    packageSource: "Birthday for Husband & Dad",
    description: "Authentic Maaz Safder luxury perfume bottle paired with an illuminated gold crystal crescent moon frame carrying 2 personalized photos.",
    image: "/images/packages/birthday-husband-dad/husband-dad-perfume-moon.webp",
  },
  {
    id: "item-fh-2",
    name: "Premium Designer Shirt in Decorated Box",
    price: 3800,
    category: "apparel",
    packageSource: "Birthday for Him",
    description: "Crisp designer dress shirt tied with crimson satin ribbon, displayed in a deluxe keepsake gift box with mini Happy Birthday banner bunting.",
    image: "/images/packages/birthday-for-him/birthday-him-accessories.webp",
  },
  {
    id: "item-fh-3",
    name: "Authentic ORSGA Men's Chronograph Wristwatch",
    price: 3800,
    category: "apparel",
    packageSource: "Birthday for Him",
    description: "Classic black leather-strap ORSGA men's timepiece with precision dial in its official luxury emerald presentation case with warranty card.",
    image: "/images/packages/birthday-for-him/birthday-him-accessories.webp",
  },
  {
    id: "item-fh-4",
    name: "Genuine Leather Bifold Wallet with Fairy Lights",
    price: 2200,
    category: "apparel",
    packageSource: "Birthday for Him",
    description: "Sleek black textured leather bifold wallet with button clasp presented in a gift case with warm micro fairy lights and custom birthday messages.",
    image: "/images/packages/birthday-for-him/birthday-him-accessories.webp",
  },
  {
    id: "item-bsf-4",
    name: "Pinterest Hobo Shoulder Bag from Pop Bags",
    price: 1500,
    category: "apparel",
    packageSource: "Midnight Surprise for BSF",
    description: "Chic glossy brown shoulder hobo bag from Pop Bags with round top handle and crossbody strap, presented in its brand dust bag.",
    image: "/images/packages/midnight-bsf/midnight-bsf-cover.webp",
  },

  // ── Balloons & Keepsakes ──
  {
    id: "item-hd-5",
    name: "Giant Illuminated Bobo Balloon & Wishes Cards",
    price: 1500,
    category: "balloons",
    packageSource: "Birthday for Husband & Dad",
    description: "Clear helium Bobo balloon filled with black and gold balloons, warm micro fairy lights, Best Dad Ever card, and 5 personalized birthday wish cards.",
    image: "/images/packages/birthday-husband-dad/husband-dad-bobo-balloon.webp",
  },
  {
    id: "item-bsf-5",
    name: "Pair of Illuminated Bobo Balloons with Fairy Lights",
    price: 899,
    category: "balloons",
    packageSource: "Midnight Surprise for BSF",
    description: "Two crystal-clear Bobo balloons entwined with glowing warm micro fairy lights on presentation sticks.",
    image: "/images/packages/midnight-bsf/midnight-bsf-cover.webp",
  },
];

export default function CustomStudioSection() {
  const [items, setItems] = useState<CustomStudioItem[]>(DEFAULT_STUDIO_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<CustomStudioItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all packages items from Supabase to keep prices & photos 100% synchronized
  useEffect(() => {
    async function loadStudioItems() {
      try {
        const { data, error } = await supabase.from("wedding_packages").select("*");
        if (!error && Array.isArray(data) && data.length > 0) {
          const gathered: CustomStudioItem[] = [];

          data.forEach((pkg) => {
            if (Array.isArray(pkg.items)) {
              pkg.items.forEach((it: any) => {
                // Determine category based on item properties or fallback
                let cat: CustomStudioItem["category"] = "baskets";
                const n = (it.name || "").toLowerCase();
                if (it.category) {
                  cat = it.category;
                } else if (n.includes("cake") || n.includes("confectionery")) {
                  cat = "cakes";
                } else if (n.includes("bouquet") || n.includes("flower") || n.includes("rose")) {
                  cat = "bouquets";
                } else if (n.includes("chocolate") || n.includes("fruit") || n.includes("snack") || n.includes("mithai")) {
                  cat = "chocolates";
                } else if (n.includes("balloon")) {
                  cat = "balloons";
                } else if (n.includes("shirt") || n.includes("dress") || n.includes("watch") || n.includes("wallet") || n.includes("perfume") || n.includes("slipper") || n.includes("bag")) {
                  cat = "apparel";
                }

                gathered.push({
                  id: it.id,
                  name: it.name,
                  price: Number(it.price) || 0,
                  description: it.description || "",
                  image: it.image || "/images/packages/engagement-baat-pakki/baat-pakki-4.jpeg",
                  category: cat,
                  packageSource: pkg.title,
                });
              });
            }
          });

          if (gathered.length > 0) {
            setItems(gathered);
          }
        }
      } catch (err) {
        console.error("Using default custom studio items:", err);
      }
    }

    loadStudioItems();
  }, []);

  // Lock body scroll on quick inspect modal
  useEffect(() => {
    if (previewItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [previewItem]);

  // Toggle selection
  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clearSelection = () => {
    setSelectedItemIds({});
  };

  // Selected items calculation
  const selectedItems = useMemo(() => {
    return items.filter((it) => selectedItemIds[it.id]);
  }, [items, selectedItemIds]);

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((sum, it) => sum + it.price, 0);
  }, [selectedItems]);

  // WhatsApp order message with full itemized breakdown
  const whatsappMessage = useMemo(() => {
    if (selectedItems.length === 0) return "";
    return (
      `Hi Gift Town! I want to order a custom tailored hamper from your Custom Studio:\n\n` +
      `Selected Items (${selectedItems.length}):\n` +
      selectedItems
        .map((it, idx) => `${idx + 1}. ${it.name} - PKR ${it.price.toLocaleString()}`)
        .join("\n") +
      `\n\nTotal Custom Amount: PKR ${totalAmount.toLocaleString()}.\nPlease confirm availability and delivery details!`
    );
  }, [selectedItems, totalAmount]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items
      .filter((it) => {
        if (selectedCategory === "all") return true;
        return it.category === selectedCategory;
      })
      .filter((it) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          it.name.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          (it.packageSource && it.packageSource.toLowerCase().includes(q))
        );
      });
  }, [items, selectedCategory, searchQuery]);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "bouquets", label: "Bouquets" },
    { id: "cakes", label: "Cakes" },
    { id: "chocolates", label: "Chocolates & Treats" },
    { id: "baskets", label: "Baskets & Trays" },
    { id: "apparel", label: "Apparel & Perfumes" },
    { id: "balloons", label: "Balloons" },
  ];

  return (
    <div className="relative pb-24 sm:pb-32">
      {/* ── Filters & Search Control Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-maroon/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bouquets, cakes, dresses, chocolates, balloons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/95 backdrop-blur-md border border-rose/25 text-maroon font-medium text-xs sm:text-sm placeholder:text-maroon/40 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 shadow-sm"
            />
          </div>

          {/* Quick Clear Selection if items are selected */}
          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/70 bg-white hover:bg-neutral-100 border border-rose/20 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose" />
              <span>Reset Selection</span>
            </button>
          )}
        </div>

        {/* Category Pills Ribbon */}
        <div className="mt-5 flex items-center justify-center gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-rose text-white shadow-md scale-105"
                  : "bg-white/85 text-maroon/75 hover:bg-white hover:text-maroon border border-rose/15"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="mt-3 text-center text-xs font-semibold text-maroon/60">
          Showing {filteredItems.length} customizable items
        </div>
      </div>

      {/* ── Product Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item) => {
            const isSelected = !!selectedItemIds[item.id];

            return (
              <div
                key={item.id}
                className={`relative rounded-[28px] bg-white border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-rose shadow-[0_12px_30px_rgba(226,64,92,0.16)] ring-2 ring-rose/30"
                    : "border-rose/15 shadow-sm hover:shadow-md hover:border-rose/30"
                }`}
              >
                <div>
                  {/* Photo with Click to Inspect */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="relative w-full aspect-[4/3] bg-[#f8e6e8] cursor-pointer group overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                    {/* Top Package Source Tag */}
                    {item.packageSource && (
                      <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-maroon border border-white/60 shadow-xs">
                          {item.packageSource.replace("Package", "").replace("Suite", "")}
                        </span>
                      </div>
                    )}

                    {/* Quick Inspect Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                      title="Inspect piece details"
                    >
                      <Eye className="w-4 h-4 text-maroon" />
                    </button>

                    {/* Price floating on image */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="font-display font-black text-lg text-white drop-shadow-md">
                        PKR {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <h4 className="font-serif font-bold text-base text-maroon leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="font-body text-xs text-maroon/70 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Add to Custom Box Toggle Button */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`w-full py-3 px-4 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-rose text-white shadow-md hover:bg-[#d43751]"
                        : "bg-[#fdf0f2] hover:bg-[#fcdde1] text-maroon border border-rose/25"
                    }`}
                  >
                    {isSelected ? (
                      <span>Added to Selection</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>+ Add to Custom Box</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STICKY BOTTOM CUSTOM SELECTION BAR ── */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 max-w-3xl mx-auto animate-in slide-in-from-bottom-3 duration-300">
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-rose/30 shadow-[0_16px_40px_rgba(107,21,53,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose/10 text-rose">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{selectedItems.length} custom items selected</span>
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs uppercase font-bold text-maroon/50 tracking-wider">
                  Total:
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-maroon">
                  PKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-body font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Custom Selection ({selectedItems.length})</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── QUICK INSPECT MODAL ── */}
      {mounted && previewItem && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 pt-2 pb-8 sm:p-5 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-md md:max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl border border-rose/25 max-h-[86vh] sm:max-h-[88vh] -translate-y-2 sm:translate-y-0 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose/15 flex-shrink-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose">
                {previewItem.packageSource || "Custom Studio Item"}
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-rose/10 hover:bg-rose/20 text-maroon flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 pr-1.5 -mr-1.5 my-3 space-y-4 overscroll-contain">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#f8e6e8] border border-rose/15 flex-shrink-0">
                <Image
                  src={previewItem.image}
                  alt={previewItem.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              <div>
                <h3 className="font-serif font-black text-xl text-maroon mb-1">
                  {previewItem.name}
                </h3>
                <span className="font-display font-black text-2xl text-maroon">
                  PKR {previewItem.price.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#fdf5f6] p-4 rounded-2xl border border-rose/15">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-maroon block mb-2">
                  Piece Details &amp; Inclusions:
                </span>
                <p className="font-body text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {previewItem.description}
                </p>
              </div>
            </div>

            {/* Footer with Select toggle */}
            <div className="pt-3 border-t border-rose/15 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  toggleItem(previewItem.id);
                  setPreviewItem(null);
                }}
                className={`flex-1 py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedItemIds[previewItem.id]
                    ? "bg-rose text-white shadow-md hover:bg-[#d43751]"
                    : "bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {selectedItemIds[previewItem.id] ? (
                  <span>Added to Selection</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add to Custom Box</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
