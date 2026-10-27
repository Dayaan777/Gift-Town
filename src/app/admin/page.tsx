"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Package,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Phone,
  MessageCircle,
  Truck,
  Plus,
  Star,
  Edit2,
  Trash2,
  Check,
  ExternalLink,
  Flame,
  Cake,
  Boxes,
  Sliders,
  Maximize2,
  Move,
  RotateCcw,
  Compass,
  Crosshair,
  ZoomIn,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/admin/ImageUploader";

interface BestsellerRow {
  id: string;
  name: string;
  category_tag: string;
  category: string;
  badge: string;
  price: string;
  original_price?: string;
  rating: number;
  reviews_count: number;
  highlight: string;
  image: string;
  whatsapp_message?: string;
  is_active: boolean;
  display_order: number;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

interface FeaturedProductRow {
  id: string;
  name: string;
  category_tag: string;
  category: "all" | "bouquets" | "hampers" | "boxes" | "chocolates";
  badge?: string;
  price: string;
  original_price?: string;
  rating: number;
  reviews_count: number;
  highlight: string;
  image: string;
  whatsapp_message?: string;
  is_active: boolean;
  display_order: number;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

interface HamperItemRow {
  id: string;
  name: string;
  type: "basket" | "treat"; // 'basket' (Base) or 'treat' (Inside product)
  base_type?: "basket" | "cake"; // For products: whether it sits in a basket or is cake-only
  category_type?: "treats" | "cake"; // For bases: treats hamper or cake hamper
  category: string;
  price: number;
  image: string;
  subtitle?: string;
  tag?: string;
  is_active: boolean;
  display_order: number;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: "bestsellers" | "featured-products" | "custom-hamper" | "image-sizing"
  const [activeTab, setActiveTab] = useState<
    "bestsellers" | "featured-products" | "custom-hamper" | "image-sizing"
  >("bestsellers");
  const [bestsellers, setBestsellers] = useState<BestsellerRow[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductRow[]>([]);
  const [hamperItems, setHamperItems] = useState<HamperItemRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Visual Studio Sizing State
  const [sizingSection, setSizingSection] = useState<
    "bestsellers" | "featured-products" | "custom-hamper"
  >("bestsellers");
  const [sizingSearch, setSizingSearch] = useState("");
  const [showFramingGuides, setShowFramingGuides] = useState(true);

  // Modals for Add / Edit
  const [editingBestseller, setEditingBestseller] = useState<BestsellerRow | null>(null);
  const [isAddingBestseller, setIsAddingBestseller] = useState(false);

  const [editingFeaturedProduct, setEditingFeaturedProduct] = useState<FeaturedProductRow | null>(null);
  const [isAddingFeaturedProduct, setIsAddingFeaturedProduct] = useState(false);

  const [editingHamperItem, setEditingHamperItem] = useState<HamperItemRow | null>(null);
  const [isAddingHamperItem, setIsAddingHamperItem] = useState(false);

  // Filter for Custom Hamper
  const [hamperFilter, setHamperFilter] = useState<"all" | "base" | "product">("all");
  // Filter for Featured Products
  const [productFilter, setProductFilter] = useState<string>("all");

  // New item form default states
  const [newBestseller, setNewBestseller] = useState<Partial<BestsellerRow>>({
    name: "",
    category_tag: "Signature Bouquet",
    category: "bouquets",
    badge: "Trending",
    price: "4,500",
    original_price: "",
    highlight: "",
    image: "",
    whatsapp_message: "",
  });

  const [newFeaturedProduct, setNewFeaturedProduct] = useState<Partial<FeaturedProductRow>>({
    name: "",
    category_tag: "Boutique Gift",
    category: "bouquets",
    badge: "Featured",
    price: "4,500",
    original_price: "",
    highlight: "",
    image: "",
    whatsapp_message: "",
  });

  const [newHamperItem, setNewHamperItem] = useState<Partial<HamperItemRow>>({
    name: "",
    type: "treat",
    base_type: "basket",
    category_type: "treats",
    category: "Chocolates",
    price: 350,
    subtitle: "",
    tag: "Popular",
    image: "",
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchDashboardData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError("Incorrect password. Please try again.");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Featured Best Sellers
      const { data: bsData, error: bsErr } = await supabase
        .from("featured_bestsellers")
        .select("*")
        .order("display_order", { ascending: true });

      if (!bsErr && bsData) {
        setBestsellers(bsData as BestsellerRow[]);
      }

      // 1.5 Fetch Featured Products (Catalog)
      const { data: fpData, error: fpErr } = await supabase
        .from("featured_products")
        .select("*")
        .order("display_order", { ascending: true });

      if (!fpErr && fpData) {
        setFeaturedProducts(fpData as FeaturedProductRow[]);
      }

      // 2. Fetch Custom Hamper Studio Items
      const { data: hData, error: hErr } = await supabase
        .from("hamper_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (!hErr && hData) {
        setHamperItems(hData as HamperItemRow[]);
      }
    } catch (err) {
      console.error("Error fetching Supabase data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  // ═════════════════════════════════════════════════════════════════
  // BESTSELLERS CRUD
  // ═════════════════════════════════════════════════════════════════
  const toggleBestsellerActive = async (item: BestsellerRow) => {
    const nextState = !item.is_active;
    setBestsellers((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, is_active: nextState } : b))
    );
    await supabase
      .from("featured_bestsellers")
      .update({ is_active: nextState })
      .eq("id", item.id);
    showNotification(`Updated visibility for "${item.name}"`);
  };

  const handleCreateBestseller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBestseller.name || !newBestseller.price) {
      alert("Please provide product name and price");
      return;
    }

    const id = "prod-" + Date.now().toString().slice(-6);
    const itemToAdd: BestsellerRow = {
      id,
      name: newBestseller.name!,
      category_tag: newBestseller.category_tag || "Signature Gift",
      category: newBestseller.category || "bouquets",
      badge: newBestseller.badge || "Trending",
      price: newBestseller.price!,
      original_price: newBestseller.original_price || undefined,
      rating: 5.0,
      reviews_count: 50,
      highlight:
        newBestseller.highlight ||
        "Custom handcrafted arrangement with luxury wrappers and personalized wish card.",
      image: newBestseller.image || "/images/products/heart-money-lights-bouquet.png",
      whatsapp_message:
        newBestseller.whatsapp_message ||
        `Hi Gift Town! I want to order the '${newBestseller.name}'.`,
      is_active: true,
      display_order: bestsellers.length + 1,
    };

    setBestsellers((prev) => [...prev, itemToAdd]);
    setIsAddingBestseller(false);

    const { error } = await supabase.from("featured_bestsellers").insert([itemToAdd]);
    if (!error) {
      showNotification(`Added "${itemToAdd.name}" to Featured Best Sellers!`);
      setNewBestseller({
        name: "",
        category_tag: "Signature Bouquet",
        category: "bouquets",
        badge: "Trending",
        price: "4,500",
        original_price: "",
        highlight: "",
        image: "",
        whatsapp_message: "",
      });
    } else {
      console.error(error);
      alert("Failed to add product: " + error.message);
      fetchDashboardData();
    }
  };

