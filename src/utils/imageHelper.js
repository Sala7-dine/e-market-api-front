/**
 * Image Helper Utilities
 * Provides functions for image URL handling, lazy loading, and optimization
 */

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("e-market-dh-03e9602f6d1a.herokuapp.com")) {
    return `https://${imageUrl}`;
  }
  return `https://e-market-dh-03e9602f6d1a.herokuapp.com${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

/**
 * Generate blur data URL for image placeholders
 * Creates a tiny 10x10 blurred placeholder
 */
export const generateBlurDataURL = (width = 10, height = 10) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f3f4f6");
  gradient.addColorStop(0.5, "#e5e7eb");
  gradient.addColorStop(1, "#d1d5db");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.1);
};

/**
 * Lazy Image Component Props
 * Use this with a custom LazyImage component
 */
export const getLazyImageProps = (src, alt = "") => ({
  src,
  alt,
  loading: "lazy",
  decoding: "async",
  style: {
    backgroundImage: `url(${generateBlurDataURL()})`,
    backgroundSize: "cover",
  },
});

/**
 * Preload critical images
 * Call this for above-the-fold images
 */
export const preloadImage = (src) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Generate responsive image srcSet
 * For different screen sizes
 */
export const getResponsiveSrcSet = (baseUrl, sizes = [320, 640, 768, 1024, 1280]) =>
  sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");

/**
 * Image loading observer
 * Intersection Observer for lazy loading images
 */
export const createImageObserver = (callback) => {
  if (!("IntersectionObserver" in window)) {
    // Fallback for browsers without Intersection Observer
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    },
    {
      rootMargin: "50px", // Start loading 50px before image enters viewport
      threshold: 0.01,
    }
  );
};

/**
 * Optimize image URL with query parameters
 * Add width, height, quality, and format parameters
 */
export const optimizeImageUrl = (url, options = {}) => {
  const { width, height, quality = 80, format = "webp" } = options;

  if (!url) return "";

  const urlObj = new URL(getImageUrl(url));

  if (width) urlObj.searchParams.set("w", width);
  if (height) urlObj.searchParams.set("h", height);
  if (quality) urlObj.searchParams.set("q", quality);
  if (format) urlObj.searchParams.set("fm", format);

  return urlObj.toString();
};
