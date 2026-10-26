import React from "react";
import Image from "next/image";
import Link from "next/link";
import Bloom from "./Bloom";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  variant: "left" | "center" | "right";
  cardColor: "rose" | "maroon";
  outerBloom: string;
  innerBloom: string;
  className?: string;
  imagePosition?: string;
}

export default function CategoryCard({
  title,
  description,
  image,
  variant,
  cardColor,
  outerBloom,
  innerBloom,
  className = "",
  imagePosition = "center",
}: CategoryCardProps) {
  const isMaroon = cardColor === "maroon";

  // Card color backgrounds
  const cardBgClass = isMaroon
    ? "bg-maroon text-white"
    : "bg-rose text-white";

  // Position adjustments for the label card
  // Left: overlapping photo's bottom-left & extending slightly past left
  // Center: overlapping photo's bottom-RIGHT & hanging a little below
  // Right: overlapping photo's bottom-left
  const labelCardPositionClass = {
    left: "bottom-[-16px] -left-4 sm:-left-6 md:-left-8",
    center: "bottom-[-22px] right-[-14px] sm:right-[-20px] md:right-[-26px]",
    right: "bottom-[-16px] left-2 sm:left-4 md:left-6",
  }[variant];

  // Side photos ~440x440, Center photo ~500x500 (scales with clamp)
  const photoSizeClass = variant === "center"
    ? "w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[490px] lg:h-[490px]"
    : "w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] md:w-[390px] md:h-[390px] lg:w-[430px] lg:h-[430px]";

  return (
    <Link
      href="#packages"
      className={`group relative flex flex-col items-center select-none outline-none focus-visible:ring-4 focus-visible:ring-rose/60 rounded-[70px] ${className}`}
      aria-label={`${title} - ${description}`}
    >
      {/* ── Main Photo Container with Bloom behind it ── */}
      <div className={`relative ${photoSizeClass} flex items-center justify-center`}>
        
        {/* Bloom (Behind the photo) */}
        <Bloom outerColor={outerBloom} innerColor={innerBloom} />

        {/* The Product Photo: 70px border-radius, soft drop shadow, scale on hover */}
        <div className="relative w-full h-full rounded-[50px] sm:rounded-[60px] md:rounded-[70px] overflow-hidden shadow-[0_12px_36px_rgba(107,21,53,0.18)] transition-transform duration-300 ease-out group-hover:scale-[1.03] bg-white">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 300px, 490px"
            style={{ objectPosition: imagePosition }}
            className="object-cover"
            priority={variant === "left"}
          />
        </div>

        {/* ── Overlapping Label Card (410x86 at full scale) ── */}
        <div
          className={`absolute ${labelCardPositionClass} z-20 flex items-center gap-3 sm:gap-3.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-[22px] shadow-[0_10px_28px_rgba(107,21,53,0.28)] ${cardBgClass} w-[240px] sm:w-[310px] md:w-[370px] lg:w-[410px] max-w-[94vw]`}
        >
          {/* White Circular "+" Badge on top-left corner */}
          <div className="absolute -top-3.5 -left-3.5 sm:-top-4 sm:-left-4 w-7 h-7 sm:w-[34px] sm:h-[34px] rounded-full bg-white shadow-md flex items-center justify-center z-30">
            <span
              className={`font-display font-black text-base sm:text-lg leading-none ${
                isMaroon ? "text-maroon" : "text-rose"
              }`}
            >
              +
            </span>
          </div>

          {/* Thumbnail crop of the product (~66px) */}
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-[62px] md:h-[62px] rounded-[16px] sm:rounded-[18px] overflow-hidden flex-shrink-0 bg-white shadow-inner">
            <Image
              src={image}
              alt=""
              aria-hidden="true"
              fill
              sizes="66px"
              style={{ objectPosition: imagePosition }}
              className="object-cover"
            />
          </div>

          {/* Title & Description */}
          <div className="flex flex-col justify-center min-w-0 pr-1">
            <h3 className="font-display font-extrabold text-xs sm:text-sm md:text-[18px] lg:text-[21px] text-white uppercase tracking-tight leading-tight truncate">
              {title}
            </h3>
            <p className="font-body font-medium text-[11px] sm:text-xs md:text-[15px] lg:text-[17px] text-[#FFE8E8] leading-tight truncate mt-0.5">
              {description}
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}
