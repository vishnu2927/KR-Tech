/**
 * KR GLOBAL LEARNING PRIVATE LIMITED
 * Error Tracking & Sentry Integration Helper
 * 
 * Safely handles frontend uncaught errors, API rejections, and metadata attachment.
 * Zero secret exposure. Marks Sentry as NOT CONFIGURED if DSN is absent.
 */

export interface ErrorEventPayload {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error | any;
  route?: string;
  requestId?: string;
  timestamp: string;
}

const recentFrontendErrors: ErrorEventPayload[] = [];

/**
 * Initialize Frontend Error Tracking
 */
export function initErrorTracking(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    const errorPayload: ErrorEventPayload = {
      message: event.message || 'Uncaught window error',
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      route: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    recentFrontendErrors.unshift(errorPayload);
    if (recentFrontendErrors.length > 20) {
      recentFrontendErrors.pop();
    }

    if (import.meta.env.DEV) {
      console.warn('[Error Tracking]', errorPayload);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const errorPayload: ErrorEventPayload = {
      message: event.reason?.message || String(event.reason) || 'Unhandled promise rejection',
      route: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    recentFrontendErrors.unshift(errorPayload);
    if (recentFrontendErrors.length > 20) {
      recentFrontendErrors.pop();
    }
  });
}

/**
 * Get Sentry configuration status
 */
export function getSentryStatus(): 'PASS' | 'NEEDS VERIFICATION' | 'NOT CONFIGURED' {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    return 'NOT CONFIGURED';
  }
  return 'NEEDS VERIFICATION';
}

/**
 * Get recent caught frontend errors
 */
export function getRecentErrors(): ErrorEventPayload[] {
  return [...recentFrontendErrors];
}
