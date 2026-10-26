import React from "react";
import Image from "next/image";
import Link from "next/link";
import StickerBadge from "@/components/StickerBadge";
import { Sparkles, MessageCircle, MapPin, Phone } from "lucide-react";

// Inline Instagram Icon for authentic branding
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

export default function Footer() {
  return (
    <footer className="relative bg-[#fff8f9] pt-12 pb-8 border-t border-[#f5d5db] overflow-hidden">
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#f5d5db]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Gift Town Logo"
                width={200}
                height={100}
                className="h-20 sm:h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-neutral-600 text-sm max-w-sm leading-relaxed">
              A gift shop & surprise-planning business based in Thatta & Makli, Sindh. Creating heartfelt custom gift packages with nationwide delivery on advance payment.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7a233c]">
              <MapPin className="w-3.5 h-3.5 text-[#d46f83]" />
              <span>Thatta & Makli, Sindh, Pakistan</span>
            </div>
          </div>

          {/* Quick Links to Page Sections */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-neutral-900 text-lg">Explore Sections</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#gifts-of-the-month" className="hover:text-[#7a233c] transition-colors">Gifts of the Month</Link></li>
              <li><Link href="#sentiments" className="hover:text-[#7a233c] transition-colors">Gifts by Sentiments</Link></li>
              <li><Link href="#build-surprise" className="hover:text-[#7a233c] transition-colors">Custom Gift Hampers</Link></li>
              <li><Link href="#packages" className="hover:text-[#7a233c] transition-colors">Best Sellers</Link></li>
              <li><Link href="#featured-products" className="hover:text-[#7a233c] transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Delivery & Ordering Note */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-neutral-900 text-lg">Ordering & Delivery</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              • <strong>Thatta & Makli:</strong> Doorstep setup & midnight delivery available.<br />
              • <strong>Nationwide Delivery:</strong> Dispatched via express courier on an <em>advance-payment basis</em>.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/gift_town21/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#f5d5db] flex items-center justify-center text-[#d46f83] hover:bg-[#e2405c] hover:text-white hover:border-[#e2405c] transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 group"
                aria-label="Instagram @gift_town21"
                title="Instagram @gift_town21"
              >
                <InstagramIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#f5d5db] flex items-center justify-center text-[#1e7e34] hover:bg-[#1e7e34] hover:text-white hover:border-[#1e7e34] transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 group"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

        </div>

        {/* Huge Faint Decorative Wordmark Behind Bottom Area */}
        <div className="text-center select-none pointer-events-none mt-6 overflow-hidden">
          <span className="text-[70px] sm:text-[120px] md:text-[160px] font-serif font-black tracking-widest text-[#f5d5db]/50 leading-none uppercase block">
            GIFT TOWN
          </span>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center text-xs text-neutral-500 gap-3">
          <p>© 2026 Gift Town. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
