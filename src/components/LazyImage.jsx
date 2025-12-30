import { useState, useEffect } from "react";
import { generateBlurDataURL } from "../utils/imageHelper";

/**
 * Optimized Lazy Loading Image Component
 * Features:
 * - Native lazy loading
 * - Blur placeholder
 * - Error handling
 * - Progressive loading
 */
const LazyImage = ({ src, alt = "", className = "", width, height, onLoad, onError, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blurDataUrl] = useState(() => generateBlurDataURL());

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            backgroundSize: "cover",
            filter: "blur(10px)",
          }}
        />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${className} ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
