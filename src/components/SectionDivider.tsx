import React from "react";

interface SectionDividerProps {
  type?: "wave-concave" | "wave-convex" | "scallop" | "ribbon";
  fill?: string; // Tailwind fill class e.g. "fill-[#fffdfa]"
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({
  type = "wave-convex",
  fill = "fill-[#fffdfa]",
  flip = false,
  className = "",
}: SectionDividerProps) {
  const flipClass = flip ? "rotate-180 -scale-x-100" : "";

  if (type === "scallop") {
    return (
      <div className={`w-full overflow-hidden leading-none ${flipClass} ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className={`relative block w-full h-8 sm:h-12 ${fill}`}
        >
          <path d="M0,0 C150,55 350,55 500,10 C650,55 850,55 1000,10 C1100,45 1150,45 1200,20 L1200,60 L0,60 Z" />
        </svg>
      </div>
    );
  }

  if (type === "ribbon") {
    return (
      <div className={`w-full overflow-hidden leading-none ${flipClass} ${className}`}>
        <svg
          viewBox="0 0 1200 70"
          preserveAspectRatio="none"
          className={`relative block w-full h-10 sm:h-14 ${fill}`}
        >
          <path d="M0,45 C200,15 400,60 600,30 C800,0 1000,50 1200,25 L1200,70 L0,70 Z" />
        </svg>
      </div>
    );
  }

  if (type === "wave-concave") {
    return (
      <div className={`w-full overflow-hidden leading-none ${flipClass} ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className={`relative block w-full h-8 sm:h-12 ${fill}`}
        >
          <path d="M0,35 C300,70 600,0 900,45 C1050,65 1150,50 1200,35 L1200,60 L0,60 Z" />
        </svg>
      </div>
    );
  }

  // Default wave-convex
  return (
    <div className={`w-full overflow-hidden leading-none ${flipClass} ${className}`}>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className={`relative block w-full h-8 sm:h-12 ${fill}`}
      >
        <path d="M0,20 C180,50 360,10 540,35 C720,60 900,15 1080,40 C1140,50 1180,35 1200,25 L1200,60 L0,60 Z" />
      </svg>
    </div>
  );
}
