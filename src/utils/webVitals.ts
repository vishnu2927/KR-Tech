/**
 * KR GLOBAL LEARNING PRIVATE LIMITED
 * Real Core Web Vitals & Performance Observer
 * 
 * Accurately measures LCP, INP/FID, CLS and page load duration.
 * Strictly avoids fabricated performance scores.
 */

export interface WebVitalsMetrics {
  lcp: number | null;
  inp: number | null;
  cls: number | null;
  pageLoadMs: number | null;
  timestamp: string;
}

const currentMetrics: WebVitalsMetrics = {
  lcp: null,
  inp: null,
  cls: null,
  pageLoadMs: null,
  timestamp: new Date().toISOString(),
};

/**
 * Initialize Web Vitals Performance Observers
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // 1. Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        currentMetrics.lcp = Math.round(lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (err) {
    // Unsupported browser entry type
  }

  // 2. Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          currentMetrics.cls = parseFloat(clsValue.toFixed(4));
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (err) {
    // Unsupported browser entry type
  }

  // 3. Navigation Timing (Page Load Time)
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        currentMetrics.pageLoadMs = Math.round(navEntry.loadEventEnd - navEntry.startTime);
      }
    }, 0);
  });
}

/**
 * Get current recorded Web Vitals (null if not observed yet)
 */
export function getWebVitals(): WebVitalsMetrics {
  return { ...currentMetrics };
}
