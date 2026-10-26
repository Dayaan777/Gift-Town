"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  minHeight?: string | number;
  rootMargin?: string;
  onVisible?: () => void;
  id?: string;
  className?: string;
}

export default function LazySection({
  children,
  minHeight = "200px",
  rootMargin = "450px",
  onVisible,
  id,
  className = "w-full",
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already visible, no need to observe
    if (isVisible) return;

    // Fallback for environments without IntersectionObserver
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      onVisible?.();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      {
        rootMargin, // Look ahead distance before entering viewport
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isVisible, rootMargin, onVisible]);

  return (
    <div
      id={id}
      ref={containerRef}
      style={{
        minHeight: !isVisible ? minHeight : undefined,
      }}
      className={className}
    >
      {isVisible ? children : null}
    </div>
  );
}
