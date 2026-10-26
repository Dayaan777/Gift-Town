"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Grid3X3,
  Film,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  ExternalLink,
  Play,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

// Inline Instagram Icon for 100% authentic branding
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// Real highlights from screenshot
const HIGHLIGHTS = [
  { id: "h1", name: "bouquet 🥀🍫", emoji: "🥀🍫" },
  { id: "h2", name: "Fresh flowers", emoji: "🌸" },
  { id: "h3", name: "flower bouquet", emoji: "💐" },
  { id: "h4", name: "Bouquets", emoji: "🎀" },
  { id: "h5", name: "orders", emoji: "📦" },
  { id: "h6", name: "baskets", emoji: "🧺" },
  { id: "h7", name: "money bouq...", emoji: "💵" },
];

// Real Posts from user's provided images
const POSTS_DATA = [
  {
    id: "post-1",
    image: "/images/insta/posts/post-1.jpg",
    caption: "Boutique Floral Arrangement & Chocolates",
    likes: "482",
    comments: "31",
    tag: "Floral Gift",
  },
  {
    id: "post-2",
    image: "/images/insta/posts/post-2.webp",
    caption: "Eid Mubarak Luxury Keepsake Basket",
    likes: "594",
    comments: "46",
    tag: "Eid Basket",
  },
  {
    id: "post-3",
    image: "/images/insta/posts/post-3.jpg",
    caption: "Teacher's Day & Special Floral Blossom",
    likes: "437",
    comments: "28",
    tag: "Fresh Roses",
  },
  {
    id: "post-4",
    image: "/images/insta/posts/post-4.jpg",
    caption: "Birthday Surprise For Wife With Love",
    likes: "612",
    comments: "54",
    tag: "Wife Birthday",
  },
  {
    id: "post-5",
    image: "/images/insta/posts/post-5.jpg",
    caption: "Snacks & Chocolates Love Bouquet",
    likes: "518",
    comments: "39",
    tag: "Snack Bouquet",
  },
  {
    id: "post-6",
    image: "/images/insta/posts/post-6.jpg",
    caption: "Midnight Doorstep Surprise For Him",
    likes: "475",
    comments: "33",
    tag: "12AM Surprise",
  },
];

// Real Reels from user's provided videos
const REELS_DATA = [
  {
    id: "reel-1",
    video: "/images/insta/reels/reel-1.mp4",
    poster: "/images/insta/reels/posters/poster-1.jpg",
    caption: "Candy Bouquet 🍬 Nationwide Delivery",
    views: "22.4k",
    likes: "740",
    comments: "58",
  },
  {
    id: "reel-2",
    video: "/images/insta/reels/reel-2.mp4",
    poster: "/images/insta/reels/posters/poster-2.jpg",
    caption: "Deluxe Keepsake Gift Basket Unboxing",
    views: "34.1k",
    likes: "982",
    comments: "81",
  },
  {
    id: "reel-3",
    video: "/images/insta/reels/reel-3.mp4",
    poster: "/images/insta/reels/posters/poster-3.jpg",
    caption: "Snack Bouquet 💐 All Over Pakistan",
    views: "19.8k",
    likes: "615",
    comments: "42",
  },
  {
    id: "reel-4",
    video: "/images/insta/reels/reel-4.mp4",
    poster: "/images/insta/reels/posters/poster-4.jpg",
    caption: "Surprise Cake Box 🫶🏻 Thatta & Makli",
    views: "28.6k",
    likes: "830",
    comments: "64",
  },
  {
    id: "reel-5",
    video: "/images/insta/reels/reel-5.mp4",
    poster: "/images/insta/reels/posters/poster-5.jpg",
    caption: "Tag Him / Her 💗 Handmade Bouquet",
    views: "41.2k",
    likes: "1.2k",
    comments: "112",
  },
  {
    id: "reel-6",
    video: "/images/insta/reels/reel-6.mp4",
    poster: "/images/insta/reels/posters/poster-6.jpg",
    caption: "Acrylic Keepsake Gift Box 🫠💗",
    views: "26.7k",
    likes: "790",
    comments: "53",
  },
];

