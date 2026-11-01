"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Package,
  PackageOpen,
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
  Gift,
  Save,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiMediaUploader, { MediaItem } from "@/components/admin/MultiMediaUploader";
import { DEFAULT_PACKAGES_LIST } from "@/components/PackagesShowcase";

interface AllProductRow {
  id: string;
  name: string;
  category_tag?: string;
  category: string;
  badge?: string;
  price: string;
  original_price?: string;
  rating?: number;
  reviews_count?: number;
  highlight?: string;
  image: string;
  whatsapp_message?: string;
  media_gallery?: MediaItem[];
  is_bestseller: boolean;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

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
  media_gallery?: MediaItem[];
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
  media_gallery?: MediaItem[];
  is_active: boolean;
  display_order: number;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

export interface PackageItemRow {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
}

export interface WeddingPackageRow {
  id: string;
  title: string;
  category_tag: string;
  price: number;
  original_price?: number;
  badge: string;
  highlight: string;
  description: string;
  images: string[];
  items: PackageItemRow[];
}

const DEFAULT_WEDDING_PACKAGE: WeddingPackageRow = DEFAULT_PACKAGES_LIST[0] as unknown as WeddingPackageRow;

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

  // Tabs: "all-products" | "bestsellers" | "featured-products" | "custom-hamper" | "image-sizing"
  const [activeTab, setActiveTab] = useState<
    "all-products" | "bestsellers" | "featured-products" | "custom-hamper" | "image-sizing"
  >("all-products");
  const [allProducts, setAllProducts] = useState<AllProductRow[]>([]);
  const [allProductsSearch, setAllProductsSearch] = useState("");
  const [allProductsCategoryFilter, setAllProductsCategoryFilter] = useState("all");
  const [editingAllProduct, setEditingAllProduct] = useState<AllProductRow | null>(null);
  const [isAddingAllProduct, setIsAddingAllProduct] = useState(false);
  const [newAllProduct, setNewAllProduct] = useState<Partial<AllProductRow>>({
    name: "",
    category_tag: "Signature Creation",
    category: "bouquets",
    badge: "Trending",
    price: "3,500",
    original_price: "",
    highlight: "",
    image: "",
    whatsapp_message: "",
    media_gallery: [],
    is_bestseller: false,
    is_featured: false,
    is_active: true,
  });

