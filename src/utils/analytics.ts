/**
 * KR Tech Enterprise Analytics Engine (GA4 & Custom Event Tracker)
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const analytics = {
  /**
   * Track virtual page view
   */
  trackPageView(path: string, title?: string): void {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: path,
        page_title: title || document.title,
      });
    }
    // Development event log
    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics] Page View: ${path} — ${title || document.title}`);
    }
  },

  /**
   * Track course card interactions and syllabus clicks
   */
  trackCourseClick(courseTitle: string, category: string): void {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "select_course", {
        course_title: courseTitle,
        category: category,
      });
    }
    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics] Course Click: "${courseTitle}" (${category})`);
    }
  },

  /**
   * Track 1:1 Live Demo scheduling conversion
   */
  trackDemoBooking(courseName: string, timeSlot?: string): void {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "generate_lead", {
        currency: "INR",
        value: 19999,
        course_name: courseName,
        time_slot: timeSlot,
      });
    }
    if (import.meta.env.DEV) {
      console.log(`🎯 [Analytics Conversion] Demo Booked for "${courseName}" - Slot: ${timeSlot}`);
    }
  },

  /**
   * Track study material & cheat sheet downloads
   */
  trackResourceDownload(resourceTitle: string, format: string): void {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "file_download", {
        file_name: resourceTitle,
        file_extension: format,
      });
    }
    if (import.meta.env.DEV) {
      console.log(`📥 [Analytics] Resource Downloaded: "${resourceTitle}" (${format})`);
    }
  },
};
