"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  getWhatsAppUrl,
  WHATSAPP_DISPLAY_NUMBER,
  OrderSlipItem,
} from "@/lib/whatsapp";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Receipt,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface SlipPayload {
  code: string;
  title: string;
  total: number;
  items: OrderSlipItem[];
  notes?: string;
  createdAt: string;
}

function OrderCodeContent() {
  const params = useParams();
  const rawCode = Array.isArray(params?.code)
    ? params.code[0]
    : (params?.code as string) || "";
  const code = rawCode.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [slip, setSlip] = useState<SlipPayload | null>(null);

  useEffect(() => {
    async function loadSlip() {
      if (!code) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("hamper_items")
          .select("id, name, subtitle, price, created_at, image")
          .eq("id", `slip-${code}`)
          .maybeSingle();

        if (data && data.subtitle) {
          try {
            const parsed = JSON.parse(data.subtitle);
            setSlip(parsed);
          } catch {
            // fallback
            setSlip({
              code,
              title: data.name || "Custom Order",
              total: Number(data.price) || 0,
              items: [
                {
                  id: "1",
                  name: data.name || "Gift Town Package",
                  price: Number(data.price) || 0,
                  image: data.image || "/logo.png",
                },
              ],
              createdAt: data.created_at,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load order slip:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSlip();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fce3e0] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-3 border-rose border-t-transparent animate-spin mb-4" />
        <span className="font-serif font-bold text-sm text-maroon">
          Retrieving Gift Town Order Slip {code}...
        </span>
      </div>
    );
  }

  if (!slip) {
    return (
      <div className="min-h-screen bg-[#fce3e0] py-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-lg border border-rose/20 space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose/10 text-rose flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-black text-xl text-maroon">
            Order Slip Not Found
          </h2>
          <p className="font-body text-xs text-maroon/70 leading-relaxed">
            Order slip code <strong>{code}</strong> could not be located. It may have expired or already been processed.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose to-[#d43751] text-white px-6 py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = slip.createdAt
    ? new Date(slip.createdAt).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recent Order";

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
            <span>Order #{slip.code || code}</span>
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

            <div className="mt-4 inline-flex items-center bg-[#fdf5f6] px-4 py-1.5 rounded-full border border-rose/15">
              <span className="font-serif font-bold text-sm text-maroon">
                {(slip.title || "")
                  .replace(/custom hamper selection/gi, "Custom Order")
                  .replace(/hamper selection/gi, "Custom Order")
                  .replace(/hamper/gi, "Order") || "Custom Order"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-maroon/60 font-medium">
              <Calendar className="w-3.5 h-3.5 text-rose" />
              <span>Created on {formattedDate}</span>
            </div>
          </div>

          {/* Items Visual Grid */}
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-maroon/60 pb-2">
              <span>Order Inclusions ({slip.items.length})</span>
              <span>Amount</span>
            </div>

            <div className="divide-y divide-rose/10">
              {slip.items.map((item, idx) => (
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
                      {item.category && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-rose/80 mt-0.5">
                          {item.category}
                        </span>
                      )}
                      {item.quantity && item.quantity > 1 && (
                        <span className="inline-block text-[11px] font-semibold text-rose bg-rose/10 px-2 py-0.5 rounded-md ml-2">
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
          </div>

          {/* Total Bar */}
          <div className="pt-6 border-t border-rose/15 bg-[#fdf5f6] -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-[32px] sm:rounded-b-[40px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-maroon/60">
                Total Order Amount
              </span>
              <span className="font-display font-black text-2xl sm:text-3xl text-maroon">
                PKR {slip.total.toLocaleString()}
              </span>
            </div>

            <a
              href={getWhatsAppUrl(
                `Hi Gift Town! I am referencing Order Slip #${slip.code || code} for "${slip.title}" totaling PKR ${slip.total.toLocaleString()}. Please confirm availability!`
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
          Gift Town official verification slip • Handcrafted with care for delivery across Pakistan.
        </p>
      </div>
    </div>
  );
}

export default function OrderCodePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#fce3e0] flex items-center justify-center p-4">
          <div className="w-10 h-10 rounded-full border-3 border-rose border-t-transparent animate-spin mb-3" />
        </div>
      }
    >
      <OrderCodeContent />
    </React.Suspense>
  );
}
