import clientLogger from "./clientLogger";

class PerformanceTracker {
  constructor() {
    this.marks = new Map();
    this.setupPerformanceObserver();
    this.trackWebVitals();
  }

  // Marquer le début d'une opération
  startTimer(name) {
    this.marks.set(name, performance.now());
    clientLogger.info("Performance Start", { operation: name });
  }

  // Mesurer la durée
  endTimer(name) {
    const startTime = this.marks.get(name);
    if (startTime) {
      const duration = Math.round(performance.now() - startTime);
      this.marks.delete(name);

      clientLogger.info("Performance End", {
        operation: name,
        duration: `${duration}ms`,
      });

      return duration;
    }
    return 0;
  }

  // Observer les métriques de navigation
  setupPerformanceObserver() {
    try {
      if ("PerformanceObserver" in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "navigation") {
              clientLogger.info("Page Load Performance", {
                loadTime: Math.round(entry.loadEventEnd - entry.loadEventStart),
                domContentLoaded: Math.round(
                  entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart
                ),
                totalTime: Math.round(entry.loadEventEnd - entry.fetchStart),
                transferSize: entry.transferSize,
              });
            }
          }
        });

        observer.observe({ entryTypes: ["navigation"] });
      }
    } catch (error) {
      clientLogger.warn("Performance Observer not supported", { error: error.message });
    }
  }

  // Tracking des Core Web Vitals
  trackWebVitals() {
    try {
      // Largest Contentful Paint (LCP)
      if ("PerformanceObserver" in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          clientLogger.info("Core Web Vitals - LCP", {
            metric: "Largest Contentful Paint",
            value: Math.round(lastEntry.startTime),
            rating:
              lastEntry.startTime < 2500
                ? "good"
                : lastEntry.startTime < 4000
                  ? "needs-improvement"
                  : "poor",
          });
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            clientLogger.info("Core Web Vitals - FID", {
              metric: "First Input Delay",
              value: Math.round(entry.processingStart - entry.startTime),
              rating: entry.processingStart - entry.startTime < 100 ? "good" : "needs-improvement",
            });
          }
        });

        fidObserver.observe({ entryTypes: ["first-input"] });
      }
    } catch (error) {
      clientLogger.warn("Web Vitals tracking failed", { error: error.message });
    }
  }

  // Mesurer les ressources chargées
  trackResourceLoading() {
    try {
      const resources = performance.getEntriesByType("resource");
      const slowResources = resources.filter((resource) => resource.duration > 1000);

      if (slowResources.length > 0) {
        clientLogger.warn("Slow Resources Detected", {
          count: slowResources.length,
          resources: slowResources.map((r) => ({
            name: r.name.split("/").pop(),
            duration: Math.round(r.duration),
            size: r.transferSize,
          })),
        });
      }
    } catch (error) {
      clientLogger.warn("Resource tracking failed", { error: error.message });
    }
  }
}

const performanceTracker = new PerformanceTracker();

// Tracker les ressources après le chargement
window.addEventListener("load", () => {
  setTimeout(() => {
    performanceTracker.trackResourceLoading();
  }, 1000);
});

export default performanceTracker;