  const handleSaveBestsellerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBestseller) return;

    setBestsellers((prev) =>
      prev.map((b) => (b.id === editingBestseller.id ? editingBestseller : b))
    );

    const { error } = await supabase
      .from("featured_bestsellers")
      .update({
        name: editingBestseller.name,
        price: editingBestseller.price,
        original_price: editingBestseller.original_price,
        badge: editingBestseller.badge,
        category_tag: editingBestseller.category_tag,
        highlight: editingBestseller.highlight,
        image: editingBestseller.image,
        whatsapp_message: editingBestseller.whatsapp_message,
      })
      .eq("id", editingBestseller.id);

    if (!error) {
      showNotification(`Saved changes for "${editingBestseller.name}"!`);
      setEditingBestseller(null);
    } else {
      alert("Failed to save changes: " + error.message);
    }
  };

  const handleDeleteBestseller = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from Featured Best Sellers?`)) {
      return;
    }

    setBestsellers((prev) => prev.filter((b) => b.id !== id));
    const { error } = await supabase.from("featured_bestsellers").delete().eq("id", id);
    if (!error) {
      showNotification(`Deleted "${name}"`);
    } else {
      alert("Failed to delete: " + error.message);
      fetchDashboardData();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // FEATURED PRODUCTS CRUD
  // ═════════════════════════════════════════════════════════════════
  const toggleFeaturedProductActive = async (item: FeaturedProductRow) => {
    const nextState = !item.is_active;
    setFeaturedProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, is_active: nextState } : p))
    );
    await supabase
      .from("featured_products")
      .update({ is_active: nextState })
      .eq("id", item.id);
    showNotification(`Updated visibility for "${item.name}"`);
  };

  const handleCreateFeaturedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeaturedProduct.name || !newFeaturedProduct.price) {
      alert("Please provide product name and price");
      return;
    }

    const id = "cat-" + Date.now().toString().slice(-6);
    const itemToAdd: FeaturedProductRow = {
      id,
      name: newFeaturedProduct.name!,
      category_tag: newFeaturedProduct.category_tag || "Boutique Gift",
      category: (newFeaturedProduct.category as any) || "bouquets",
      badge: newFeaturedProduct.badge || undefined,
      price: newFeaturedProduct.price!,
      original_price: newFeaturedProduct.original_price || undefined,
      rating: 5.0,
      reviews_count: 50,
      highlight:
        newFeaturedProduct.highlight ||
        "Custom handcrafted arrangement designed to spark unforgettable moments.",
      image: newFeaturedProduct.image || "/images/products/heart-money-lights-bouquet.png",
      whatsapp_message:
        newFeaturedProduct.whatsapp_message ||
        `Hi Gift Town! I want to order the '${newFeaturedProduct.name}'.`,
      is_active: true,
      display_order: featuredProducts.length + 1,
    };

    setFeaturedProducts((prev) => [...prev, itemToAdd]);
    setIsAddingFeaturedProduct(false);

    const { error } = await supabase.from("featured_products").insert([itemToAdd]);
    if (!error) {
      showNotification(`Added "${itemToAdd.name}" to Featured Products!`);
      setNewFeaturedProduct({
        name: "",
        category_tag: "Boutique Gift",
        category: "bouquets",
        badge: "Featured",
        price: "4,500",
        original_price: "",
        highlight: "",
        image: "",
        whatsapp_message: "",
      });
    } else {
      console.error(error);
      alert("Failed to add product: " + error.message);
      fetchDashboardData();
    }
  };

  const handleSaveFeaturedProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeaturedProduct) return;

    setFeaturedProducts((prev) =>
      prev.map((p) => (p.id === editingFeaturedProduct.id ? editingFeaturedProduct : p))
    );

    const { error } = await supabase
      .from("featured_products")
      .update({
        name: editingFeaturedProduct.name,
        price: editingFeaturedProduct.price,
        original_price: editingFeaturedProduct.original_price,
        badge: editingFeaturedProduct.badge,
        category: editingFeaturedProduct.category,
        category_tag: editingFeaturedProduct.category_tag,
        highlight: editingFeaturedProduct.highlight,
        image: editingFeaturedProduct.image,
        whatsapp_message: editingFeaturedProduct.whatsapp_message,
      })
      .eq("id", editingFeaturedProduct.id);

    if (!error) {
      showNotification(`Saved changes for "${editingFeaturedProduct.name}"!`);
      setEditingFeaturedProduct(null);
    } else {
      alert("Failed to save changes: " + error.message);
    }
  };

  const handleDeleteFeaturedProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from Featured Products?`)) {
      return;
    }

    setFeaturedProducts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("featured_products").delete().eq("id", id);
    if (!error) {
      showNotification(`Deleted "${name}"`);
    } else {
      alert("Failed to delete: " + error.message);
      fetchDashboardData();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // CUSTOM HAMPER CRUD (BASES & PRODUCTS)
  // ═════════════════════════════════════════════════════════════════
  const toggleHamperActive = async (item: HamperItemRow) => {
    const nextState = !item.is_active;
    setHamperItems((prev) =>
      prev.map((h) => (h.id === item.id ? { ...h, is_active: nextState } : h))
    );
    await supabase
      .from("hamper_items")
      .update({ is_active: nextState })
      .eq("id", item.id);
    showNotification(`Updated visibility for "${item.name}"`);
  };

  const handleCreateHamperItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHamperItem.name || newHamperItem.price === undefined) {
      alert("Please provide name and price");
      return;
    }

    const itemType = newHamperItem.type || "treat";
    const id =
      (itemType === "basket" ? "base-" : "item-") +
      newHamperItem
        .name!.toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 18) +
      "-" +
      Date.now().toString().slice(-4);

    const itemToAdd: HamperItemRow = {
      id,
      name: newHamperItem.name!,
      type: itemType,
      base_type: newHamperItem.base_type || "basket",
      category_type: newHamperItem.category_type || "treats",
      category:
        itemType === "basket"
          ? "Baskets"
          : newHamperItem.category || "Chocolates",
      price: Number(newHamperItem.price),
      image:
        newHamperItem.image ||
        (itemType === "basket"
          ? "/images/hamper-studio/baskets/basket-wicker-handle.png"
          : "/images/hamper-studio/items/item-snickers.png"),
      subtitle: newHamperItem.subtitle || "",
      tag: newHamperItem.tag || (itemType === "basket" ? "New Base" : "Popular"),
      is_active: true,
      display_order: hamperItems.length + 1,
    };

    setHamperItems((prev) => [...prev, itemToAdd]);
    setIsAddingHamperItem(false);

    const { error } = await supabase.from("hamper_items").insert([itemToAdd]);
    if (!error) {
      showNotification(`Added new ${itemType === "basket" ? "Base" : "Product"} "${itemToAdd.name}"!`);
      setNewHamperItem({
        name: "",
        type: "treat",
        base_type: "basket",
        category_type: "treats",
        category: "Chocolates",
        price: 350,
        subtitle: "",
        tag: "Popular",
        image: "",
      });
    } else {
      console.error(error);
      alert("Failed to add hamper item: " + error.message);
      fetchDashboardData();
    }
  };

  const handleSaveHamperItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHamperItem) return;

    setHamperItems((prev) =>
      prev.map((h) => (h.id === editingHamperItem.id ? editingHamperItem : h))
    );

    const { error } = await supabase
      .from("hamper_items")
      .update({
        name: editingHamperItem.name,
        type: editingHamperItem.type,
        base_type: editingHamperItem.base_type,
        category_type: editingHamperItem.category_type,
        category: editingHamperItem.category,
        price: Number(editingHamperItem.price),
        subtitle: editingHamperItem.subtitle,
        tag: editingHamperItem.tag,
        image: editingHamperItem.image,
      })
      .eq("id", editingHamperItem.id);

    if (!error) {
      showNotification(`Saved "${editingHamperItem.name}" to Hamper Studio!`);
      setEditingHamperItem(null);
    } else {
      alert("Failed to save changes: " + error.message);
    }
  };

  const handleDeleteHamperItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from Custom Hamper Studio?`)) {
      return;
    }

    setHamperItems((prev) => prev.filter((h) => h.id !== id));
    const { error } = await supabase.from("hamper_items").delete().eq("id", id);
    if (!error) {
      showNotification(`Deleted "${name}"`);
    } else {
      alert("Failed to delete: " + error.message);
      fetchDashboardData();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // VISUAL STUDIO / IMAGE SIZING & FRAMING HANDLER
  // ═════════════════════════════════════════════════════════════════
  const handleUpdateImageSizing = async (
    section: "bestsellers" | "featured-products" | "custom-hamper",
    id: string,
    updates: {
      image_scale?: number;
      image_position?: string;
      image_offset_y?: number;
      image_offset_x?: number;
    }
  ) => {
    if (section === "bestsellers") {
      setBestsellers((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      await supabase.from("featured_bestsellers").update(updates).eq("id", id);
    } else if (section === "featured-products") {
      setFeaturedProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      await supabase.from("featured_products").update(updates).eq("id", id);
    } else if (section === "custom-hamper") {
      setHamperItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      await supabase.from("hamper_items").update(updates).eq("id", id);
    }

    showNotification("Framing & size updated live on storefront!");
  };

  // ── 1. LOADING SCREEN ──
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#fce3e0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-rose border-t-transparent animate-spin" />
          <span className="font-body font-semibold text-xs text-maroon/70">
            Checking session...
          </span>
        </div>
      </div>
    );
  }

  // ── 2. GATEWAY PASSWORD PAGE ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fce3e0] flex flex-col justify-center items-center px-4 py-12 selection:bg-rose selection:text-white">
        <div className="w-full max-w-md">
          {/* Logo & Brand Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
              <div className="relative w-20 h-20 mx-auto rounded-full p-[2px] bg-gradient-to-tr from-rose via-[#F7C242] to-rose shadow-md mb-3">
                <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                  <Image
                    src="/images/gift-town-logo.png"
                    alt="Gift Town"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </Link>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-maroon tracking-tight">
              Gift Town Admin Gateway
            </h1>
            <p className="font-body text-xs sm:text-sm text-maroon/70 mt-1">
              Enter your password to access product showcase management
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-[32px] sm:rounded-[36px] p-7 sm:p-9 border border-rose/20 shadow-[0_22px_60px_rgba(107,21,53,0.10)] relative overflow-hidden">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#fdf2f4] text-rose flex items-center justify-center shadow-inner">
                <Lock className="w-6 h-6 text-rose" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-2">
                  Admin Access Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-maroon/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#fff8f9] border border-rose/20 text-maroon font-body font-semibold text-sm placeholder:text-maroon/30 focus:outline-none focus:border-rose focus:bg-white transition-all shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || !passwordInput}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] text-white font-body font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-rose/10 text-center">
              <Link
                href="/"
                className="text-xs text-maroon/60 hover:text-maroon font-semibold transition-colors"
              >
                ← Return to Public Storefront
              </Link>
            </div>
          </div>

          <p className="text-[11px] text-maroon/40 text-center mt-6 font-medium">
            Gift Town Boutique Management • Connected to Supabase
          </p>
        </div>
      </div>
    );
  }

  // ── 3. MAIN AUTHENTICATED DASHBOARD ──
  return (
    <div className="min-h-screen bg-[#fce3e0] flex flex-col selection:bg-rose selection:text-white">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-rose/30 shadow-xs">
                <Image
                  src="/images/gift-town-logo.png"
                  alt="Gift Town"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-display font-black text-base text-maroon group-hover:text-rose transition-colors">
                  Gift Town
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose">
                  Showcase Studio Admin
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Website Sync</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={isLoadingData}
              title="Refresh Data from Database"
              className="p-2.5 rounded-full bg-[#fdf2f4] hover:bg-rose/15 text-rose transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose/25 bg-white text-maroon hover:border-rose hover:text-rose text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose/10 hover:bg-rose text-maroon hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Save Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-22 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Notice Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-[#fdf2f4] rounded-3xl p-5 border border-emerald-200/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="font-body font-bold text-sm text-maroon">
                Showcase & WhatsApp Ordering Mode Active
              </h4>
              <p className="font-body text-xs text-maroon/70">
                Products added and edited here appear directly on the website for customers to explore and order via WhatsApp.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-full border border-emerald-300">
            Showcase Catalog
          </span>
        </div>

        {/* ── Main Navigation Tabs for Dashboard ── */}
        <div className="flex items-center justify-between border-b border-rose/20 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 1. Featured Best Sellers Tab */}
            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "bestsellers"
                  ? "bg-rose text-white shadow-md scale-102"
                  : "bg-white text-maroon/70 hover:text-maroon border border-rose/15 hover:border-rose/30"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Featured Best Sellers</span>
              <span className="ml-1 text-[10px] bg-black/15 px-2 py-0.5 rounded-full">
                {bestsellers.length}
              </span>
            </button>

            {/* 2. Featured Products Tab */}
            <button
              onClick={() => setActiveTab("featured-products")}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "featured-products"
                  ? "bg-rose text-white shadow-md scale-102"
                  : "bg-white text-maroon/70 hover:text-maroon border border-rose/15 hover:border-rose/30"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Featured Products</span>
              <span className="ml-1 text-[10px] bg-black/15 px-2 py-0.5 rounded-full">
                {featuredProducts.length}
              </span>
            </button>

            {/* 3. CUSTOM HAMPER Tab */}
            <button
              onClick={() => setActiveTab("custom-hamper")}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "custom-hamper"
                  ? "bg-rose text-white shadow-md scale-102"
                  : "bg-white text-maroon/70 hover:text-maroon border border-rose/15 hover:border-rose/30"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CUSTOM HAMPER</span>
              <span className="ml-1 text-[10px] bg-black/15 px-2 py-0.5 rounded-full">
                {hamperItems.length}
              </span>
            </button>

            {/* 4. Control Product Image Sizes Tab */}
            <button
              onClick={() => setActiveTab("image-sizing")}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "image-sizing"
                  ? "bg-rose text-white shadow-md scale-102"
                  : "bg-white text-maroon/70 hover:text-maroon border border-rose/15 hover:border-rose/30"
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Control Image Sizes</span>
            </button>
          </div>

          {/* Quick Add Product Button or Sync Indicator */}
          {activeTab === "bestsellers" && (
            <button
              onClick={() => setIsAddingBestseller(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer transition-transform hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bestseller</span>
            </button>
          )}

          {activeTab === "featured-products" && (
            <button
              onClick={() => setIsAddingFeaturedProduct(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer transition-transform hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}

          {activeTab === "custom-hamper" && (
            <button
              onClick={() => setIsAddingHamperItem(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer transition-transform hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add Base or Product</span>
            </button>
          )}

          {activeTab === "image-sizing" && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Realtime Sync Active</span>
              </span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPTION 1: FEATURED BEST SELLERS                             */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "bestsellers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-xl text-maroon">
                  Featured Best Sellers ({bestsellers.length})
                </h3>
                <p className="font-body text-xs text-maroon/70">
                  Manage creations in the homepage "Featured Bestsellers" carousel.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bestsellers.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-[32px] p-5 border transition-all flex flex-col justify-between ${
                    item.is_active
                      ? "border-rose/25 shadow-xs"
                      : "border-neutral-200 opacity-60 bg-neutral-50/50"
                  }`}
                >
                  <div>
                    {/* Visual header */}
                    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#fdf2f4] to-white rounded-2xl overflow-hidden mb-4 p-3 flex items-center justify-center border border-rose/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="240px"
                        className="object-contain p-2"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-rose text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold text-maroon/60 bg-white/90 px-2 py-0.5 rounded-full border border-rose/15">
                        {item.category_tag}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-display font-black text-xl text-maroon">
                        Rs. {item.price}
                      </span>
                      {item.original_price && (
                        <span className="text-xs text-maroon/40 line-through font-semibold">
                          Rs. {item.original_price}
                        </span>
                      )}
                    </div>

                    <h4 className="font-body font-bold text-base text-maroon leading-snug line-clamp-1">
                      {item.name}
                    </h4>

                    <p className="font-body text-xs text-maroon/70 mt-2 line-clamp-2 leading-relaxed">
                      {item.highlight}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-3 border-t border-rose/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleBestsellerActive(item)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        item.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-600 border-neutral-300"
                      }`}
                    >
                      {item.is_active ? "Visible" : "Hidden"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingBestseller(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fdf2f4] hover:bg-rose hover:text-white text-rose font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteBestseller(item.id, item.name)}
                        title="Delete product"
                        className="p-1.5 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPTION 2: FEATURED PRODUCTS CATALOG                         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "featured-products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-display font-black text-xl text-maroon">
                  Featured Products Catalog ({featuredProducts.length})
                </h3>
                <p className="font-body text-xs text-maroon/70">
                  Manage all items displayed in the "FEATURED PRODUCTS" section with instant live synchronization.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {[
                  { id: "all", label: "All Items" },
                  { id: "bouquets", label: "Bouquets" },
                  { id: "hampers", label: "Hampers" },
                  { id: "boxes", label: "Gift Boxes" },
                  { id: "chocolates", label: "Chocolates" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProductFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      productFilter === cat.id
                        ? "bg-rose text-white shadow-2xs"
                        : "bg-white text-maroon/70 border border-rose/15 hover:border-rose/30"
                    }`}
                  >
                    {cat.label} (
                    {cat.id === "all"
                      ? featuredProducts.length
                      : featuredProducts.filter((p) => p.category === cat.id).length}
                    )
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts
                .filter((p) => productFilter === "all" || p.category === productFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-[28px] p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                      item.is_active
                        ? "border-rose/25 shadow-xs"
                        : "border-neutral-200 opacity-60 bg-neutral-50/50"
                    }`}
                  >
                    <div>
                      {/* Visual header */}
                      <div className="relative w-full aspect-square bg-gradient-to-br from-[#fdf2f4] to-white rounded-2xl overflow-hidden mb-3 p-3 flex items-center justify-center border border-rose/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="200px"
                          className="object-contain p-2"
                        />
                        {item.badge && (
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-rose text-white px-2 py-0.5 rounded-full shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 text-[9px] font-semibold text-maroon/70 bg-white/90 px-2 py-0.5 rounded-full border border-rose/15">
                          {item.category_tag}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-1 mb-1">
                        <span className="font-display font-black text-lg text-maroon">
                          Rs. {item.price}
                        </span>
                        {item.original_price && (
                          <span className="text-[11px] text-maroon/40 line-through font-semibold">
                            Rs. {item.original_price}
                          </span>
                        )}
                      </div>

                      <h4 className="font-body font-bold text-sm text-maroon leading-snug line-clamp-1">
                        {item.name}
                      </h4>

                      <p className="font-body text-[11px] text-maroon/70 mt-1 line-clamp-2 leading-relaxed">
                        {item.highlight}
                      </p>
                    </div>

                    {/* Actions footer */}
                    <div className="mt-4 pt-3 border-t border-rose/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleFeaturedProductActive(item)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-600 border-neutral-300"
                        }`}
                      >
                        {item.is_active ? "Visible" : "Hidden"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingFeaturedProduct(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fdf2f4] hover:bg-rose hover:text-white text-rose font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteFeaturedProduct(item.id, item.name)}
                          title="Delete product"
                          className="p-1 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPTION 3: CUSTOM HAMPER (BASES & PRODUCTS)                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "custom-hamper" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-display font-black text-xl text-maroon">
                  CUSTOM HAMPER Studio ({hamperItems.length})
                </h3>
                <p className="font-body text-xs text-maroon/70">
                  Manage Basket Bases (the foundational trays/baskets) and Products (chocolates & snacks or cakes).
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHamperFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hamperFilter === "all"
                      ? "bg-rose text-white shadow-2xs"
                      : "bg-white text-maroon/70 border border-rose/15 hover:border-rose/30"
                  }`}
                >
                  All Items ({hamperItems.length})
                </button>
                <button
                  onClick={() => setHamperFilter("base")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hamperFilter === "base"
                      ? "bg-rose text-white shadow-2xs"
                      : "bg-white text-maroon/70 border border-rose/15 hover:border-rose/30"
                  }`}
                >
                  Bases / Baskets ({hamperItems.filter((h) => h.type === "basket").length})
                </button>
                <button
                  onClick={() => setHamperFilter("product")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hamperFilter === "product"
                      ? "bg-rose text-white shadow-2xs"
                      : "bg-white text-maroon/70 border border-rose/15 hover:border-rose/30"
                  }`}
                >
                  Products / Treats ({hamperItems.filter((h) => h.type === "treat").length})
                </button>
              </div>
            </div>

            {/* Grid of Hamper Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hamperItems
                .filter((h) => {
                  if (hamperFilter === "base") return h.type === "basket";
                  if (hamperFilter === "product") return h.type === "treat";
                  return true;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-[32px] p-5 border transition-all flex flex-col justify-between ${
                      item.is_active
                        ? "border-rose/20 shadow-xs"
                        : "border-neutral-200 opacity-60 bg-neutral-50/50"
                    }`}
                  >
                    <div>
                      {/* Visual & Type Badge */}
                      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#fdf2f4] to-white rounded-2xl overflow-hidden mb-3 p-3 flex items-center justify-center border border-rose/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="200px"
                          className="object-contain p-2"
                        />
                        <span
                          className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${
                            item.type === "basket"
                              ? "bg-maroon text-white"
                              : "bg-rose text-white"
                          }`}
                        >
                          {item.type === "basket"
                            ? item.category_type === "cake"
                              ? "Cake Hamper Base"
                              : "Basket Base"
                            : item.base_type === "cake"
                            ? "Cake Only"
                            : "Basket Product"}
                        </span>
                        {item.tag && (
                          <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold text-rose bg-rose/10 px-2 py-0.5 rounded-full border border-rose/20">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-display font-black text-xl text-maroon">
                          PKR {Number(item.price).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-maroon/50 tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="font-body font-bold text-base text-maroon leading-snug">
                        {item.name}
                      </h4>

                      {item.subtitle && (
                        <p className="font-body text-xs text-maroon/65 mt-1 line-clamp-2">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-rose/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleHamperActive(item)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-600 border-neutral-300"
                        }`}
                      >
                        {item.is_active ? "Active" : "Disabled"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingHamperItem(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fdf2f4] hover:bg-rose hover:text-white text-rose font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteHamperItem(item.id, item.name)}
                          title="Delete product"
                          className="p-1.5 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPTION 4: CONTROL PRODUCT IMAGE SIZES & FRAMING             */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "image-sizing" && (
          <div className="space-y-6">
            {/* Header with Explanatory Banner */}
            <div className="bg-white rounded-3xl p-6 border border-rose/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-xl bg-[#fdf2f4] text-rose">
                    <Maximize2 className="w-5 h-5 text-rose" />
                  </span>
                  <h3 className="font-display font-black text-2xl text-maroon">
                    Control Product Image Sizes &amp; Position
                  </h3>
                </div>
                <p className="font-body text-xs text-maroon/70 max-w-2xl mt-1 leading-relaxed">
                  Select a section below to fine-tune image sizing, vertical framing, and position offsets. Any adjustment you make here is transmitted over Supabase Realtime and <strong>updates immediately on the live storefront</strong> for mobile and desktop shoppers.
                </p>
              </div>

              {/* Crosshair Guides Toggle */}
              <button
                type="button"
                onClick={() => setShowFramingGuides(!showFramingGuides)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  showFramingGuides
                    ? "bg-rose/10 border-rose text-rose shadow-2xs"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Crosshair className="w-4 h-4" />
                <span>{showFramingGuides ? "Framing Guides: ON" : "Framing Guides: OFF"}</span>
              </button>
            </div>

            {/* Section Selector Dropdown & Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-rose/15 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-xs font-bold uppercase tracking-wider text-maroon/80 whitespace-nowrap">
                  Section:
                </label>
                <select
                  value={sizingSection}
                  onChange={(e) => setSizingSection(e.target.value as any)}
                  className="w-full sm:max-w-md px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/25 text-maroon font-bold text-xs sm:text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer shadow-2xs"
                >
                  <option value="bestsellers">
                    🌟 Featured Best Sellers ({bestsellers.length} items)
                  </option>
                  <option value="featured-products">
                    ✨ Featured Products Catalog ({featuredProducts.length} items)
                  </option>
                  <option value="custom-hamper">
                    🧺 Custom Hamper Studio ({hamperItems.length} items)
                  </option>
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-maroon/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in this section..."
                  value={sizingSearch}
                  onChange={(e) => setSizingSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon text-xs font-medium placeholder:text-maroon/40 focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>
            </div>

            {/* List of Products in Selected Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {(sizingSection === "bestsellers"
                ? bestsellers
                : sizingSection === "featured-products"
                ? featuredProducts
                : hamperItems
              )
                .filter((item) =>
                  item.name.toLowerCase().includes(sizingSearch.toLowerCase())
                )
                .map((item) => {
                  const currentScale = item.image_scale ?? 100;
                  const currentPos = item.image_position ?? "center";
                  const currentOffsetY = item.image_offset_y ?? 0;
                  const currentOffsetX = item.image_offset_x ?? 0;
                  const isCustomFramed =
                    currentScale !== 100 ||
                    currentPos !== "center" ||
                    currentOffsetY !== 0 ||
                    currentOffsetX !== 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-5 border border-rose/20 shadow-xs flex flex-col md:flex-row gap-5 items-stretch transition-all hover:shadow-md"
                    >
                      {/* Left: Live Simulated Showcase Vitrine */}
                      <div className="relative w-full md:w-56 h-60 md:h-auto rounded-2xl bg-gradient-to-b from-[#fef8f9] via-[#fdf4f6] to-[#faedf0] border border-rose/20 overflow-hidden flex items-center justify-center p-3 flex-shrink-0">
                        {/* Optional Framing Crosshairs & Bounding Box */}
                        {showFramingGuides && (
                          <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Center Horizontal & Vertical Hairlines */}
                            <div className="absolute top-1/2 inset-x-0 border-t border-dashed border-rose/30" />
                            <div className="absolute left-1/2 inset-y-0 border-l border-dashed border-rose/30" />
                            {/* Standard 100% Boundary Ring */}
                            <div className="absolute inset-4 rounded-xl border border-dotted border-rose/25" />
                          </div>
                        )}

                        {/* Top Live Badging */}
                        <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose/20 text-maroon shadow-2xs">
                            {currentScale}%
                          </span>

                          {isCustomFramed && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-rose text-white px-2 py-0.5 rounded-full shadow-2xs">
                              Custom Framed
                            </span>
                          )}
                        </div>

                        {/* Real-time Scaled & Positioned Product Image */}
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                          <div
                            className="relative w-full h-full transition-transform duration-150 ease-out"
                            style={{
                              transform: `scale(${currentScale / 100}) translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0)`,
                            }}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="240px"
                              className="object-contain drop-shadow-md"
                              style={{
                                objectPosition: currentPos,
                              }}
                            />
                          </div>
                        </div>

                        {/* Bottom Position readout */}
                        <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none text-[9px] font-medium text-maroon/60 bg-white/80 px-2 py-0.5 rounded-full border border-rose/15 backdrop-blur-xs">
                          <span>Pos: {currentPos}</span>
                          <span>
                            X: {currentOffsetX}px • Y: {currentOffsetY}px
                          </span>
                        </div>
                      </div>

                      {/* Right: Interactive Framing Controls */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        {/* Header info */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose">
                              {"category_tag" in item
                                ? (item as any).category_tag
                                : (item as any).category || "Custom Gift"}
                            </span>
                            <span className="font-display font-black text-sm text-maroon">
                              Rs. {item.price}
                            </span>
                          </div>
                          <h4 className="font-body font-bold text-base text-maroon leading-snug line-clamp-1 mt-0.5">
                            {item.name}
                          </h4>
                        </div>

                        {/* 1. Sizing Presets (Small, Standard, Larger, Very Large, Grand) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-maroon/80">
                            <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                              <ZoomIn className="w-3.5 h-3.5 text-rose" />
                              <span>Image Sizing Scale</span>
                            </span>
                            <span className="text-rose font-black text-xs">
                              {currentScale}%
                            </span>
                          </div>

                          {/* Friendly preset buttons */}
                          <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                            {[
                              { label: "Small", scale: 85 },
                              { label: "Standard", scale: 100 },
                              { label: "Larger", scale: 115 },
                              { label: "Very Large", scale: 130 },
                              { label: "Grand", scale: 145 },
                            ].map((preset) => {
                              const isActive = currentScale === preset.scale;
                              return (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    handleUpdateImageSizing(sizingSection, item.id, {
                                      image_scale: preset.scale,
                                    })
                                  }
                                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold tracking-tight uppercase text-center transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-rose text-white shadow-xs scale-102"
                                      : "bg-[#fff8f9] hover:bg-rose/10 text-maroon/80 border border-rose/15"
                                  }`}
                                >
                                  <span className="block truncate">{preset.label}</span>
                                  <span className="block text-[8px] opacity-75">
                                    {preset.scale}%
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Fine-tune Range Slider */}
                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-maroon/50">70%</span>
                            <input
                              type="range"
                              min={70}
                              max={160}
                              step={5}
                              value={currentScale}
                              onChange={(e) =>
                                handleUpdateImageSizing(sizingSection, item.id, {
                                  image_scale: Number(e.target.value),
                                })
                              }
                              className="w-full h-1.5 bg-rose/20 rounded-lg appearance-none cursor-pointer accent-rose"
                            />
                            <span className="text-[10px] font-bold text-maroon/50">160%</span>
                          </div>
                        </div>

                        {/* 2. Position Alignment (Top, Center, Bottom) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-maroon/80">
                            <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                              <Compass className="w-3.5 h-3.5 text-rose" />
                              <span>Framing Alignment</span>
                            </span>
                            <span className="text-maroon/50 font-normal text-[10px]">
                              {currentPos === "top"
                                ? "Blooms & cones prominent"
                                : currentPos === "bottom"
                                ? "Grounded pedestal"
                                : "Balanced center"}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: "top", label: "Top Align", desc: "For tall bouquets" },
                              { id: "center", label: "Center Align", desc: "Default balanced" },
                              { id: "bottom", label: "Bottom Align", desc: "Base grounded" },
                            ].map((pos) => {
                              const isActive = currentPos === pos.id;
                              return (
                                <button
                                  key={pos.id}
                                  type="button"
                                  onClick={() =>
                                    handleUpdateImageSizing(sizingSection, item.id, {
                                      image_position: pos.id,
                                    })
                                  }
                                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold tracking-tight uppercase transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-maroon text-[#FFF4D0] shadow-xs"
                                      : "bg-[#fff8f9] hover:bg-rose/10 text-maroon/80 border border-rose/15"
                                  }`}
                                >
                                  {pos.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Nudge Controls (Vertical & Horizontal fine adjustment) */}
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-rose/10">
                          {/* Vertical Nudge */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-maroon/70 mb-1">
                              <span>Vertical Nudge (Y)</span>
                              <span className="text-rose">{currentOffsetY}px</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Nudge Up 6px"
                                onClick={() =>
                                  handleUpdateImageSizing(sizingSection, item.id, {
                                    image_offset_y: currentOffsetY - 6,
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-[#fff8f9] hover:bg-rose/10 border border-rose/15 text-xs font-bold text-maroon cursor-pointer"
                              >
                                ↑ Up
                              </button>
                              <button
                                type="button"
                                title="Center Y (0px)"
                                onClick={() =>
                                  handleUpdateImageSizing(sizingSection, item.id, {
                                    image_offset_y: 0,
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-[#fff8f9] hover:bg-rose/10 border border-rose/15 text-[10px] font-bold text-maroon/60 cursor-pointer"
                              >
                                0
                              </button>
                              <button
                                type="button"
                                title="Nudge Down 6px"
                                onClick={() =>
                                  handleUpdateImageSizing(sizingSection, item.id, {
                                    image_offset_y: currentOffsetY + 6,
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-[#fff8f9] hover:bg-rose/10 border border-rose/15 text-xs font-bold text-maroon cursor-pointer"
                              >
                                ↓ Down
                              </button>
                            </div>
                          </div>

                          {/* Horizontal Nudge */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-maroon/70 mb-1">
                              <span>Horizontal Nudge (X)</span>
                              <span className="text-rose">{currentOffsetX}px</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Nudge Left 6px"
                                onClick={() =>
                                  handleUpdateImageSizing(sizingSection, item.id, {
                                    image_offset_x: currentOffsetX - 6,
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-[#fff8f9] hover:bg-rose/10 border border-rose/15 text-xs font-bold text-maroon cursor-pointer"
                              >
                                ← Left
                              </button>
                              <button
                                type="button"
                                title="Center X (0px)"
                                onClick={() =>
                                  handleUpdateImageSizing(sizingSection, item.id, {
                                    image_offset_x: 0,
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-[#fff8f9] hover:bg-rose/10 border border-rose/15 text-[10px] font-bold text-maroon/60 cursor-pointer"
                              >
                                0
                              </button>
                              <button
                                type="button"
                                title="Nudge Right 6px"
                                onClick={() =>
                                  handleUpdateImageSizing(sizingSection, item.id, {
                                    image_offset_x: currentOffsetX + 6,
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-[#fff8f9] hover:bg-rose/10 border border-rose/15 text-xs font-bold text-maroon cursor-pointer"
                              >
                                → Right
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Reset & Status Footer */}
                        <div className="pt-2 flex items-center justify-between border-t border-rose/10">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateImageSizing(sizingSection, item.id, {
                                image_scale: 100,
                                image_position: "center",
                                image_offset_y: 0,
                                image_offset_x: 0,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-maroon/50 hover:text-rose cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset to Standard</span>
                          </button>

                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Live on Storefront</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD BESTSELLER PRODUCT                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isAddingBestseller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddingBestseller(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              New Showcase Product
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Add Featured Best Seller
            </h3>

            <form onSubmit={handleCreateBestseller} className="space-y-4">
              {/* Image Upload with Drag & Drop or Mobile Gallery */}
              <ImageUploader
                currentImageUrl={newBestseller.image || ""}
                onImageUploaded={(url) =>
                  setNewBestseller({ ...newBestseller, image: url })
                }
                aspectHint="Transparent PNG recommended for high-impact visual"
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heart-Shaped Money & Lights Bouquet"
                  value={newBestseller.name}
                  onChange={(e) =>
                    setNewBestseller({ ...newBestseller, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6,500"
                    value={newBestseller.price}
                    onChange={(e) =>
                      setNewBestseller({ ...newBestseller, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7,800"
                    value={newBestseller.original_price}
                    onChange={(e) =>
                      setNewBestseller({
                        ...newBestseller,
                        original_price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Most Loved, Trending"
                    value={newBestseller.badge}
                    onChange={(e) =>
                      setNewBestseller({ ...newBestseller, badge: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Currency & Floral Bouquet"
                    value={newBestseller.category_tag}
                    onChange={(e) =>
                      setNewBestseller({
                        ...newBestseller,
                        category_tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Highlight Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for the customer..."
                  value={newBestseller.highlight}
                  onChange={(e) =>
                    setNewBestseller({ ...newBestseller, highlight: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-medium text-xs focus:outline-none focus:border-rose focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setIsAddingBestseller(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Publish to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT BESTSELLER PRODUCT                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {editingBestseller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingBestseller(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Featured Best Sellers Editor
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Edit "{editingBestseller.name}"
            </h3>

            <form onSubmit={handleSaveBestsellerEdit} className="space-y-4">
              <ImageUploader
                currentImageUrl={editingBestseller.image}
                onImageUploaded={(url) =>
                  setEditingBestseller({ ...editingBestseller, image: url })
                }
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingBestseller.name}
                  onChange={(e) =>
                    setEditingBestseller({ ...editingBestseller, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="text"
                    value={editingBestseller.price}
                    onChange={(e) =>
                      setEditingBestseller({ ...editingBestseller, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingBestseller.original_price || ""}
                    onChange={(e) =>
                      setEditingBestseller({
                        ...editingBestseller,
                        original_price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={editingBestseller.badge}
                    onChange={(e) =>
                      setEditingBestseller({ ...editingBestseller, badge: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingBestseller.category_tag}
                    onChange={(e) =>
                      setEditingBestseller({
                        ...editingBestseller,
                        category_tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Highlight Description
                </label>
                <textarea
                  rows={3}
                  value={editingBestseller.highlight}
                  onChange={(e) =>
                    setEditingBestseller({ ...editingBestseller, highlight: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-medium text-xs focus:outline-none focus:border-rose focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setEditingBestseller(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Save Changes to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD FEATURED PRODUCT                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isAddingFeaturedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddingFeaturedProduct(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Featured Products Catalog
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Add Featured Product
            </h3>

            <form onSubmit={handleCreateFeaturedProduct} className="space-y-4">
              <ImageUploader
                currentImageUrl={newFeaturedProduct.image || ""}
                onImageUploaded={(url) =>
                  setNewFeaturedProduct({ ...newFeaturedProduct, image: url })
                }
                aspectHint="Transparent cutout or styled vitrine photo recommended"
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Red Velvet Rose Bouquet"
                  value={newFeaturedProduct.name}
                  onChange={(e) =>
                    setNewFeaturedProduct({ ...newFeaturedProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Category Filter
                  </label>
                  <select
                    value={newFeaturedProduct.category || "bouquets"}
                    onChange={(e) =>
                      setNewFeaturedProduct({
                        ...newFeaturedProduct,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="bouquets">Bouquets</option>
                    <option value="hampers">Hampers</option>
                    <option value="boxes">Gift Boxes</option>
                    <option value="chocolates">Chocolates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fresh Floral Luxury"
                    value={newFeaturedProduct.category_tag}
                    onChange={(e) =>
                      setNewFeaturedProduct({
                        ...newFeaturedProduct,
                        category_tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4,200"
                    value={newFeaturedProduct.price}
                    onChange={(e) =>
                      setNewFeaturedProduct({ ...newFeaturedProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4,900"
                    value={newFeaturedProduct.original_price}
                    onChange={(e) =>
                      setNewFeaturedProduct({
                        ...newFeaturedProduct,
                        original_price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Most Loved, Timeless Classic"
                  value={newFeaturedProduct.badge || ""}
                  onChange={(e) =>
                    setNewFeaturedProduct({ ...newFeaturedProduct, badge: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Highlight Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for the customer..."
                  value={newFeaturedProduct.highlight}
                  onChange={(e) =>
                    setNewFeaturedProduct({ ...newFeaturedProduct, highlight: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-medium text-xs focus:outline-none focus:border-rose focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setIsAddingFeaturedProduct(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Publish to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT FEATURED PRODUCT                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {editingFeaturedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingFeaturedProduct(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Featured Products Editor
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Edit "{editingFeaturedProduct.name}"
            </h3>

            <form onSubmit={handleSaveFeaturedProductEdit} className="space-y-4">
              <ImageUploader
                currentImageUrl={editingFeaturedProduct.image}
                onImageUploaded={(url) =>
                  setEditingFeaturedProduct({ ...editingFeaturedProduct, image: url })
                }
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingFeaturedProduct.name}
                  onChange={(e) =>
                    setEditingFeaturedProduct({ ...editingFeaturedProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Category Filter
                  </label>
                  <select
                    value={editingFeaturedProduct.category || "bouquets"}
                    onChange={(e) =>
                      setEditingFeaturedProduct({
                        ...editingFeaturedProduct,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="bouquets">Bouquets</option>
                    <option value="hampers">Hampers</option>
                    <option value="boxes">Gift Boxes</option>
                    <option value="chocolates">Chocolates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingFeaturedProduct.category_tag}
                    onChange={(e) =>
                      setEditingFeaturedProduct({
                        ...editingFeaturedProduct,
                        category_tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="text"
                    value={editingFeaturedProduct.price}
                    onChange={(e) =>
                      setEditingFeaturedProduct({ ...editingFeaturedProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingFeaturedProduct.original_price || ""}
                    onChange={(e) =>
                      setEditingFeaturedProduct({
                        ...editingFeaturedProduct,
                        original_price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={editingFeaturedProduct.badge || ""}
                  onChange={(e) =>
                    setEditingFeaturedProduct({ ...editingFeaturedProduct, badge: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Highlight Description
                </label>
                <textarea
                  rows={3}
                  value={editingFeaturedProduct.highlight}
                  onChange={(e) =>
                    setEditingFeaturedProduct({
                      ...editingFeaturedProduct,
                      highlight: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-medium text-xs focus:outline-none focus:border-rose focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setEditingFeaturedProduct(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Save Changes to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD CUSTOM HAMPER ITEM (BASE OR PRODUCT)             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isAddingHamperItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddingHamperItem(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Custom Hamper Studio
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Add Base or Product
            </h3>

            <form onSubmit={handleCreateHamperItem} className="space-y-4">
              {/* Item Role Dropdown: Base or Inside Product */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Item Classification
                </label>
                <select
                  value={newHamperItem.type}
                  onChange={(e) => {
                    const nextType = e.target.value as "basket" | "treat";
                    setNewHamperItem({
                      ...newHamperItem,
                      type: nextType,
                      category: nextType === "basket" ? "Baskets" : "Chocolates",
                      tag: nextType === "basket" ? "Custom Base" : "Popular",
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                >
                  <option value="basket">Hamper Base (Basket, Tray, Box)</option>
                  <option value="treat">Inside Product (Snack, Chocolate, Cake Item)</option>
                </select>
              </div>

              {/* Dynamic Sub-Dropdown Based on Role */}
              {newHamperItem.type === "basket" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Base Intended For
                  </label>
                  <select
                    value={newHamperItem.category_type}
                    onChange={(e) =>
                      setNewHamperItem({
                        ...newHamperItem,
                        category_type: e.target.value as "treats" | "cake",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="treats">General Treats & Chocolates Basket</option>
                    <option value="cake">Special Celebration Cake Hamper</option>
                  </select>
                  <p className="text-[11px] text-maroon/50 mt-1">
                    Selecting this registers a brand new base in the website's top base selector.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Product Destination Base
                  </label>
                  <select
                    value={newHamperItem.base_type}
                    onChange={(e) =>
                      setNewHamperItem({
                        ...newHamperItem,
                        base_type: e.target.value as "basket" | "cake",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="basket">Products for Basket Hampers (Chocolates & Snacks)</option>
                    <option value="cake">Cakes Only (For Celebration Cake Hampers)</option>
                  </select>
                </div>
              )}

              {/* Image Uploader */}
              <ImageUploader
                currentImageUrl={newHamperItem.image || ""}
                onImageUploaded={(url) =>
                  setNewHamperItem({ ...newHamperItem, image: url })
                }
                aspectHint={
                  newHamperItem.type === "basket"
                    ? "Transparent basket cutout photo"
                    : "Transparent snack/chocolate cutout"
                }
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder={
                    newHamperItem.type === "basket"
                      ? "e.g. Velvet Crimson Keepsake Box"
                      : "e.g. Ferrero Rocher 16pc Box"
                  }
                  value={newHamperItem.name}
                  onChange={(e) =>
                    setNewHamperItem({ ...newHamperItem, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={newHamperItem.price}
                    onChange={(e) =>
                      setNewHamperItem({
                        ...newHamperItem,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, Chocolate"
                    value={newHamperItem.tag}
                    onChange={(e) =>
                      setNewHamperItem({ ...newHamperItem, tag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Subtitle / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Artisanal hand-woven with high arch handle"
                  value={newHamperItem.subtitle}
                  onChange={(e) =>
                    setNewHamperItem({ ...newHamperItem, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setIsAddingHamperItem(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Add to Hamper Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT CUSTOM HAMPER ITEM                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {editingHamperItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingHamperItem(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              CUSTOM HAMPER Studio Editor
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Edit "{editingHamperItem.name}"
            </h3>

            <form onSubmit={handleSaveHamperItemEdit} className="space-y-4">
              {/* Image Uploader */}
              <ImageUploader
                currentImageUrl={editingHamperItem.image}
                onImageUploaded={(url) =>
                  setEditingHamperItem({ ...editingHamperItem, image: url })
                }
              />

              {/* Classification dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Item Classification
                </label>
                <select
                  value={editingHamperItem.type}
                  onChange={(e) =>
                    setEditingHamperItem({
                      ...editingHamperItem,
                      type: e.target.value as "basket" | "treat",
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                >
                  <option value="basket">Hamper Base (Basket, Tray, Box)</option>
                  <option value="treat">Inside Product (Snack, Chocolate, Cake Item)</option>
                </select>
              </div>

              {/* Context Dropdown */}
              {editingHamperItem.type === "basket" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Base Intended For
                  </label>
                  <select
                    value={editingHamperItem.category_type || "treats"}
                    onChange={(e) =>
                      setEditingHamperItem({
                        ...editingHamperItem,
                        category_type: e.target.value as "treats" | "cake",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="treats">General Treats & Chocolates Basket</option>
                    <option value="cake">Special Celebration Cake Hamper</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Product Destination Base
                  </label>
                  <select
                    value={editingHamperItem.base_type || "basket"}
                    onChange={(e) =>
                      setEditingHamperItem({
                        ...editingHamperItem,
                        base_type: e.target.value as "basket" | "cake",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="basket">Products for Basket Hampers (Chocolates & Snacks)</option>
                    <option value="cake">Cakes Only (For Celebration Cake Hampers)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editingHamperItem.name}
                  onChange={(e) =>
                    setEditingHamperItem({ ...editingHamperItem, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={editingHamperItem.price}
                    onChange={(e) =>
                      setEditingHamperItem({
                        ...editingHamperItem,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Tag / Pill
                  </label>
                  <input
                    type="text"
                    value={editingHamperItem.tag || ""}
                    onChange={(e) =>
                      setEditingHamperItem({
                        ...editingHamperItem,
                        tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Subtitle / Note
                </label>
                <input
                  type="text"
                  value={editingHamperItem.subtitle || ""}
                  onChange={(e) =>
                    setEditingHamperItem({
                      ...editingHamperItem,
                      subtitle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setEditingHamperItem(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Save Changes to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