export default function GallerySection() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
  const [activeVideoModal, setActiveVideoModal] = useState<typeof REELS_DATA[0] | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <section className="relative py-16 sm:py-24 bg-[#fce3e0] overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-rose/20 shadow-xs mb-4">
            <InstagramIcon className="w-3.5 h-3.5 text-rose" />
            <span className="text-xs font-bold uppercase tracking-wider text-maroon">
              Live On Instagram • @gift_town21
            </span>
          </div>

          <h2 className="font-display font-black text-[clamp(42px,5.5vw,84px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            <span className="block">OUR INSTAGRAM</span>
            <span className="block">DIARY</span>
          </h2>
          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Real surprise unboxings, midnight deliveries, and custom gift arrangements fresh from our Thatta shop.
          </p>
        </div>

        {/* ── Contained Instagram App Window / Dropdown Container ── */}
        <div className="max-w-3xl mx-auto bg-white rounded-[32px] sm:rounded-[38px] border border-rose/20 shadow-[0_22px_60px_rgba(107,21,53,0.08)] overflow-hidden transition-all duration-300">

          {/* ── Top Bar: Mobile In-App Header & Dropdown Handle ── */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 bg-gradient-to-r from-[#fff8f9] via-white to-[#fff8f9] border-b border-rose/15 select-none">
            {/* Left: Window pill dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            </div>

            {/* Center: Handle Dropdown / Profile Title */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full hover:bg-rose/5 transition-colors cursor-pointer group"
              title={isOpen ? "Collapse Instagram View" : "Expand Instagram View"}
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-rose/30 flex-shrink-0">
                <Image
                  src="/images/gift-town-logo.png"
                  alt="gift_town21 profile"
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
              <span className="font-body font-bold text-sm text-maroon">gift_town21</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-maroon/60 group-hover:text-rose transition-colors" />
              ) : (
                <ChevronDown className="w-4 h-4 text-maroon/60 group-hover:text-rose transition-colors" />
              )}
            </button>

            {/* Right: Direct Follow Icon Link */}
            <a
              href="https://www.instagram.com/gift_town21/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose hover:text-maroon transition-colors"
            >
              <span>Visit App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* ── Accordion / Dropdown Body ── */}
          {isOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              
              {/* 1. Profile Header Area */}
              <div className="p-6 sm:p-8 border-b border-rose/10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                  
                  {/* Avatar with Story Gradient Ring */}
                  <div className="relative flex-shrink-0 group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-rose via-[#F7C242] to-rose shadow-md animate-gold-pulse">
                      <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-[#faedf0]">
                          <Image
                            src="/images/gift-town-logo.png"
                            alt="gift_town21 logo"
                            fill
                            sizes="(max-width: 640px) 96px, 112px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-1 px-1.5 py-0.5 rounded-full bg-rose text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                      Live
                    </span>
                  </div>

                  {/* Profile Info & Bio */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <h3 className="font-body font-black text-lg sm:text-xl text-maroon">
                          gift_town21
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-rose fill-rose/20" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:mt-0">
                        <a
                          href="https://www.instagram.com/gift_town21/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-full bg-rose text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c9324c] transition-all shadow-xs hover:shadow-sm"
                        >
                          Follow
                        </a>
                        <a
                          href="https://wa.me/?text=Hi%20Gift%20Town!%20I%20saw%20your%20Instagram%20profile%20and%20wanted%20to%20inquire."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-full bg-rose/10 text-maroon text-xs font-bold uppercase tracking-wider hover:bg-rose/15 transition-all"
                        >
                          Message
                        </a>
                      </div>
                    </div>

                    {/* Stats Counter Bar */}
                    <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 py-2 border-y border-rose/10 mb-3 text-xs sm:text-sm">
                      <div>
                        <span className="font-black text-maroon">282</span>{" "}
                        <span className="text-maroon/60">posts</span>
                      </div>
                      <div>
                        <span className="font-black text-maroon">462</span>{" "}
                        <span className="text-maroon/60">followers</span>
                      </div>
                      <div>
                        <span className="font-black text-maroon">13</span>{" "}
                        <span className="text-maroon/60">following</span>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <div className="text-xs sm:text-[13px] text-maroon/80 space-y-1 font-body">
                      <div className="font-bold text-maroon flex items-center justify-center sm:justify-start gap-1">
                        <span>Gift town</span> <span>🎁</span>
                        <span className="text-rose font-medium text-[11px] ml-1 px-1.5 py-0.5 rounded-md bg-rose/10">
                          Gift Shop
                        </span>
                      </div>
                      <p>📍 Thatta / Makli</p>
                      <p>🚚 Delivery available all over PK • Advance Payment Only</p>
                      <p className="text-maroon/70">
                        🎂 Birthday Packages | Midnight Surprises | Bouquet | Baskets | Eid Gifts | Wedding
                      </p>
                      <p className="text-maroon/50 text-[11px]">makli thatta Pakistan, Thatta 73130</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Story Highlights Carousel */}
              <div className="px-4 sm:px-6 py-4 bg-[#fdf9fa] border-b border-rose/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-maroon/40 mb-3 px-2">
                  ✦ Featured Highlights
                </p>
                <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-1 px-1">
                  {HIGHLIGHTS.map((h) => (
                    <a
                      key={h.id}
                      href="https://www.instagram.com/gift_town21/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-rose/25 group-hover:bg-rose transition-colors">
                        <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-[#faedf0] group-hover:bg-[#f6dfe4] transition-colors flex items-center justify-center text-lg sm:text-xl shadow-inner">
                            {h.emoji}
                          </div>
                        </div>
                      </div>
                      <span className="font-body text-[11px] font-semibold text-maroon/80 group-hover:text-rose transition-colors max-w-[68px] text-center truncate">
                        {h.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* 3. Native Tab Bar */}
              <div className="flex items-stretch border-b border-rose/15 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 transition-colors relative cursor-pointer ${
                    activeTab === "posts" ? "text-rose bg-rose/5" : "text-maroon/50 hover:text-maroon"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Posts ({POSTS_DATA.length})</span>
                  {activeTab === "posts" && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-rose" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("reels")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 transition-colors relative cursor-pointer ${
                    activeTab === "reels" ? "text-rose bg-rose/5" : "text-maroon/50 hover:text-maroon"
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Reels ({REELS_DATA.length})</span>
                  {activeTab === "reels" && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-rose" />
                  )}
                </button>
              </div>

              {/* 4. Grid of Posts OR Reels */}
              <div className="p-3 sm:p-5 bg-white">
                
                {/* ── POSTS VIEW ── */}
                {activeTab === "posts" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {POSTS_DATA.map((post) => (
                      <a
                        key={post.id}
                        href="https://www.instagram.com/gift_town21/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-2xl overflow-hidden bg-[#faedf0] border border-rose/15 group cursor-pointer"
                      >
                        {/* Image Thumbnail */}
                        <Image
                          src={post.image}
                          alt={post.caption}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Right Tag */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-rose text-[9px] font-bold shadow-xs">
                            {post.tag}
                          </div>
                        </div>

                        {/* Desktop Hover Scrim Overlay with Likes / Comments */}
                        <div className="absolute inset-0 bg-maroon/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-3 text-center z-20">
                          <p className="font-body font-bold text-xs line-clamp-2 mb-2 text-[#FFF4D0]">
                            {post.caption}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 fill-white text-white" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                              {post.comments}
                            </span>
                          </div>
                          <span className="mt-2 text-[10px] uppercase tracking-wider text-rose bg-white px-2.5 py-0.5 rounded-full font-bold">
                            View on IG ↗
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* ── REELS VIEW ── */}
                {activeTab === "reels" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {REELS_DATA.map((reel) => (
                      <div
                        key={reel.id}
                        onClick={() => setActiveVideoModal(reel)}
                        className="relative aspect-[9/16] sm:aspect-square rounded-2xl overflow-hidden bg-[#2a0d17] border border-rose/15 group cursor-pointer shadow-xs hover:shadow-md transition-all"
                      >
                        {/* Video Poster Image */}
                        <Image
                          src={reel.poster}
                          alt={reel.caption}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />

                        {/* Top Right Reel Views Badge */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                            <Play className="w-2.5 h-2.5 fill-white text-white" />
                            <span>{reel.views}</span>
                          </div>
                        </div>

                        {/* Play Pulse Icon in Center */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 text-rose flex items-center justify-center shadow-lg backdrop-blur-xs">
                            <Play className="w-4 h-4 fill-rose text-rose ml-0.5" />
                          </div>
                        </div>

                        {/* Bottom Gradient with Caption */}
                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10">
                          <p className="font-body text-[11px] font-semibold text-white truncate">
                            {reel.caption}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-white/80 font-medium mt-0.5">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-rose text-rose" />
                              {reel.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 text-white/70" />
                              {reel.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Profile Footer Pill */}
                <div className="mt-6 text-center">
                  <a
                    href="https://www.instagram.com/gift_town21/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#fdf2f4] hover:bg-rose hover:text-white border border-rose/20 text-maroon text-xs font-bold uppercase tracking-wider transition-all duration-200 group"
                  >
                    <InstagramIcon className="w-4 h-4 text-rose group-hover:text-white transition-colors" />
                    <span>View all 282+ moments on Instagram →</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

            {/* ── Interactive Reel Video Player Modal ── */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative max-w-sm w-full max-h-[92dvh] sm:max-h-[90vh] bg-[#1a080f] rounded-3xl sm:rounded-[28px] overflow-hidden border border-rose/30 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Always visible & sticky at top so close button is immediately accessible */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/85 backdrop-blur-sm border-b border-white/10 z-30">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-rose/40">
                  <Image
                    src="/images/gift-town-logo.png"
                    alt="gift_town21"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="block font-body font-bold text-xs text-white leading-tight">gift_town21</span>
                  <span className="block text-[10px] text-rose font-medium">Instagram Reel</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-rose hover:text-white active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                  title="Close reel"
                  aria-label="Close reel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body: Video fits screen immediately, swipe down to view caption and Watch on IG */}
            <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Video Player: height constrained to fit screen alongside header */}
              <div className="relative w-full aspect-[9/16] max-h-[calc(92dvh-4rem)] sm:max-h-[70vh] bg-black flex items-center justify-center flex-shrink-0">
                <video
                  src={activeVideoModal.video}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Footer Caption & Linkout: reached by swiping/scrolling down */}
              <div className="flex-shrink-0 p-4 bg-gradient-to-b from-black/95 via-[#1a080f] to-[#12050b] border-t border-white/5">
                <p className="text-white/90 text-xs font-medium leading-relaxed mb-3.5">
                  {activeVideoModal.caption}
                </p>
                <a
                  href="https://www.instagram.com/gift_town21/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-rose text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#d43751] active:scale-98 transition-all shadow-md"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Watch & Like on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
