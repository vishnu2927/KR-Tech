/**
 * KR GLOBAL LEARNING PRIVATE LIMITED
 * Privacy-Conscious Learning Analytics Helper (GA4 / GSC)
 * 
 * Strict Company Policy Enforced:
 * Certified technology training, skill benchmarking, and learning analytics only.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type LearningAnalyticsEvent =
  | 'page_view'
  | 'course_view'
  | 'course_search'
  | 'course_enrollment'
  | 'lesson_open'
  | 'lesson_completion'
  | 'quiz_start'
  | 'quiz_completion'
  | 'certificate_view'
  | 'certificate_verification'
  | 'consultation_click'
  | 'contact_submission'
  | 'demo_booking'
  | 'resource_download';

export interface EventProperties {
  courseId?: string;
  courseTitle?: string;
  category?: string;
  lessonId?: string;
  credentialId?: string;
  path?: string;
  searchTerm?: string;
  [key: string]: any;
}

/**
 * Track an approved privacy-conscious learning event
 */
export function trackLearningEvent(event: LearningAnalyticsEvent, properties?: EventProperties): void {
  // Never track sensitive PII (passwords, tokens, phone numbers in event payloads)
  const safeProperties = { ...properties };
  delete safeProperties.password;
  delete safeProperties.token;
  delete safeProperties.jwt;

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, safeProperties);
  } else if (import.meta.env.DEV) {
    console.debug(`[Learning Analytics - Dev] ${event}:`, safeProperties);
  }
}

/**
 * Check if GA4 is active
 */
export function getAnalyticsStatus(): 'PASS' | 'NEEDS VERIFICATION' | 'NOT CONFIGURED' {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    return 'NOT CONFIGURED';
  }
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
    ? 'PASS'
    : 'NEEDS VERIFICATION';
}

/**
 * Unified Analytics Object for existing page components
 */
export const analytics = {
  trackPageView(path: string, title?: string) {
    trackLearningEvent('page_view', { path, page_title: title });
  },
  trackDemoBooking(course: string, timeSlot?: string) {
    trackLearningEvent('consultation_click', { courseTitle: course, timeSlot });
  },
  trackResourceDownload(title: string, format?: string) {
    trackLearningEvent('resource_download', { resourceTitle: title, format });
  },
  trackCourseView(courseId: string, courseTitle?: string) {
    trackLearningEvent('course_view', { courseId, courseTitle });
  },
  trackCourseEnrollment(courseId: string, courseTitle?: string) {
    trackLearningEvent('course_enrollment', { courseId, courseTitle });
  },
  trackEvent(eventName: string, data?: Record<string, any>) {
    trackLearningEvent(eventName as LearningAnalyticsEvent, data);
  },
};

export default analytics;
