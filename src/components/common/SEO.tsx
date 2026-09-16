import React, { useEffect } from "react";
import { updateSEOTags, SEOMetadata } from "../../utils/seo";
import { analytics } from "../../utils/analytics";

interface SEOProps extends SEOMetadata {
  children?: React.ReactNode;
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType,
  ogUrl,
  twitterCard,
  structuredData,
  children,
}: SEOProps) {
  useEffect(() => {
    updateSEOTags({
      title,
      description,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      ogUrl,
      twitterCard,
      structuredData,
    });
    analytics.trackPageView(window.location.pathname, title);
  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    ogUrl,
    twitterCard,
    structuredData,
  ]);

  return <>{children}</>;
}
