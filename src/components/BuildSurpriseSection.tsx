"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  Info,
  Cake,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FlyingItem {
  id: string;
  itemId: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  targetScale: number;
  targetRotate: string;
}

interface SparkleParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
}

// ── Baskets Definition ─────────────────────────────────────────────
interface BasketOption {
  id: string;
  name: string;
  subtitle: string;
  basePrice: number;
  image: string;
  rimImage: string;
  tag: string;
  categoryType: "treats" | "cake";
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

const BASKETS: BasketOption[] = [
  {
    id: "wicker-handle",
    name: "Classic Wicker With Handle",
    subtitle: "Artisanal hand-woven with high arch handle",
    basePrice: 1500,
    image: "/images/hamper-studio/baskets/basket-wicker-handle.png",
    rimImage: "/images/hamper-studio/baskets/basket-wicker-handle-rim.png",
    tag: "Most Popular",
    categoryType: "treats",
  },
  {
    id: "oval-trough",
    name: "Deep Oval Gourmet Basket",
    subtitle: "Spacious luxury tray for grand celebrations",
    basePrice: 1800,
    image: "/images/hamper-studio/baskets/basket-oval-trough.png",
    rimImage: "/images/hamper-studio/baskets/basket-oval-trough-rim.png",
    tag: "Grand Size",
    categoryType: "treats",
  },
  {
    id: "heritage-round",
    name: "Heritage Round Hamper",
    subtitle: "Custom designed exclusively for celebration cakes",
    basePrice: 1400,
    image: "/images/hamper-studio/baskets/basket-heritage-round.png",
    rimImage: "/images/hamper-studio/baskets/basket-heritage-round-rim.png",
    tag: "Cake Hamper",
    categoryType: "cake",
  },
];

// ── Treats / Confectionery Options ─────────────────────────────────
interface TreatItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  emoji: string;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
  // Per-basket coordinate slots so each basket fits treats perfectly!
  slots: {
    "wicker-handle": {
      left: string;
      top: string;
      rotate: string;
      scale: number;
      zIndex: number;
    };
    "oval-trough": {
      left: string;
      top: string;
      rotate: string;
      scale: number;
      zIndex: number;
    };
  };
}

const TREATS: TreatItem[] = [
  // ── BACK ROW (Image 1 reference) ──
  {
    id: "snickers-bar",
    name: "Snickers Chocolate Bar",
    category: "Chocolates",
    price: 380,
    image: "/images/hamper-studio/items/item-snickers.png",
    emoji: "🍫",
    slots: {
      "wicker-handle": {
        left: "35.0%",
        top: "43.0%",
        rotate: "-8deg",
        scale: 0.94,
        zIndex: 11, // back row left
      },
      "oval-trough": {
        left: "33%",
        top: "45%",
        rotate: "-8deg",
        scale: 0.88,
        zIndex: 11,
      },
    },
  },
  {
    id: "dairy-milk-tall",
    name: "Cadbury Dairy Milk",
    category: "Chocolates",
    price: 450,
    image: "/images/hamper-studio/items/item-dairy-milk-tall.png",
    emoji: "🍫",
    slots: {
      "wicker-handle": {
        left: "50.0%",
        top: "40.0%",
        rotate: "0deg",
        scale: 0.98,
        zIndex: 12, // back row center (stands proud)
      },
      "oval-trough": {
        left: "48%",
        top: "43%",
        rotate: "0deg",
        scale: 0.92,
        zIndex: 12,
      },
    },
  },
  {
    id: "kitkat-chunky",
    name: "KitKat Chunky Wafer",
    category: "Chocolates",
    price: 350,
    image: "/images/hamper-studio/items/item-kitkat-chunky.png",
    emoji: "🍫",
    slots: {
      "wicker-handle": {
        left: "65.0%",
        top: "43.0%",
        rotate: "8deg",
        scale: 0.94,
        zIndex: 11, // back row right
      },
      "oval-trough": {
        left: "63%",
        top: "45%",
        rotate: "8deg",
        scale: 0.88,
        zIndex: 11,
      },
    },
  },

  // ── FRONT ROW (Image 2 reference) ──
  {
    id: "lays-hangout",
    name: "Lay's Masala (Hangout Pack)",
    category: "Chips & Snacks",
    price: 250,
    image: "/images/hamper-studio/items/item-lays-hangout.png",
    emoji: "🥔",
    slots: {
      "wicker-handle": {
        left: "33.5%",
        top: "47.0%",
        rotate: "-7deg",
        scale: 0.90,
        zIndex: 14, // front row left
      },
      "oval-trough": {
        left: "30%",
        top: "48%",
        rotate: "-6deg",
        scale: 0.80,
        zIndex: 14,
      },
    },
  },
  {
    id: "lays-party",
    name: "Lay's Masala (Party Pack)",
    category: "Chips & Snacks",
    price: 350,
    image: "/images/hamper-studio/items/item-lays-party.png",
    emoji: "🥔",
    slots: {
      "wicker-handle": {
        left: "50.0%",
        top: "47.5%",
        rotate: "0deg",
        scale: 0.92,
        zIndex: 15, // front row center
      },
      "oval-trough": {
        left: "50%",
        top: "49%",
        rotate: "0deg",
        scale: 0.82,
        zIndex: 15,
      },
    },
  },
  {
    id: "dairy-milk-square",
    name: "Cadbury Dairy Milk Treat",
    category: "Chocolates",
    price: 300,
    image: "/images/hamper-studio/items/item-dairy-milk-square.png",
    emoji: "🍫",
    slots: {
      "wicker-handle": {
        left: "66.5%",
        top: "47.0%",
        rotate: "7deg",
        scale: 0.90,
        zIndex: 14, // front row right
      },
      "oval-trough": {
        left: "68%",
        top: "48%",
        rotate: "6deg",
        scale: 0.80,
        zIndex: 14,
      },
    },
  },
];

