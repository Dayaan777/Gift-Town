import React from "react";
import Image from "next/image";
import Link from "next/link";
import StickerBadge from "@/components/StickerBadge";
import { Sparkles, MessageCircle, MapPin, Heart, Camera, Phone } from "lucide-react";

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

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-neutral-900 text-lg">Specialties</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#specialties" className="hover:text-[#7a233c] transition-colors">Fresh Flower Bouquets</Link></li>
              <li><Link href="#specialties" className="hover:text-[#7a233c] transition-colors">Luxury Money Bouquets</Link></li>
              <li><Link href="#specialties" className="hover:text-[#7a233c] transition-colors">Custom Gift Hampers</Link></li>
              <li><Link href="#specialties" className="hover:text-[#7a233c] transition-colors">Chocolate & Confectionery</Link></li>
              <li><Link href="#midnight" className="hover:text-[#7a233c] transition-colors">Midnight 12:00 AM Surprises</Link></li>
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#f5d5db] flex items-center justify-center text-[#d46f83] hover:bg-[#fbebee] transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#f5d5db] flex items-center justify-center text-[#1e7e34] hover:bg-[#fbebee] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
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
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© 2026 Gift Town. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#d46f83] text-[#d46f83]" />
            <span>in Thatta / Makli, Sindh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