  const [bestsellers, setBestsellers] = useState<BestsellerRow[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductRow[]>([]);
  const [hamperItems, setHamperItems] = useState<HamperItemRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Visual Studio Sizing State
  const [sizingSection, setSizingSection] = useState<
    "all-products" | "bestsellers" | "featured-products" | "custom-hamper"
  >("all-products");
  const [sizingSearch, setSizingSearch] = useState("");
  const [showFramingGuides, setShowFramingGuides] = useState(true);

  // Modals for Add / Edit
  const [editingBestseller, setEditingBestseller] = useState<BestsellerRow | null>(null);
  const [isAddingBestseller, setIsAddingBestseller] = useState(false);

  const [editingFeaturedProduct, setEditingFeaturedProduct] = useState<FeaturedProductRow | null>(null);
  const [isAddingFeaturedProduct, setIsAddingFeaturedProduct] = useState(false);

  const [editingHamperItem, setEditingHamperItem] = useState<HamperItemRow | null>(null);
  const [isAddingHamperItem, setIsAddingHamperItem] = useState(false);
  const [weddingPackages, setWeddingPackages] = useState<WeddingPackageRow[]>(
    DEFAULT_PACKAGES_LIST as unknown as WeddingPackageRow[]
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>("pkg-baat-pakki");

  const weddingPackage =
    weddingPackages.find((p) => p.id === selectedPackageId) ||
    weddingPackages[0] ||
    (DEFAULT_PACKAGES_LIST[0] as unknown as WeddingPackageRow);

  const setWeddingPackage = (
    updater: WeddingPackageRow | ((prev: WeddingPackageRow) => WeddingPackageRow)
  ) => {
    setWeddingPackages((prevList) =>
      prevList.map((p) => {
        if (p.id === selectedPackageId) {
          return typeof updater === "function" ? updater(p) : updater;
        }
        return p;
      })
    );
  };
  const [editingWeddingItem, setEditingWeddingItem] = useState<PackageItemRow | null>(null);
  const [isSavingWeddingPkg, setIsSavingWeddingPkg] = useState(false);

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
    media_gallery: [],
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
    media_gallery: [],
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
      // 0. Fetch All Products
      const { data: apData, error: apErr } = await supabase
        .from("all_products")
        .select("*")
        .order("display_order", { ascending: true });

      if (!apErr && apData) {
        setAllProducts(apData as AllProductRow[]);
      }

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

      // 3. Fetch All Celebration Packages
      try {
        const { data: wpData, error: wpErr } = await supabase
          .from("wedding_packages")
          .select("*")
          .order("price", { ascending: false });

        if (!wpErr && wpData && wpData.length > 0) {
          setWeddingPackages(
            wpData.map((d: any) => ({
              id: d.id,
              title: d.title || "",
              category_tag: d.category_tag || "Celebration Suite",
              price: Number(d.price) || 0,
              original_price: d.original_price ? Number(d.original_price) : undefined,
              badge: d.badge || "Signature Package",
              highlight: d.highlight || "",
              description: d.description || "",
              images: Array.isArray(d.images) && d.images.length > 0 ? d.images : ["/images/packages/engagement-baat-pakki/baat-pakki-4.jpeg"],
              items: Array.isArray(d.items) ? d.items : [],
            }))
          );
        }
      } catch (err) {
        console.error("Could not fetch wedding_packages rows:", err);
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
  // ALL PRODUCTS CRUD & FEATURE TOGGLES
  // ═════════════════════════════════════════════════════════════════
  const filteredAllProducts = allProducts.filter((p) => {
    if (allProductsCategoryFilter !== "all" && p.category !== allProductsCategoryFilter) {
      return false;
    }
    if (!allProductsSearch.trim()) return true;
    const q = allProductsSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category_tag && p.category_tag.toLowerCase().includes(q)) ||
      (p.highlight && p.highlight.toLowerCase().includes(q))
    );
  });

  const handleToggleProductBestseller = async (product: AllProductRow) => {
    const nextState = !product.is_bestseller;
    setAllProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_bestseller: nextState } : p))
    );
    await supabase.from("all_products").update({ is_bestseller: nextState }).eq("id", product.id);

    if (nextState) {
      const itemToAdd: BestsellerRow = {
        id: product.id,
        name: product.name,
        category_tag: product.category_tag || "Signature Gift",
        category: product.category || "bouquets",
        badge: product.badge || "Bestseller",
        price: product.price,
        original_price: product.original_price,
        rating: product.rating || 5.0,
        reviews_count: product.reviews_count || 45,
        highlight: product.highlight || "Custom handcrafted arrangement with luxury wrappers and personalized wish card.",
        image: product.image,
        media_gallery: product.media_gallery || [],
        whatsapp_message: product.whatsapp_message || `Hi Gift Town! I want to order "${product.name}".`,
        is_active: product.is_active !== false,
        display_order: bestsellers.length + 1,
        image_scale: product.image_scale,
        image_position: product.image_position,
        image_offset_y: product.image_offset_y,
        image_offset_x: product.image_offset_x,
      };
      await supabase.from("featured_bestsellers").upsert([itemToAdd]);
      setBestsellers((prev) => {
        const idx = prev.findIndex((b) => b.id === product.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = itemToAdd;
          return updated;
        }
        return [...prev, itemToAdd];
      });
      showNotification(`Added "${product.name}" to Featured Best Sellers!`);
    } else {
      await supabase.from("featured_bestsellers").delete().eq("id", product.id);
      setBestsellers((prev) => prev.filter((b) => b.id !== product.id));
      showNotification(`Removed "${product.name}" from Featured Best Sellers (preserved in All Products)`);
    }
  };

  const handleToggleProductFeatured = async (product: AllProductRow) => {
    const nextState = !product.is_featured;
    setAllProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_featured: nextState } : p))
    );
    await supabase.from("all_products").update({ is_featured: nextState }).eq("id", product.id);

    if (nextState) {
      const itemToAdd: FeaturedProductRow = {
        id: product.id,
        name: product.name,
        category_tag: product.category_tag || "Boutique Creation",
        category: (product.category as any) || "bouquets",
        badge: product.badge || "Featured",
        price: product.price,
        original_price: product.original_price,
        rating: product.rating || 5.0,
        reviews_count: product.reviews_count || 45,
        highlight: product.highlight || "Custom handcrafted arrangement with luxury wrappers and personalized wish card.",
        image: product.image,
        media_gallery: product.media_gallery || [],
        whatsapp_message: product.whatsapp_message || `Hi Gift Town! I want to order "${product.name}".`,
        is_active: product.is_active !== false,
        display_order: featuredProducts.length + 1,
        image_scale: product.image_scale,
        image_position: product.image_position,
        image_offset_y: product.image_offset_y,
        image_offset_x: product.image_offset_x,
      };
      await supabase.from("featured_products").upsert([itemToAdd]);
      setFeaturedProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === product.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = itemToAdd;
          return updated;
        }
        return [...prev, itemToAdd];
      });
      showNotification(`Added "${product.name}" to Featured Products!`);
    } else {
      await supabase.from("featured_products").delete().eq("id", product.id);
      setFeaturedProducts((prev) => prev.filter((p) => p.id !== product.id));
      showNotification(`Removed "${product.name}" from Featured Products (preserved in All Products)`);
    }
  };

  const toggleAllProductActive = async (item: AllProductRow) => {
    const nextState = !item.is_active;
    setAllProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, is_active: nextState } : p))
    );
    await supabase.from("all_products").update({ is_active: nextState }).eq("id", item.id);
    if (item.is_bestseller) {
      await supabase.from("featured_bestsellers").update({ is_active: nextState }).eq("id", item.id);
      setBestsellers((prev) => prev.map((b) => (b.id === item.id ? { ...b, is_active: nextState } : b)));
    }
    if (item.is_featured) {
      await supabase.from("featured_products").update({ is_active: nextState }).eq("id", item.id);
      setFeaturedProducts((prev) => prev.map((f) => (f.id === item.id ? { ...f, is_active: nextState } : f)));
    }
    showNotification(`Updated visibility for "${item.name}"`);
  };

  const handleDeleteAllProduct = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}" from All Products? This will remove it from the entire store.`)) {
      return;
    }

    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    setBestsellers((prev) => prev.filter((b) => b.id !== id));
    setFeaturedProducts((prev) => prev.filter((f) => f.id !== id));

    await Promise.all([
      supabase.from("all_products").delete().eq("id", id),
      supabase.from("featured_bestsellers").delete().eq("id", id),
      supabase.from("featured_products").delete().eq("id", id),
    ]);

    showNotification(`Permanently deleted "${name}" from All Products`);
  };

  const handleCreateAllProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllProduct.name || !newAllProduct.price) {
      alert("Please provide product name and price");
      return;
    }

    const id = "prod-" + Date.now().toString().slice(-6);
    const itemToAdd: AllProductRow = {
      id,
      name: newAllProduct.name,
      category_tag: newAllProduct.category_tag || "Signature Gift",
      category: newAllProduct.category || "bouquets",
      badge: newAllProduct.badge || "Trending",
      price: newAllProduct.price,
      original_price: newAllProduct.original_price || undefined,
      rating: 5.0,
      reviews_count: 40,
      highlight:
        newAllProduct.highlight ||
        "Custom handcrafted arrangement with luxury wrappers and personalized wish card.",
      image: newAllProduct.image || "/images/products/heart-money-lights-bouquet.png",
      media_gallery: newAllProduct.media_gallery || [],
      whatsapp_message:
        newAllProduct.whatsapp_message ||
        `Hi Gift Town! I want to order '${newAllProduct.name}'.`,
      is_bestseller: !!newAllProduct.is_bestseller,
      is_featured: !!newAllProduct.is_featured,
      is_active: true,
      display_order: allProducts.length + 1,
    };

    setAllProducts((prev) => [...prev, itemToAdd]);
    setIsAddingAllProduct(false);

    const { error } = await supabase.from("all_products").insert([itemToAdd]);

    if (!error) {
      if (itemToAdd.is_bestseller) {
        await supabase.from("featured_bestsellers").insert([{
          ...itemToAdd,
          category: itemToAdd.category || "bouquets",
        }]);
        setBestsellers((prev) => [...prev, itemToAdd as unknown as BestsellerRow]);
      }
      if (itemToAdd.is_featured) {
        await supabase.from("featured_products").insert([{
          ...itemToAdd,
          category: (itemToAdd.category as any) || "bouquets",
        }]);
        setFeaturedProducts((prev) => [...prev, itemToAdd as unknown as FeaturedProductRow]);
      }

      showNotification(`Added "${itemToAdd.name}" to All Products!`);
      setNewAllProduct({
        name: "",
        category_tag: "Signature Bouquet",
        category: "bouquets",
        badge: "Trending",
        price: "4,500",
        original_price: "",
        highlight: "",
        image: "",
        whatsapp_message: "",
        media_gallery: [],
        is_bestseller: false,
        is_featured: false,
        is_active: true,
      });
    } else {
      console.error(error);
      alert("Failed to add product: " + error.message);
      fetchDashboardData();
    }
  };

  const handleSaveAllProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAllProduct) return;

    setAllProducts((prev) =>
      prev.map((p) => (p.id === editingAllProduct.id ? editingAllProduct : p))
    );

    const { error } = await supabase
      .from("all_products")
      .update({
        name: editingAllProduct.name,
        price: editingAllProduct.price,
        original_price: editingAllProduct.original_price,
        badge: editingAllProduct.badge,
        category: editingAllProduct.category,
        category_tag: editingAllProduct.category_tag,
        highlight: editingAllProduct.highlight,
        image: editingAllProduct.image,
        media_gallery: editingAllProduct.media_gallery || [],
        whatsapp_message: editingAllProduct.whatsapp_message,
        is_bestseller: editingAllProduct.is_bestseller,
        is_featured: editingAllProduct.is_featured,
      })
      .eq("id", editingAllProduct.id);

    // Sync to featured_bestsellers
    if (editingAllProduct.is_bestseller) {
      await supabase.from("featured_bestsellers").upsert([{
        id: editingAllProduct.id,
        name: editingAllProduct.name,
        price: editingAllProduct.price,
        original_price: editingAllProduct.original_price,
        badge: editingAllProduct.badge,
        category: editingAllProduct.category,
        category_tag: editingAllProduct.category_tag,
        highlight: editingAllProduct.highlight,
        image: editingAllProduct.image,
        media_gallery: editingAllProduct.media_gallery || [],
        whatsapp_message: editingAllProduct.whatsapp_message,
        is_active: editingAllProduct.is_active,
        display_order: editingAllProduct.display_order,
      }]);
    } else {
      await supabase.from("featured_bestsellers").delete().eq("id", editingAllProduct.id);
      setBestsellers((prev) => prev.filter((b) => b.id !== editingAllProduct.id));
    }

    // Sync to featured_products
    if (editingAllProduct.is_featured) {
      await supabase.from("featured_products").upsert([{
        id: editingAllProduct.id,
        name: editingAllProduct.name,
        price: editingAllProduct.price,
        original_price: editingAllProduct.original_price,
        badge: editingAllProduct.badge,
        category: editingAllProduct.category as any,
        category_tag: editingAllProduct.category_tag,
        highlight: editingAllProduct.highlight,
        image: editingAllProduct.image,
        media_gallery: editingAllProduct.media_gallery || [],
        whatsapp_message: editingAllProduct.whatsapp_message,
        is_active: editingAllProduct.is_active,
        display_order: editingAllProduct.display_order,
      }]);
    } else {
      await supabase.from("featured_products").delete().eq("id", editingAllProduct.id);
      setFeaturedProducts((prev) => prev.filter((f) => f.id !== editingAllProduct.id));
    }

    if (!error) {
      showNotification(`Saved changes for "${editingAllProduct.name}"!`);
      setEditingAllProduct(null);
    } else {
      alert("Failed to save changes: " + error.message);
    }
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
      media_gallery: newBestseller.media_gallery || [],
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
        media_gallery: [],
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
        media_gallery: editingBestseller.media_gallery || [],
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
    if (!confirm(`Remove "${name}" from Featured Best Sellers? It will remain available in All Products.`)) {
      return;
    }

    setBestsellers((prev) => prev.filter((b) => b.id !== id));
    const { error } = await supabase.from("featured_bestsellers").delete().eq("id", id);
    await supabase.from("all_products").update({ is_bestseller: false }).eq("id", id);
    setAllProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_bestseller: false } : p)));

    if (!error) {
      showNotification(`Removed "${name}" from Featured Best Sellers (preserved in All Products)`);
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
      media_gallery: newFeaturedProduct.media_gallery || [],
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
        media_gallery: [],
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
        media_gallery: editingFeaturedProduct.media_gallery || [],
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
    if (!confirm(`Remove "${name}" from Featured Products? It will remain available in All Products.`)) {
      return;
    }

    setFeaturedProducts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("featured_products").delete().eq("id", id);
    await supabase.from("all_products").update({ is_featured: false }).eq("id", id);
    setAllProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_featured: false } : p)));

    if (!error) {
      showNotification(`Removed "${name}" from Featured Products (preserved in All Products)`);
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
  // WEDDING PACKAGE (BAAT PAKKI) & INDIVIDUAL ITEMS CRUD
  // ═════════════════════════════════════════════════════════════════
  const handleSaveWeddingPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingPackage) return;
    setIsSavingWeddingPkg(true);

    try {
      const { error } = await supabase
        .from("wedding_packages")
        .update({
          title: weddingPackage.title,
          category_tag: weddingPackage.category_tag,
          price: Number(weddingPackage.price),
          original_price: weddingPackage.original_price ? Number(weddingPackage.original_price) : null,
          badge: weddingPackage.badge,
          highlight: weddingPackage.highlight,
          description: weddingPackage.description,
          items: weddingPackage.items,
        })
        .eq("id", weddingPackage.id);

      if (!error) {
        showNotification(`Saved "${weddingPackage.title}" & individual item prices!`);
      } else {
        alert("Failed to save wedding package: " + error.message);
      }
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setIsSavingWeddingPkg(false);
    }
  };

    const handleSaveWeddingItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeddingItem || !weddingPackage) return;

    const updatedItems = weddingPackage.items.map((it) =>
      it.id === editingWeddingItem.id ? editingWeddingItem : it
    );

    const updatedPkg = { ...weddingPackage, items: updatedItems };
    setWeddingPackage(updatedPkg);

    try {
      const { error } = await supabase
        .from("wedding_packages")
        .update({ items: updatedItems })
        .eq("id", weddingPackage.id);

      if (!error) {
        showNotification(`Saved "${editingWeddingItem.name}" live to website!`);
        setEditingWeddingItem(null);
      } else {
        alert("Failed to save piece: " + error.message);
      }
    } catch (err: any) {
      alert("Error saving piece: " + err.message);
    }
  };

  const handleQuickItemPriceChange = async (itemId: string, newPrice: number) => {
    if (!weddingPackage) return;
    const updatedItems = weddingPackage.items.map((it) =>
      it.id === itemId ? { ...it, price: newPrice } : it
    );
    setWeddingPackage({ ...weddingPackage, items: updatedItems });

    try {
      const { error } = await supabase
        .from("wedding_packages")
        .update({ items: updatedItems })
        .eq("id", weddingPackage.id);
      if (!error) {
        showNotification("Price updated live!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateWeddingItem = (itemId: string, field: keyof PackageItemRow, val: any) => {
    if (!weddingPackage) return;
    setWeddingPackage({
      ...weddingPackage,
      items: weddingPackage.items.map((it) =>
        it.id === itemId ? { ...it, [field]: field === "price" ? (val === "" ? 0 : Number(val)) : val } : it
      ),
    });
  };

  // ═════════════════════════════════════════════════════════════════
  // VISUAL STUDIO / IMAGE SIZING & FRAMING HANDLER
  // ═════════════════════════════════════════════════════════════════
  const handleUpdateImageSizing = async (
    section: "all-products" | "bestsellers" | "featured-products" | "custom-hamper",
    id: string,
    updates: {
      image_scale?: number;
      image_position?: string;
      image_offset_y?: number;
      image_offset_x?: number;
    }
  ) => {
    if (section === "all-products") {
      setAllProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      await supabase.from("all_products").update(updates).eq("id", id);
      await supabase.from("featured_bestsellers").update(updates).eq("id", id);
      await supabase.from("featured_products").update(updates).eq("id", id);
    } else if (section === "bestsellers") {
      setBestsellers((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      await supabase.from("featured_bestsellers").update(updates).eq("id", id);
      await supabase.from("all_products").update(updates).eq("id", id);
    } else if (section === "featured-products") {
      setFeaturedProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      await supabase.from("featured_products").update(updates).eq("id", id);
      await supabase.from("all_products").update(updates).eq("id", id);
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
            {/* 0. All Products Master Tab */}
            <button
              onClick={() => setActiveTab("all-products")}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "all-products"
                  ? "bg-rose text-white shadow-md scale-102"
                  : "bg-white text-maroon/70 hover:text-maroon border border-rose/15 hover:border-rose/30"
              }`}
            >
              <PackageOpen className="w-4 h-4" />
              <span>All Products</span>
              <span className="ml-1 text-[10px] bg-black/15 px-2 py-0.5 rounded-full">
                {allProducts.length}
              </span>
            </button>

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

            {/* 3. WEDDING PACKAGES Tab */}
            <button
              onClick={() => setActiveTab("custom-hamper")}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "custom-hamper"
                  ? "bg-rose text-white shadow-md scale-102"
                  : "bg-white text-maroon/70 hover:text-maroon border border-rose/15 hover:border-rose/30"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Wedding Packages</span>
              <span className="ml-1 text-[10px] bg-black/15 px-2 py-0.5 rounded-full">
                {weddingPackage?.items?.length || 10} Pieces
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
          {activeTab === "all-products" && (
            <button
              type="button"
              onClick={() => {
                setNewAllProduct({
                  name: "",
                  category_tag: "Signature Creation",
                  category: "bouquets",
                  badge: "Trending",
                  price: "3,500",
                  original_price: "",
                  highlight: "",
                  image: "",
                  whatsapp_message: "",
                  media_gallery: [],
                  is_bestseller: false,
                  is_featured: false,
                  is_active: true,
                });
                setIsAddingAllProduct(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer transition-transform hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}

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
              type="button"
              onClick={handleSaveWeddingPackage}
              disabled={isSavingWeddingPkg || !weddingPackage}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-102 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingWeddingPkg ? "Saving..." : "Save Wedding Package"}</span>
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
        {/* OPTION 0: ALL PRODUCTS MASTER CATALOG                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "all-products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-display font-black text-xl text-maroon flex items-center gap-2">
                  <PackageOpen className="w-5 h-5 text-rose" />
                  <span>All Products Catalog ({allProducts.length})</span>
                </h3>
                <p className="font-body text-xs text-maroon/70">
                  Master catalog of all gifts &amp; products across the website. Easily feature any product in Best Sellers or Featured Products, or remove it while keeping it in the store.
                </p>
              </div>

              {/* Action buttons & Search */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setNewAllProduct({
                      name: "",
                      category_tag: "Signature Creation",
                      category: "bouquets",
                      badge: "Trending",
                      price: "3,500",
                      original_price: "",
                      highlight: "",
                      image: "",
                      whatsapp_message: "",
                      media_gallery: [],
                      is_bestseller: false,
                      is_featured: false,
                      is_active: true,
                    });
                    setIsAddingAllProduct(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer transition-transform hover:scale-102"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-maroon/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search all products..."
                    value={allProductsSearch}
                    onChange={(e) => setAllProductsSearch(e.target.value)}
                    className="pl-9 pr-3.5 py-2 rounded-xl bg-white border border-rose/20 text-maroon text-xs font-medium placeholder:text-maroon/40 focus:outline-none focus:border-rose shadow-2xs w-48 sm:w-64"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-rose/15 shadow-2xs">
                  {[
                    { id: "all", label: "All" },
                    { id: "bouquets", label: "Bouquets" },
                    { id: "hampers", label: "Hampers" },
                    { id: "boxes", label: "Boxes" },
                    { id: "chocolates", label: "Chocolates" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setAllProductsCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        allProductsCategoryFilter === cat.id
                          ? "bg-rose text-white shadow-xs"
                          : "text-maroon/70 hover:text-maroon hover:bg-rose/5"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAllProducts.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-[32px] p-5 border transition-all flex flex-col justify-between ${
                    item.is_active
                      ? "border-rose/25 shadow-xs"
                      : "border-neutral-200 opacity-60 bg-neutral-50/50"
                  }`}
                >
                  <div>
                    {/* Visual Photo Window */}
                    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#fdf2f4] to-white rounded-2xl overflow-hidden mb-4 p-3 flex items-center justify-center border border-rose/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="240px"
                        className="object-contain p-2"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-rose text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        {item.badge || "Product"}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold text-maroon/60 bg-white/90 px-2 py-0.5 rounded-full border border-rose/15">
                        {item.category_tag || item.category}
                      </span>
                    </div>

                    {/* Price & Name */}
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

                    <p className="font-body text-xs text-maroon/70 mt-1 line-clamp-2 leading-relaxed">
                      {item.highlight || "Handcrafted creation for celebrations and gifting."}
                    </p>

                    {/* ── SECTION PLACEMENT CONTROLS ── */}
                    <div className="mt-4 bg-[#fff8f9] rounded-2xl p-3 border border-rose/15 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-maroon/50">
                        Feature Placement in Storefront:
                      </div>

                      {/* Best Sellers Toggle */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-bold text-maroon flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-rose" />
                          <span>Featured Best Sellers</span>
                        </span>
                        <button
                          onClick={() => handleToggleProductBestseller(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            item.is_bestseller
                              ? "bg-rose text-white shadow-2xs hover:bg-rose/90"
                              : "bg-white text-maroon/70 border border-rose/25 hover:border-rose hover:text-rose hover:bg-rose/5"
                          }`}
                        >
                          {item.is_bestseller ? "✓ In Best Sellers (Remove)" : "+ Add to Best Sellers"}
                        </button>
                      </div>

                      {/* Featured Products Toggle */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-rose/10">
                        <span className="font-bold text-maroon flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Featured Products</span>
                        </span>
                        <button
                          onClick={() => handleToggleProductFeatured(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            item.is_featured
                              ? "bg-amber-500 text-white shadow-2xs hover:bg-amber-600"
                              : "bg-white text-maroon/70 border border-rose/25 hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50/50"
                          }`}
                        >
                          {item.is_featured ? "✓ In Featured (Remove)" : "+ Add to Featured"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-rose/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleAllProductActive(item)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        item.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-600 border-neutral-300"
                      }`}
                    >
                      {item.is_active ? "Visible in Store" : "Hidden"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAllProduct({
                            ...item,
                            media_gallery: Array.isArray(item.media_gallery) ? item.media_gallery : [],
                            category: item.category || "bouquets",
                            badge: item.badge || "",
                            category_tag: item.category_tag || "",
                            highlight: item.highlight || "",
                            original_price: item.original_price || "",
                          });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fdf2f4] hover:bg-rose hover:text-white text-rose font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAllProduct(item.id, item.name);
                        }}
                        title="Delete product permanently"
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
        {/* OPTION 3: WEDDING & CELEBRATION PACKAGES                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "custom-hamper" && (
          <div className="space-y-8">
            
              <>
                {/* ── 0. PACKAGE SELECTOR TABS ── */}
                <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-rose/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose/10 text-rose">
                        <Package className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-maroon">
                        Select Celebration Package to Edit ({weddingPackages.length} Total):
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-maroon/60 hidden sm:inline-block">
                      Click any package to switch between weddings, birthday suites &amp; midnight surprises
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {weddingPackages.map((pkg) => {
                      const isSelected = pkg.id === selectedPackageId;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                            isSelected
                              ? "bg-rose text-white border-rose shadow-md scale-[1.01]"
                              : "bg-[#fdf2f4] hover:bg-white text-maroon border-rose/15 hover:border-rose/30"
                          }`}
                        >
                          <div>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${
                                isSelected ? "text-white/80" : "text-rose"
                              }`}
                            >
                              {pkg.category_tag}
                            </span>
                            <h5 className="font-serif font-bold text-xs line-clamp-1">
                              {pkg.title}
                            </h5>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-black/10 flex items-center justify-between">
                            <span className="font-display font-black text-xs">
                              PKR {pkg.price.toLocaleString()}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isSelected ? "bg-white/20 text-white" : "bg-white text-maroon/70"
                              }`}
                            >
                              {pkg.items.length} items
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── 1. SUITE MASTER SETTINGS CARD ── */}
                <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-rose/20 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-rose/15">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-2 rounded-xl bg-[#fdf2f4] text-rose">
                          <Gift className="w-5 h-5" />
                        </span>
                        <h3 className="font-display font-black text-xl sm:text-2xl text-maroon">
                          {weddingPackage.title}
                        </h3>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-maroon/70">
                        Manage master package bundle settings and individual piece prices. Changes are saved live to the database.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveWeddingPackage}
                      disabled={isSavingWeddingPkg}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingWeddingPkg ? "Saving to Database..." : "Save Suite Details"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                        Suite Title
                      </label>
                      <input
                        type="text"
                        value={weddingPackage.title}
                        onChange={(e) =>
                          setWeddingPackage({ ...weddingPackage, title: e.target.value })
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
                        value={weddingPackage.category_tag}
                        onChange={(e) =>
                          setWeddingPackage({ ...weddingPackage, category_tag: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                        Complete Bundle Price (PKR)
                      </label>
                      <input
                        type="number"
                        value={weddingPackage.price}
                        onChange={(e) =>
                          setWeddingPackage({
                            ...weddingPackage,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                        Original Crossed Price (PKR)
                      </label>
                      <input
                        type="number"
                        value={weddingPackage.original_price || ""}
                        placeholder="85000"
                        onChange={(e) =>
                          setWeddingPackage({
                            ...weddingPackage,
                            original_price: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                      Suite Highlight Subtitle
                    </label>
                    <input
                      type="text"
                      value={weddingPackage.highlight}
                      onChange={(e) =>
                        setWeddingPackage({ ...weddingPackage, highlight: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                    />
                  </div>

                  {/* Pricing Balance Summary */}
                  <div className="p-4 rounded-2xl bg-[#fdf2f4] border border-rose/20 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-maroon/60">
                          Complete Bundle Price
                        </span>
                        <span className="font-display font-black text-xl text-maroon">
                          PKR {Number(weddingPackage.price).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-l border-rose/25 pl-6">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-maroon/60">
                          Sum of {weddingPackage.items.length} Individual Pieces
                        </span>
                        <span className="font-display font-black text-xl text-maroon">
                          PKR{" "}
                          {weddingPackage.items
                            .reduce((sum, it) => sum + (it.price || 0), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-body text-maroon/80 font-medium">
                      Note: Customers who pick all items get the bundle price. Customers who pick individual pieces pay the exact sum of chosen items.
                    </div>
                  </div>
                </div>

                {/* ── 2. INDIVIDUAL PIECES ("PICK & CHOOSE") ── */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-display font-black text-xl text-maroon">
                        Individual Pieces for &quot;Pick &amp; Choose&quot; ({weddingPackage.items.length} Products)
                      </h4>
                      <p className="font-body text-xs sm:text-sm text-maroon/70">
                        These are the actual ceremonial items shown on the storefront. Click &quot;Edit Piece&quot; on any card to update its photo, title, price, or description.
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose/10 text-rose border border-rose/20 self-start sm:self-auto">
                      All {weddingPackage.items.length} Items Live
                    </span>
                  </div>

                  {/* 10 Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {weddingPackage.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-[28px] border border-rose/20 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-rose/35"
                      >
                        <div>
                          {/* Image with Piece Badge */}
                          <div className="relative w-full h-52 bg-[#fdf2f4] overflow-hidden border-b border-rose/10 group">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 360px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-maroon border border-white/60 shadow-xs">
                              Piece #{idx + 1}
                            </span>

                            <span className="absolute bottom-3 left-3 font-display font-black text-lg text-white drop-shadow-md">
                              PKR {Number(item.price).toLocaleString()}
                            </span>
                          </div>

                          {/* Item Details */}
                          <div className="p-5 space-y-2">
                            <h5 className="font-serif font-bold text-base text-maroon leading-snug">
                              {item.name}
                            </h5>

                            <p className="font-body text-xs text-maroon/70 line-clamp-3 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Actions & Quick Price Editor */}
                        <div className="p-4 pt-0 space-y-3">
                          <div className="pt-3 border-t border-rose/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-maroon/50 whitespace-nowrap">
                                Quick Price:
                              </span>
                              <input
                                type="number"
                                defaultValue={item.price}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (val !== item.price && !isNaN(val)) {
                                    handleQuickItemPriceChange(item.id, val);
                                  }
                                }}
                                className="w-24 px-2.5 py-1 rounded-lg bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-xs focus:outline-none focus:border-rose focus:bg-white"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => setEditingWeddingItem(item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fdf2f4] hover:bg-rose hover:text-white text-rose font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Piece</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
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
                  <option value="all-products">
                    All Products Catalog ({allProducts.length} items)
                  </option>
                  <option value="bestsellers">
                    Featured Best Sellers ({bestsellers.length} items)
                  </option>
                  <option value="featured-products">
                    Featured Products Catalog ({featuredProducts.length} items)
                  </option>
                  <option value="custom-hamper">
                    Custom Hamper Studio ({hamperItems.length} items)
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
              {(sizingSection === "all-products"
                ? allProducts
                : sizingSection === "bestsellers"
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
      {/* MODAL: ADD NEW ALL-PRODUCT                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isAddingAllProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddingAllProduct(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Master Catalog
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Add New Product to Store
            </h3>

            <form onSubmit={handleCreateAllProduct} className="space-y-4">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Cover Photo (Primary Showcase)
                </label>
                <ImageUploader
                  currentImageUrl={newAllProduct.image || ""}
                  onImageUploaded={(url) =>
                    setNewAllProduct({ ...newAllProduct, image: url })
                  }
                  aspectHint="Primary cover image displayed on cards and search"
                />
              </div>

              {/* Secondary Media Gallery (Images & Videos) */}
              <MultiMediaUploader
                media={newAllProduct.media_gallery || []}
                onChange={(gallery) =>
                  setNewAllProduct({ ...newAllProduct, media_gallery: gallery })
                }
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heart-Shaped Money & Lights Bouquet"
                  value={newAllProduct.name || ""}
                  onChange={(e) =>
                    setNewAllProduct({ ...newAllProduct, name: e.target.value })
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
                    value={newAllProduct.price || ""}
                    onChange={(e) =>
                      setNewAllProduct({ ...newAllProduct, price: e.target.value })
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
                    value={newAllProduct.original_price || ""}
                    onChange={(e) =>
                      setNewAllProduct({
                        ...newAllProduct,
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
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Bouquet, Treat Box"
                    value={newAllProduct.category_tag || ""}
                    onChange={(e) =>
                      setNewAllProduct({ ...newAllProduct, category_tag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Filter Category
                  </label>
                  <select
                    value={newAllProduct.category || "bouquets"}
                    onChange={(e) =>
                      setNewAllProduct({ ...newAllProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="bouquets">Bouquets</option>
                    <option value="hampers">Hampers</option>
                    <option value="boxes">Gift Boxes</option>
                    <option value="chocolates">Chocolates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Badge Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bestseller, Trending, Romantic"
                  value={newAllProduct.badge || ""}
                  onChange={(e) =>
                    setNewAllProduct({ ...newAllProduct, badge: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Highlight / Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what makes this product special..."
                  value={newAllProduct.highlight || ""}
                  onChange={(e) =>
                    setNewAllProduct({ ...newAllProduct, highlight: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              {/* Placement Checkboxes */}
              <div className="bg-[#fff8f9] rounded-2xl p-4 border border-rose/20 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon">
                  Feature In Homepage Sections:
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-maroon">
                    <input
                      type="checkbox"
                      checked={!!newAllProduct.is_bestseller}
                      onChange={(e) =>
                        setNewAllProduct({ ...newAllProduct, is_bestseller: e.target.checked })
                      }
                      className="w-4 h-4 text-rose accent-rose rounded"
                    />
                    <span>Featured Best Sellers</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-maroon">
                    <input
                      type="checkbox"
                      checked={!!newAllProduct.is_featured}
                      onChange={(e) =>
                        setNewAllProduct({ ...newAllProduct, is_featured: e.target.checked })
                      }
                      className="w-4 h-4 text-rose accent-rose rounded"
                    />
                    <span>Featured Products</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setIsAddingAllProduct(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Save to All Products
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT ALL PRODUCT                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {editingAllProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingAllProduct(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Master Product Editor
            </span>

            <h3 className="font-display font-black text-2xl text-maroon mt-2 mb-5">
              Edit "{editingAllProduct.name}"
            </h3>

            <form onSubmit={handleSaveAllProductEdit} className="space-y-4">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Cover Photo (Primary Showcase)
                </label>
                <ImageUploader
                  currentImageUrl={editingAllProduct?.image || ""}
                  onImageUploaded={(url) =>
                    setEditingAllProduct({ ...editingAllProduct, image: url })
                  }
                />
              </div>

              {/* Secondary Media Gallery (Images & Videos) */}
              <MultiMediaUploader
                media={Array.isArray(editingAllProduct?.media_gallery) ? editingAllProduct.media_gallery : []}
                onChange={(gallery) =>
                  setEditingAllProduct({ ...editingAllProduct, media_gallery: gallery })
                }
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingAllProduct?.name || ""}
                  onChange={(e) =>
                    setEditingAllProduct({ ...editingAllProduct, name: e.target.value })
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
                    value={editingAllProduct?.price || ""}
                    onChange={(e) =>
                      setEditingAllProduct({ ...editingAllProduct, price: e.target.value })
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
                    value={editingAllProduct?.original_price || ""}
                    onChange={(e) =>
                      setEditingAllProduct({
                        ...editingAllProduct,
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
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingAllProduct?.category_tag || ""}
                    onChange={(e) =>
                      setEditingAllProduct({ ...editingAllProduct, category_tag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                    Filter Category
                  </label>
                  <select
                    value={editingAllProduct?.category || "bouquets"}
                    onChange={(e) =>
                      setEditingAllProduct({ ...editingAllProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white cursor-pointer"
                  >
                    <option value="bouquets">Bouquets</option>
                    <option value="hampers">Hampers</option>
                    <option value="boxes">Gift Boxes</option>
                    <option value="chocolates">Chocolates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={editingAllProduct?.badge || ""}
                  onChange={(e) =>
                    setEditingAllProduct({ ...editingAllProduct, badge: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product Highlight / Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingAllProduct?.highlight || ""}
                  onChange={(e) =>
                    setEditingAllProduct({ ...editingAllProduct, highlight: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                />
              </div>

              {/* Placement Checkboxes */}
              <div className="bg-[#fff8f9] rounded-2xl p-4 border border-rose/20 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon">
                  Feature In Homepage Sections:
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-maroon">
                    <input
                      type="checkbox"
                      checked={!!editingAllProduct?.is_bestseller}
                      onChange={(e) =>
                        setEditingAllProduct({ ...editingAllProduct, is_bestseller: e.target.checked })
                      }
                      className="w-4 h-4 text-rose accent-rose rounded"
                    />
                    <span>Featured Best Sellers</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-maroon">
                    <input
                      type="checkbox"
                      checked={!!editingAllProduct?.is_featured}
                      onChange={(e) =>
                        setEditingAllProduct({ ...editingAllProduct, is_featured: e.target.checked })
                      }
                      className="w-4 h-4 text-rose accent-rose rounded"
                    />
                    <span>Featured Products</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setEditingAllProduct(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Cover Photo (Primary Showcase)
                </label>
                <ImageUploader
                  currentImageUrl={newBestseller.image || ""}
                  onImageUploaded={(url) =>
                    setNewBestseller({ ...newBestseller, image: url })
                  }
                  aspectHint="Primary cover image displayed on cards and search"
                />
              </div>

              {/* Secondary Media Gallery (Images & Videos) */}
              <MultiMediaUploader
                media={newBestseller.media_gallery || []}
                onChange={(gallery) =>
                  setNewBestseller({ ...newBestseller, media_gallery: gallery })
                }
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
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Cover Photo (Primary Showcase)
                </label>
                <ImageUploader
                  currentImageUrl={editingBestseller.image}
                  onImageUploaded={(url) =>
                    setEditingBestseller({ ...editingBestseller, image: url })
                  }
                />
              </div>

              {/* Secondary Media Gallery (Images & Videos) */}
              <MultiMediaUploader
                media={editingBestseller.media_gallery || []}
                onChange={(gallery) =>
                  setEditingBestseller({ ...editingBestseller, media_gallery: gallery })
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
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Cover Photo (Primary Showcase)
                </label>
                <ImageUploader
                  currentImageUrl={newFeaturedProduct.image || ""}
                  onImageUploaded={(url) =>
                    setNewFeaturedProduct({ ...newFeaturedProduct, image: url })
                  }
                  aspectHint="Primary cover image displayed on cards"
                />
              </div>

              {/* Secondary Media Gallery (Images & Videos) */}
              <MultiMediaUploader
                media={newFeaturedProduct.media_gallery || []}
                onChange={(gallery) =>
                  setNewFeaturedProduct({ ...newFeaturedProduct, media_gallery: gallery })
                }
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
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Cover Photo (Primary Showcase)
                </label>
                <ImageUploader
                  currentImageUrl={editingFeaturedProduct.image}
                  onImageUploaded={(url) =>
                    setEditingFeaturedProduct({ ...editingFeaturedProduct, image: url })
                  }
                />
              </div>

              {/* Secondary Media Gallery (Images & Videos) */}
              <MultiMediaUploader
                media={editingFeaturedProduct.media_gallery || []}
                onChange={(gallery) =>
                  setEditingFeaturedProduct({ ...editingFeaturedProduct, media_gallery: gallery })
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT WEDDING CEREMONIAL PIECE & PHOTO                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {editingWeddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-[36px] p-7 sm:p-9 border border-rose/25 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingWeddingItem(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#fdf2f4] text-maroon hover:text-rose flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-3 py-1 rounded-full">
              Wedding Package &bull; Ceremonial Piece Editor
            </span>

            <h3 className="font-serif font-black text-2xl text-maroon mt-2 mb-5">
              Edit "{editingWeddingItem.name}"
            </h3>

            <form onSubmit={handleSaveWeddingItemEdit} className="space-y-4">
              {/* Product Photo with ImageUploader */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Piece Photo
                </label>
                <ImageUploader
                  currentImageUrl={editingWeddingItem.image}
                  onImageUploaded={(url) =>
                    setEditingWeddingItem({ ...editingWeddingItem, image: url })
                  }
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Product / Piece Title
                </label>
                <input
                  type="text"
                  value={editingWeddingItem.name}
                  onChange={(e) =>
                    setEditingWeddingItem({ ...editingWeddingItem, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-semibold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  value={editingWeddingItem.price}
                  onChange={(e) =>
                    setEditingWeddingItem({
                      ...editingWeddingItem,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon font-bold text-sm focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              {/* Inclusions & Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70 mb-1.5">
                  Inclusions &amp; Piece Details (Shown in Quick Inspect)
                </label>
                <textarea
                  rows={4}
                  value={editingWeddingItem.description}
                  onChange={(e) =>
                    setEditingWeddingItem({ ...editingWeddingItem, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f9] border border-rose/20 text-maroon text-xs leading-relaxed focus:outline-none focus:border-rose focus:bg-white"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setEditingWeddingItem(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon/60 hover:text-maroon cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Save &amp; Update Live on Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