export default function BuildSurpriseSection() {
  const [baskets, setBaskets] = useState<BasketOption[]>(BASKETS);
  const [treats, setTreats] = useState<TreatItem[]>(TREATS);
  const [selectedBasketId, setSelectedBasketId] = useState<string>("wicker-handle");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "snickers-bar": 1,
    "dairy-milk-tall": 1,
    "kitkat-chunky": 1,
  });

  // Derived list of packed item IDs (items with quantity > 0)
  const packedItemIds = Object.keys(quantities).filter(
    (id) => (quantities[id] || 0) > 0
  );
  const totalPackedCount = Object.values(quantities).reduce(
    (acc, q) => acc + q,
    0
  );

  // Fly-to-basket animation state
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [basketBump, setBasketBump] = useState(false);

  // References to the basket stage container and shelf buttons
  const stageStackRef = useRef<HTMLDivElement>(null);
  const shelfButtonRefs = useRef<Record<string, HTMLElement | null>>({});

  // Sync baskets and treats dynamically with live Supabase database
  useEffect(() => {
    async function syncPrices() {
      try {
        const { data, error } = await supabase
          .from("hamper_items")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          // 1. Process Baskets (including any newly added bases)
          const dbBaskets = data.filter((d: any) => d.type === "basket");
          if (dbBaskets.length > 0) {
            const mergedBaskets: BasketOption[] = dbBaskets.map((dbB: any) => {
              const localPreset = BASKETS.find((b) => b.id === dbB.id);
              return {
                id: dbB.id,
                name: dbB.name,
                subtitle: dbB.subtitle || localPreset?.subtitle || "Handcrafted hamper base",
                basePrice: Number(dbB.price) || localPreset?.basePrice || 1500,
                image: dbB.image || localPreset?.image || "/images/hamper-studio/baskets/basket-wicker-handle.png",
                rimImage: localPreset?.rimImage || "/images/hamper-studio/baskets/basket-wicker-handle-rim.png",
                tag: dbB.tag || localPreset?.tag || "Custom Base",
                categoryType: (dbB.category_type as "treats" | "cake") || localPreset?.categoryType || "treats",
                image_scale: Number(dbB.image_scale) || 100,
                image_position: dbB.image_position || "center",
                image_offset_y: Number(dbB.image_offset_y) || 0,
                image_offset_x: Number(dbB.image_offset_x) || 0,
              };
            });
            setBaskets(mergedBaskets);
          }

          // 2. Process Treats / Confectionery (including any newly added treats)
          const dbTreats = data.filter((d: any) => d.type === "treat");
          if (dbTreats.length > 0) {
            const mergedTreats: TreatItem[] = dbTreats.map((dbT: any, idx: number) => {
              const localPreset = TREATS.find((t) => t.id === dbT.id);
              if (localPreset) {
                return {
                  ...localPreset,
                  name: dbT.name || localPreset.name,
                  price: Number(dbT.price) || localPreset.price,
                  image: dbT.image || localPreset.image,
                  image_scale: Number(dbT.image_scale) || 100,
                  image_position: dbT.image_position || "center",
                  image_offset_y: Number(dbT.image_offset_y) || 0,
                  image_offset_x: Number(dbT.image_offset_x) || 0,
                };
              }
              // Dynamically position newly added treats
              const defaultSlots = {
                "wicker-handle": {
                  left: `${35 + ((idx * 16) % 35)}%`,
                  top: `${48 + ((idx * 6) % 10)}%`,
                  rotate: `${(idx % 2 === 0 ? -6 : 6)}deg`,
                  scale: 0.82,
                  zIndex: 13,
                },
                "oval-trough": {
                  left: `${32 + ((idx * 16) % 40)}%`,
                  top: `${46 + ((idx * 6) % 8)}%`,
                  rotate: `${(idx % 2 === 0 ? -5 : 5)}deg`,
                  scale: 0.82,
                  zIndex: 13,
                },
              };
              return {
                id: dbT.id,
                name: dbT.name,
                category: dbT.category || "Chocolates",
                price: Number(dbT.price) || 300,
                image: dbT.image,
                emoji: "🎁",
                slots: defaultSlots,
                image_scale: Number(dbT.image_scale) || 100,
                image_position: dbT.image_position || "center",
                image_offset_y: Number(dbT.image_offset_y) || 0,
                image_offset_x: Number(dbT.image_offset_x) || 0,
              };
            });
            setTreats(mergedTreats);
          }
        }
      } catch (err) {
        console.error("Using local hamper items:", err);
      }
    }
    syncPrices();

    // Realtime subscription for Hamper items deferred slightly so interaction remains silky smooth
    let channel: any = null;
    const subTimer = setTimeout(() => {
      channel = supabase
        .channel("realtime-hamper-items")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "hamper_items" },
          () => {
            syncPrices();
          }
        )
        .subscribe();
    }, 1200);

    return () => {
      clearTimeout(subTimer);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const activeBasket =
    baskets.find((b) => b.id === selectedBasketId) || baskets[0];

  const isCakeBasket = activeBasket.categoryType === "cake";

  const triggerFlyToBasket = (treat: TreatItem, shelfBtn: HTMLElement) => {
    if (!stageStackRef.current) return;

    // 1. Get shelf button starting coordinates
    const startRect = shelfBtn.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    // 2. Get destination basket slot coordinates
    const stageRect = stageStackRef.current.getBoundingClientRect();
    const basketSlotKey =
      selectedBasketId === "oval-trough" ? "oval-trough" : "wicker-handle";
    const slot = treat.slots[basketSlotKey];

    const leftPercent = parseFloat(slot.left) / 100;
    const topPercent = parseFloat(slot.top) / 100;

    const endX = stageRect.left + stageRect.width * leftPercent;
    const endY = stageRect.top + stageRect.height * topPercent;

    const flyId = `${treat.id}-${Date.now()}`;
    const newFly: FlyingItem = {
      id: flyId,
      itemId: treat.id,
      image: treat.image,
      startX,
      startY,
      endX,
      endY,
      targetScale: slot.scale,
      targetRotate: slot.rotate,
    };

    setFlyingItems((prev) => [...prev, newFly]);

    // 3. After parabolic flight finishes (650ms), nestle treat, bump basket, and trigger sparkles
    setTimeout(() => {
      // Add or increment treat quantity (capped at 10)
      setQuantities((prev) => ({
        ...prev,
        [treat.id]: Math.min(10, (prev[treat.id] || 0) + 1),
      }));
      // Remove fly clone
      setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
      // Basket landing jiggle / micro-bump
      setBasketBump(true);
      setTimeout(() => setBasketBump(false), 350);

      // Sparkles burst at destination
      const burstColors = ["#E2405C", "#F7C242", "#FF85A1", "#FFD700", "#FF6B8B"];
      const newSparkles: SparkleParticle[] = Array.from({ length: 8 }, (_, i) => ({
        id: `sp-${Date.now()}-${i}`,
        x: endX,
        y: endY,
        color: burstColors[i % burstColors.length],
        angle: (i * 45 * Math.PI) / 180,
        distance: 28 + (i % 3) * 14,
      }));
      setSparkles((prev) => [...prev, ...newSparkles]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((sp) => !newSparkles.some((ns) => ns.id === sp.id)));
      }, 700);
    }, 650);
  };

  const incrementItem = (itemId: string, event?: React.MouseEvent) => {
    const currentQty = quantities[itemId] || 0;
    if (currentQty >= 10) return; // Cap at 10 items

    if (currentQty === 0) {
      const treat = treats.find((t) => t.id === itemId);
      const btn = (event?.currentTarget as HTMLElement) || shelfButtonRefs.current[itemId];
      if (treat && btn && stageStackRef.current) {
        triggerFlyToBasket(treat, btn);
      } else {
        setQuantities((prev) => ({ ...prev, [itemId]: 1 }));
      }
    } else {
      setQuantities((prev) => ({ ...prev, [itemId]: currentQty + 1 }));
      setBasketBump(true);
      setTimeout(() => setBasketBump(false), 250);
    }
  };

  const decrementItem = (itemId: string) => {
    const currentQty = quantities[itemId] || 0;
    if (currentQty <= 1) {
      setQuantities((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    } else {
      setQuantities((prev) => ({ ...prev, [itemId]: currentQty - 1 }));
    }
  };

  const handleReset = () => {
    setQuantities({});
  };

  // Pricing math (base basket + sum of (treat.price * quantity))
  const itemsTotal = isCakeBasket
    ? 0
    : Object.entries(quantities).reduce((sum, [id, qty]) => {
        const item = treats.find((t) => t.id === id);
        return sum + (item?.price || 0) * qty;
      }, 0);

  const grandTotal = activeBasket.basePrice + itemsTotal;

  // Packed item objects
  const packedTreats = isCakeBasket
    ? []
    : (packedItemIds
        .map((id) => treats.find((t) => t.id === id))
        .filter(Boolean) as TreatItem[]);

  // WhatsApp order builder
  const buildWhatsAppMessage = () => {
    if (isCakeBasket) {
      const lines = [
        "Hi Gift Town! I would like to order the Heritage Round Cake Hamper:",
        `🧺 Basket: ${activeBasket.name} (PKR ${activeBasket.basePrice.toLocaleString()})`,
        "🎂 Occasion: Celebration Cake Setup",
        "Please guide me with available customized cake flavors and delivery timing in Thatta/Makli!",
      ];
      return encodeURIComponent(lines.join("\n"));
    }

    const lines = [
      "Hi Gift Town! I designed a custom gift hamper on your Live Hamper Studio:",
      `🧺 Basket Base: ${activeBasket.name} (PKR ${activeBasket.basePrice.toLocaleString()})`,
      `🍫 Packed Items (${totalPackedCount} items):`,
      ...packedTreats.map((item, idx) => {
        const qty = quantities[item.id] || 1;
        const lineTotal = item.price * qty;
        return `  ${idx + 1}. ${item.name} (x${qty}) - PKR ${lineTotal.toLocaleString()}`;
      }),
      `💰 Total Estimated Price: PKR ${grandTotal.toLocaleString()}`,
      "Please confirm item availability and delivery timing in Thatta/Makli!",
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  return (
    <section
      className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 bg-transparent z-10"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">

        {/* ── Section Header ── */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-rose/20 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-rose fill-rose" />
            <span className="text-xs font-bold uppercase tracking-wider text-maroon">
              Live Interactive Studio
            </span>
          </div>

          <h2 className="font-display font-black text-[clamp(40px,5.2vw,80px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            <span className="block">PACK YOUR OWN</span>
            <span className="block">CUSTOM HAMPER</span>
          </h2>
          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Choose your basket, tap the chocolates & treats you love, and watch them tuck neatly inside your real gift hamper.
          </p>
        </div>

        {/* ── Main Studio Workbench ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN: Live Basket Canvas ════ */}
          <div className="lg:col-span-7 bg-white rounded-[36px] sm:rounded-[44px] border border-rose/20 shadow-[0_24px_60px_rgba(107,21,53,0.10)] p-5 sm:p-7 flex flex-col">
            
            {/* Basket Selector Pills Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose/15 gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-maroon/70">
                1. Select Basket Base:
              </span>
              {!isCakeBasket && totalPackedCount > 0 && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose hover:text-[#b22d44] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Empty Basket</span>
                </button>
              )}
            </div>

            {/* Basket Style Tabs */}
            <div className="flex flex-wrap gap-2 my-4">
              {baskets.map((basket) => {
                const isSelected = basket.id === selectedBasketId;
                return (
                  <button
                    key={basket.id}
                    onClick={() => setSelectedBasketId(basket.id)}
                    className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between relative ${
                      isSelected
                        ? "border-rose bg-[#fdf2f4] shadow-sm scale-102"
                        : "border-rose/15 bg-white hover:border-rose/40 hover:bg-[#fff9fa]"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-rose uppercase tracking-wider block mb-0.5">
                      {basket.tag}
                    </span>
                    <span className="font-body font-bold text-xs text-maroon leading-tight block">
                      {basket.name.split(" ")[0]} {basket.name.split(" ")[1]}
                    </span>
                    <span className="text-[11px] font-semibold text-maroon/60 block mt-1">
                      PKR {basket.basePrice.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── THE INTERACTIVE STAGE CANVAS ── */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[28px] overflow-hidden bg-gradient-to-b from-[#fff6f7] via-[#faedf0] to-[#f5dfe4] border border-rose/20 flex items-center justify-center select-none shadow-inner">
              
              {/* Stage Lighting & Ambience */}
              <div className="absolute top-4 inset-x-8 h-24 bg-gradient-to-b from-white/70 to-transparent rounded-full blur-md pointer-events-none" />
              <div className="absolute bottom-6 w-3/4 h-8 bg-maroon/15 rounded-full blur-xl pointer-events-none" />

              {/* Live Count Floating Pill in Top-Left */}
              <div className="absolute top-4 left-4 z-30">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-rose/20 text-maroon text-xs font-bold shadow-xs">
                  {isCakeBasket ? (
                    <>
                      <Cake className="w-3.5 h-3.5 text-rose" />
                      <span>Dedicated Cake Hamper</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-rose" />
                      <span>{totalPackedCount} {totalPackedCount === 1 ? "Treat" : "Treats"} Inside</span>
                    </>
                  )}
                </div>
              </div>

              {/* Interactive Help Hint in Top-Right */}
              {!isCakeBasket && totalPackedCount > 0 && (
                <div className="absolute top-4 right-4 z-30 hidden sm:block">
                  <span className="text-[10px] font-semibold text-maroon/60 bg-white/80 px-2.5 py-1 rounded-full border border-rose/15">
                    Tap ✕ to remove item
                  </span>
                </div>
              )}

              {/* ── STAGE STACK ── */}
              <div
                ref={stageStackRef}
                className={`relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center transition-transform duration-300 ${
                  basketBump ? "animate-basketBump" : ""
                }`}
              >

                {/* 1. Base Basket Back Wall & Handles (zIndex: 10) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div
                    className={`relative transition-all duration-300 ${
                      selectedBasketId === "wicker-handle"
                        ? "w-[96%] h-[96%]"
                        : "w-[85%] h-[85%]"
                    }`}
                  >
                    <div
                      className="relative w-full h-full"
                      style={{
                        transform: `scale(${(activeBasket.image_scale ?? 100) / 100}) translate3d(${activeBasket.image_offset_x ?? 0}px, ${activeBasket.image_offset_y ?? 0}px, 0)`,
                      }}
                    >
                      <Image
                        src={activeBasket.image}
                        alt={activeBasket.name}
                        fill
                        sizes="(max-width: 640px) 340px, 420px"
                        className="object-contain drop-shadow-[0_18px_25px_rgba(107,21,53,0.18)]"
                        style={{
                          objectPosition: activeBasket.image_position || "center",
                        }}
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Nestled Treats Layer (ONLY FOR NON-CAKE BASKETS) */}
                {!isCakeBasket &&
                  (() => {
                    // Check if ANY back-row chocolate is packed in Classic Wicker
                    const hasBackRowItemInWicker =
                      selectedBasketId === "wicker-handle" &&
                      ["snickers-bar", "dairy-milk-tall", "kitkat-chunky"].some(
                        (backId) => (quantities[backId] || 0) > 0
                      );

                    return TREATS.map((treat) => {
                      const qty = quantities[treat.id] || 0;
                      if (qty <= 0) return null;

                      // Get slot for active basket (wicker-handle or oval-trough)
                      const basketSlotKey =
                        selectedBasketId === "oval-trough"
                          ? "oval-trough"
                          : "wicker-handle";
                      const slot = treat.slots[basketSlotKey];

                      const isFrontProduct = [
                        "lays-hangout",
                        "lays-party",
                        "dairy-milk-square",
                      ].includes(treat.id);

                      // When a back-row chocolate is chosen in Classic Wicker:
                      // 1. Front 3 products decrease their size so back products are visible
                      // 2. Front 3 products move slightly below
                      let topPos = slot.top;
                      let scaleVal = slot.scale;

                      if (
                        selectedBasketId === "wicker-handle" &&
                        isFrontProduct &&
                        hasBackRowItemInWicker
                      ) {
                        scaleVal = Number((slot.scale * 0.84).toFixed(3));
                        if (treat.id === "lays-party") {
                          topPos = "52.0%";
                        } else {
                          topPos = "51.0%";
                        }
                      }

                      return (
                        <div
                          key={treat.id}
                          className="absolute transition-all duration-500 ease-out group"
                          style={{
                            left: slot.left,
                            top: topPos,
                            transform: `translate(-50%, -50%) rotate(${slot.rotate}) scale(${scaleVal})`,
                            zIndex: slot.zIndex,
                            willChange: "transform, opacity, top",
                            animation: "popIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        >
                          <div className="relative w-28 h-36 sm:w-32 sm:h-44 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]">
                            <Image
                              src={treat.image}
                              alt={treat.name}
                              fill
                              sizes="140px"
                              className="object-contain"
                            />
                            {/* Quantity badge if > 1 */}
                            {qty > 1 && (
                              <span className="absolute -top-1.5 -left-1.5 bg-rose text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-md border-2 border-white pointer-events-none z-20">
                                x{qty}
                              </span>
                            )}
                            {/* Hover remove/decrement button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                decrementItem(treat.id);
                              }}
                              title={`Remove 1 ${treat.name}`}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose text-white text-xs font-black flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-[#b22d44] z-20 active:scale-90"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}

                {/* Cake Basket Specially Nestled Display */}
                {isCakeBasket && (
                  <div className="absolute z-20 text-center max-w-[280px] bg-white/95 backdrop-blur-md px-6 py-5 rounded-3xl border border-rose/30 shadow-lg">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#fdf2f4] text-rose flex items-center justify-center mb-2.5">
                      <Cake className="w-6 h-6 text-rose" />
                    </div>
                    <p className="font-body font-black text-sm text-maroon mb-1">
                      Designed for Celebration Cakes
                    </p>
                    <p className="font-body text-xs text-maroon/70 leading-relaxed mb-3">
                      This round heritage hamper is handcrafted exclusively to hold custom decorated birthday & anniversary mini cakes.
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose font-bold text-[11px]">
                      <Sparkles className="w-3 h-3" />
                      <span>Custom Cake Included</span>
                    </span>
                  </div>
                )}

                {/* Empty State Prompt if no items packed (for treats baskets) */}
                {!isCakeBasket && totalPackedCount === 0 && (
                  <div className="absolute z-20 text-center bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-rose/30 shadow-sm animate-pulse">
                    <p className="font-body font-bold text-xs text-maroon">
                      Basket is Empty
                    </p>
                    <p className="font-body text-[11px] text-maroon/70">
                      Tap any chocolate or snack on the right to pack it!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Basket Details Pill */}
            <div className="mt-4 pt-3 border-t border-rose/10 flex items-center justify-between text-xs text-maroon/70">
              <span className="font-semibold">{activeBasket.name}</span>
              <span className="font-bold text-maroon">
                Base price: PKR {activeBasket.basePrice.toLocaleString()}
              </span>
            </div>

          </div>


          {/* ════ RIGHT COLUMN: Treats Shelf & Live Order Card ════ */}
          <div className="lg:col-span-5 space-y-6">

            {/* Treats Shelf Card OR Cake Notice */}
            {!isCakeBasket ? (
              <div className="bg-white rounded-[36px] sm:rounded-[44px] border border-rose/20 shadow-[0_24px_60px_rgba(107,21,53,0.10)] p-5 sm:p-7">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose/15">
                  <div>
                    <h3 className="font-body font-black text-sm uppercase tracking-wider text-maroon">
                      2. Choose Your Treats
                    </h3>
                    <p className="text-[11px] text-maroon/60">
                      Tap + or - to customize quantities (up to 10 each)
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-rose bg-rose/10 px-2.5 py-0.5 rounded-full">
                    {totalPackedCount} Item{totalPackedCount !== 1 ? "s" : ""} Packed
                  </span>
                </div>

                {/* 2-Column Grid of Treats */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {treats.map((treat) => {
                    const qty = quantities[treat.id] || 0;
                    const isPacked = qty > 0;
                    return (
                      <div
                        key={treat.id}
                        ref={(el) => {
                          shelfButtonRefs.current[treat.id] = el;
                        }}
                        onClick={(e) => {
                          if (qty === 0) {
                            incrementItem(treat.id, e);
                          }
                        }}
                        className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between group ${
                          isPacked
                            ? "border-rose bg-[#fdf2f4] shadow-sm"
                            : "border-rose/15 bg-white hover:border-rose/40 hover:bg-[#fff9fa] cursor-pointer"
                        }`}
                      >
                        {/* Thumbnail & Stepper / Add Badge */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden flex items-center justify-center">
                            <div
                              className="relative w-full h-full transition-transform duration-300 group-hover:scale-105"
                              style={{
                                transform: `scale(${(treat.image_scale ?? 100) / 100}) translate3d(${treat.image_offset_x ?? 0}px, ${treat.image_offset_y ?? 0}px, 0)`,
                              }}
                            >
                              <Image
                                src={treat.image}
                                alt={treat.name}
                                fill
                                sizes="60px"
                                className="object-contain"
                                style={{
                                  objectPosition: treat.image_position || "center",
                                }}
                              />
                            </div>
                          </div>

                          {/* Stepper or Add Button */}
                          {isPacked ? (
                            <div
                              className="inline-flex items-center gap-1 bg-white border border-rose/30 rounded-full p-0.5 shadow-2xs select-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  decrementItem(treat.id);
                                }}
                                title="Decrease quantity"
                                className="w-5 h-5 rounded-full bg-rose/10 text-rose hover:bg-rose hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-black text-maroon px-1 min-w-[14px] text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                disabled={qty >= 10}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  incrementItem(treat.id, e);
                                }}
                                title={qty >= 10 ? "Maximum 10 items limit" : "Increase quantity"}
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors text-xs font-bold ${
                                  qty >= 10
                                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                    : "bg-rose text-white hover:bg-[#b22d44] cursor-pointer active:scale-90"
                                }`}
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                incrementItem(treat.id, e);
                              }}
                              title="Add to basket"
                              className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors bg-rose/10 text-rose group-hover:bg-rose group-hover:text-white shadow-2xs cursor-pointer active:scale-90"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-rose block">
                              {treat.category}
                            </span>
                            {qty >= 10 && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded">
                                Limit 10
                              </span>
                            )}
                          </div>
                          <h4 className="font-body font-bold text-xs text-maroon leading-snug line-clamp-2">
                            {treat.name}
                          </h4>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="font-body font-black text-xs text-maroon">
                              PKR {treat.price.toLocaleString()}
                            </span>
                            {qty > 1 && (
                              <span className="text-[10px] font-bold text-rose">
                                Total: PKR {(treat.price * qty).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[36px] sm:rounded-[44px] border border-rose/20 shadow-[0_24px_60px_rgba(107,21,53,0.10)] p-6 sm:p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose/10 text-rose flex items-center justify-center">
                  <Cake className="w-7 h-7 text-rose" />
                </div>
                <h3 className="font-body font-black text-base text-maroon">
                  Custom Cake Hamper Configuration
                </h3>
                <p className="font-body text-xs text-maroon/75 leading-relaxed">
                  This Heritage Round basket is specifically paired with personalized mini cakes (flavor, name text & candles) rather than loose snacks.
                </p>
                <div className="p-4 rounded-2xl bg-[#fff8f9] border border-rose/15 text-left space-y-2 text-xs text-maroon/80">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose" />
                    <span>Choice of Chocolate Fudge, Red Velvet, or Lotus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose" />
                    <span>Personalized Name / Age piping included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose" />
                    <span>Delivered fresh in Thatta & Makli</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Receipt & WhatsApp CTA Card */}
            <div className="bg-gradient-to-br from-[#fff7f8] via-white to-[#faedf0] rounded-[36px] sm:rounded-[44px] border border-rose/30 shadow-[0_20px_50px_rgba(107,21,53,0.09)] p-6 sm:p-7">
              <h3 className="font-body font-black text-xs uppercase tracking-wider text-rose mb-3">
                ✦ Your Hamper Estimate
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs sm:text-sm text-maroon/80 border-b border-rose/15 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <span>Basket: {activeBasket.name}</span>
                  <span className="font-bold text-maroon">
                    PKR {activeBasket.basePrice.toLocaleString()}
                  </span>
                </div>

                {!isCakeBasket ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Selected Treats ({totalPackedCount} items)</span>
                      <span className="font-bold text-maroon">
                        +PKR {itemsTotal.toLocaleString()}
                      </span>
                    </div>
                    {packedTreats.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {packedTreats.map((t) => {
                          const qty = quantities[t.id] || 1;
                          return (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-1.5 text-[11px] bg-white border border-rose/20 px-2.5 py-1 rounded-lg text-maroon font-medium shadow-2xs"
                            >
                              <span>{t.name}</span>
                              <span className="font-bold text-rose bg-rose/10 px-1.5 py-0.2 rounded">
                                x{qty}
                              </span>
                              <span className="text-maroon/60 text-[10px]">
                                (PKR {(t.price * qty).toLocaleString()})
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between text-rose font-medium text-xs">
                    <span>Celebration Cake Inclusions</span>
                    <span>Included in Base</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-maroon/60 block">
                    Estimated Total
                  </span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-maroon">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-rose bg-rose/10 px-2.5 py-1 rounded-full">
                  Doorstep Ready
                </span>
              </div>

              {/* WhatsApp Checkout CTA */}
              <a
                href={`https://wa.me/?text=${buildWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] text-white font-body font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer group"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {isCakeBasket ? "Order Cake Hamper on WhatsApp" : "Order This Custom Hamper"}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Reassurance note */}
              <p className="text-[11px] text-maroon/60 text-center mt-3 font-medium flex items-center justify-center gap-1">
                <Info className="w-3 h-3 text-rose" />
                <span>Advance booking via WhatsApp • Handcrafted in Thatta</span>
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ── PARABOLIC FLY-TO-BASKET CLONES ── */}
      {flyingItems.map((fly) => (
        <div
          key={fly.id}
          className="fixed pointer-events-none z-[9999]"
          style={
            {
              "--start-x": `${fly.startX}px`,
              "--start-y": `${fly.startY}px`,
              "--end-x": `${fly.endX}px`,
              "--end-y": `${fly.endY}px`,
              "--target-rotate": fly.targetRotate,
              "--target-scale": fly.targetScale,
              animation: "flyArcX 650ms cubic-bezier(0.25, 0.9, 0.4, 1) forwards",
            } as React.CSSProperties
          }
        >
          <div
            style={{
              animation: "flyArcY 650ms cubic-bezier(0.18, 0.89, 0.32, 1.15) forwards",
            }}
          >
            <div className="relative w-24 h-32 filter drop-shadow-[0_12px_24px_rgba(226,64,92,0.35)]">
              <Image
                src={fly.image}
                alt="Flying treat"
                fill
                sizes="100px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      ))}

      {/* ── SPARKLES / PARTICLES BURST ── */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="fixed pointer-events-none z-[9999] rounded-full w-2 h-2"
          style={
            {
              left: `${sp.x}px`,
              top: `${sp.y}px`,
              backgroundColor: sp.color,
              boxShadow: `0 0 8px ${sp.color}`,
              "--tx": `${Math.cos(sp.angle) * sp.distance}px`,
              "--ty": `${Math.sin(sp.angle) * sp.distance}px`,
              animation: "sparklePop 700ms ease-out forwards",
            } as React.CSSProperties
          }
        />
      ))}

      {/* Global Injected CSS for Parabolic Flight & Pop-In Physics */}
      <style jsx global>{`
        @keyframes flyArcX {
          0% {
            left: var(--start-x);
            transform: translateX(-50%) scale(1.1) rotate(0deg);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            left: var(--end-x);
            transform: translateX(-50%) scale(var(--target-scale)) rotate(var(--target-rotate));
            opacity: 0.95;
          }
        }

        @keyframes flyArcY {
          0% {
            top: var(--start-y);
          }
          30% {
            /* Rises upward first into an arc */
            top: calc(var(--start-y) - 65px);
          }
          100% {
            top: var(--end-y);
            transform: translateY(-50%);
          }
        }

        @keyframes basketBump {
          0% {
            transform: scale(1);
          }
          35% {
            transform: scale(1.025) translateY(2px);
          }
          70% {
            transform: scale(0.99) translateY(-1px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }

        .animate-basketBump {
          animation: basketBump 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes sparklePop {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.2);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -80%) scale(0.4);
          }
          70% {
            transform: translate(-50%, -48%) scale(1.08);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
