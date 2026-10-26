import React from "react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StickerBadge from "@/components/StickerBadge";
import { Moon, Sparkles, Clock, MapPin, MessageCircle, Heart } from "lucide-react";

export default function MidnightSurprisesSection() {
  return (
    <section id="midnight" className="relative py-20 sm:py-28 bg-gradient-to-b from-[#2a0d17] via-[#3d1222] to-[#250b14] text-white overflow-hidden">
      {/* Decorative Starry dots & Ambient Glow */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f7cad0_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-[#d46f83]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-[#9d4b5d]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative floating moon / star icons */}
      <div className="hidden lg:block absolute top-16 right-24 animate-float opacity-70 pointer-events-none">
        <Sparkles className="w-8 h-8 text-[#f7cad0]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Midnight Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <StickerBadge variant="plum" rotate="-2" size="md" className="border-[#f7cad0]/30 text-[#fce7eb]">
                <Moon className="w-3.5 h-3.5 text-[#f7cad0]" />
                <span>Signature Specialty</span>
              </StickerBadge>
              <StickerBadge variant="gold" rotate="2" size="sm" className="hidden sm:inline-flex">
                <Clock className="w-3 h-3 text-[#d97706]" />
                <span>12:00 AM Prompt Delivery</span>
              </StickerBadge>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]">
              Midnight Surprises at the{" "}
              <span className="italic text-[#f7cad0] font-normal underline decoration-[#d46f83]/60 decoration-wavy">
                Stroke of Twelve
              </span>
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Imagine the doorbell ringing precisely at 12:00 AM — greeting your favorite person with fairy lights, fresh rose petals, decadent chocolate bouquets, and a heartwarming birthday chorus right at their door.
            </p>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-[#d46f83]/20 text-[#f7cad0]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Guaranteed Punctuality</h4>
                  <p className="text-xs text-neutral-300">Coordinated 11:59 PM setup</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-[#d46f83]/20 text-[#f7cad0]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Thatta & Makli Local</h4>
                  <p className="text-xs text-neutral-300">Direct courier handover</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="https://wa.me/?text=Hi%20Gift%20Town!%20I%20want%20to%20book%20a%20Midnight%20Surprise%20delivery."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#d46f83] to-[#e7889b] hover:from-[#c75e72] hover:to-[#df778c] text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-[0_6px_25px_rgba(212,111,131,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Moon className="w-4 h-4" />
                <span>Reserve Midnight Slot</span>
              </a>
              <span className="text-xs text-[#f7cad0]/80 italic">
                *Requires minimum 24-48 hours advance notice
              </span>
            </div>
          </div>

          {/* Right Column: Midnight Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Glowing Moon Rim */}
            <div className="absolute w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#d46f83]/30 via-transparent to-[#f7cad0]/20 blur-xl pointer-events-none" />

            {/* Arch Placeholder with Midnight Plum Theme */}
            <div className="relative z-10 w-[280px] sm:w-[330px] transition-transform duration-300 hover:scale-105">
              <ImagePlaceholder
                shape="arch"
                aspectRatio="4/5"
                label="Midnight Setup Arrangement"
                sublabel="Doorstep Surprise & Lights 4:5"
                icon="moon"
                tint="plum"
                className="border-[#d46f83]/50 shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Floating Info Sticker */}
            <div className="absolute -bottom-4 right-4 z-20">
              <StickerBadge variant="gold" rotate="3" size="sm">
                <Sparkles className="w-3 h-3 text-[#d97706]" />
                <span>Limited Slots Per Night</span>
              </StickerBadge>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
