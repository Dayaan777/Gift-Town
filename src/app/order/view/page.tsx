"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  decodeOrderItems,
  getWhatsAppUrl,
  WHATSAPP_DISPLAY_NUMBER,
} from "@/lib/whatsapp";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  Receipt,
  Sparkles,
} from "lucide-react";

function OrderSlipContent() {
  const searchParams = useSearchParams();
  const slipData = searchParams.get("slip") || "";
  const title = searchParams.get("title") || "Custom Order Slip";
  const totalParam = searchParams.get("total");

  const items = decodeOrderItems(slipData);
  const calculatedTotal = items.reduce(
    (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
    0
  );
  const displayTotal = totalParam ? Number(totalParam) : calculatedTotal;

  return (
    <div className="min-h-screen bg-[#fce3e0] py-8 sm:py-12 px-4 sm:px-6 flex flex-col justify-between selection:bg-rose selection:text-white">
      <div className="max-w-3xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-maroon hover:text-rose transition-colors bg-white/80 px-4 py-2 rounded-full border border-rose/15 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose/10 text-rose border border-rose/20">
            <Receipt className="w-3.5 h-3.5" />
            <span>Official Order Slip</span>
          </span>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(107,21,53,0.1)] border border-rose/20 relative overflow-hidden">
          {/* Subtle Top Decorative Ribbon */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose via-[#d43751] to-rose" />

          {/* Brand & Slip Title */}
          <div className="text-center pb-6 border-b border-rose/15">
            <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-maroon uppercase block">
              GIFT TOWN
            </span>
            <p className="font-body text-xs text-maroon/60 uppercase tracking-widest mt-1">
              Custom Gifting &amp; Surprises Pakistan
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-[#fdf5f6] px-4 py-1.5 rounded-full border border-rose/15">
              <Sparkles className="w-3.5 h-3.5 text-rose" />
              <span className="font-serif font-bold text-sm text-maroon">
                {title}
              </span>
            </div>
          </div>

          {/* Items Visual Grid */}
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-maroon/60 pb-2">
              <span>Selected Pieces ({items.length})</span>
              <span>Price</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-10 text-maroon/60 text-sm">
                No items found in this order slip.
              </div>
            ) : (
              <div className="divide-y divide-rose/10">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {item.image ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#fdf0f2] border border-rose/15 flex-shrink-0 shadow-xs">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#fdf0f2] border border-rose/15 flex items-center justify-center flex-shrink-0 text-rose">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <span className="font-serif font-bold text-sm sm:text-base text-maroon leading-snug line-clamp-2">
                          {item.name}
                        </span>
                        {item.quantity && item.quantity > 1 && (
                          <span className="inline-block text-[11px] font-semibold text-rose bg-rose/10 px-2 py-0.5 rounded-md mt-1">
                            Qty: {item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-display font-black text-sm sm:text-base text-maroon">
                        PKR {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Bar */}
          <div className="pt-6 border-t border-rose/15 bg-[#fdf5f6] -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-[32px] sm:rounded-b-[40px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-maroon/60">
                Total Custom Order Amount
              </span>
              <span className="font-display font-black text-2xl sm:text-3xl text-maroon">
                PKR {displayTotal.toLocaleString()}
              </span>
            </div>

            <a
              href={getWhatsAppUrl(
                `Hi Gift Town! I am viewing my order slip for "${title}" totaling PKR ${displayTotal.toLocaleString()}. Please confirm my booking!`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white px-7 py-3.5 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm on WhatsApp ({WHATSAPP_DISPLAY_NUMBER})</span>
            </a>
          </div>
        </div>

        {/* Bottom Help */}
        <p className="text-center font-body text-xs text-maroon/60 mt-6">
          Gift Town official verification slip. Handcrafted with care for delivery across Pakistan.
        </p>
      </div>
    </div>
  );
}

export default function OrderSlipPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fce3e0] flex items-center justify-center text-maroon font-bold text-sm">
          Loading order slip...
        </div>
      }
    >
      <OrderSlipContent />
    </Suspense>
  );
}
