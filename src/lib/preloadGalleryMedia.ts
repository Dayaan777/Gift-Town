/**
 * Anticipatory media & chunk preloader for the Gallery & Reels section.
 * Triggered in the background when the user scrolls near the Custom Hamper
 * or Testimonials section, ensuring everything is 100% cached & ready to play
 * without any user waiting or tap delay.
 */

let hasPreloaded = false;

const GALLERY_POST_IMAGES = [
  "/images/insta/posts/post-1.jpg",
  "/images/insta/posts/post-2.webp",
  "/images/insta/posts/post-3.jpg",
  "/images/insta/posts/post-4.jpg",
  "/images/insta/posts/post-5.jpg",
  "/images/insta/posts/post-6.jpg",
];

const REEL_POSTERS = [
  "/images/insta/reels/posters/poster-1.jpg",
  "/images/insta/reels/posters/poster-2.jpg",
  "/images/insta/reels/posters/poster-3.jpg",
  "/images/insta/reels/posters/poster-4.jpg",
  "/images/insta/reels/posters/poster-5.jpg",
  "/images/insta/reels/posters/poster-6.jpg",
];

export function preloadGalleryMedia() {
  if (hasPreloaded || typeof window === "undefined") return;
  hasPreloaded = true;

  // Run on idle so we don't interfere with current interactions
  const runPreload = () => {
    // 1. Preload the Gallery JS chunk dynamically
    import("@/components/GallerySection").catch(() => {});

    // 2. Silently warm image cache for posters and posts
    const allImages = [...GALLERY_POST_IMAGES, ...REEL_POSTERS];
    allImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // 3. Pre-fetch the initial video streams using link prefetch
    ["/images/insta/reels/reel-1.mp4", "/images/insta/reels/reel-2.mp4"].forEach((src) => {
      try {
        const videoPreload = document.createElement("link");
        videoPreload.rel = "prefetch";
        videoPreload.as = "video";
        videoPreload.href = src;
        document.head.appendChild(videoPreload);
      } catch {
        // Fallback: silent warm
      }
    });
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(runPreload, { timeout: 2000 });
  } else {
    setTimeout(runPreload, 200);
  }
}
