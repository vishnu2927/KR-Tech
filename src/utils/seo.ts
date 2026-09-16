export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "product";
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: object | object[];
}

export function updateSEOTags({
  title,
  description,
  keywords = "1:1 coding classes, personalized tech training, java backend, spring boot, mern stack, react 19, aws certification, devops, cyber security, data analytics, sap fico, live tech mentorship",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=630&fit=crop&q=80",
  ogType = "website",
  ogUrl,
  twitterCard = "summary_large_image",
  structuredData,
}: SEOMetadata) {
  const fullTitle = title.includes("KR Tech") ? title : `${title} | KR Tech`;
  document.title = fullTitle;

  const currentUrl = ogUrl || canonical || window.location.href;

  // Helper to set meta tag content
  const setMeta = (attr: string, key: string, content: string) => {
    let element = document.querySelector(`meta[${attr}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  // 1. Primary Meta Tags
  setMeta("name", "description", description);
  setMeta("name", "keywords", keywords);
  setMeta("name", "author", "KR Tech Academic Council");
  setMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

  // 2. Open Graph Tags
  setMeta("property", "og:site_name", "KR Tech");
  setMeta("property", "og:title", ogTitle || fullTitle);
  setMeta("property", "og:description", ogDescription || description);
  setMeta("property", "og:image", ogImage);
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
  setMeta("property", "og:type", ogType);
  setMeta("property", "og:url", currentUrl);

  // 3. Twitter Card Tags
  setMeta("name", "twitter:card", twitterCard);
  setMeta("name", "twitter:site", "@krtech_academy");
  setMeta("name", "twitter:creator", "@krtech_academy");
  setMeta("name", "twitter:title", ogTitle || fullTitle);
  setMeta("name", "twitter:description", ogDescription || description);
  setMeta("name", "twitter:image", ogImage);

  // 4. Canonical URL
  const activeCanonical = canonical || (window.location.origin + window.location.pathname);
  let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", activeCanonical);

  // 5. Dynamic JSON-LD Structured Data
  if (structuredData) {
    let scriptTag = document.querySelector("script[id='dynamic-structured-data']") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "dynamic-structured-data";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }
}

// Global Reusable Structured Data Builders
export const SchemaBuilder = {
  getOrganizationSchema: () => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "KR Tech",
    "alternateName": "KR Tech Academy",
    "url": "https://krtech.in",
    "logo": "https://krtech.in/favicon.svg",
    "description": "Premium 1:1 Live Coding Academy & Mentorship Portal.",
    "sameAs": [
      "https://www.linkedin.com/company/krtech",
      "https://github.com/krtech",
      "https://twitter.com/krtech_academy",
      "https://www.youtube.com/@krtech"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    }
  }),

  getWebSiteSchema: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KR Tech",
    "url": "https://krtech.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://krtech.in/courses?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }),

  getCourseSchema: (course: {
    title: string;
    description: string;
    category?: string;
    duration?: string;
    slug?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "KR Tech",
      "sameAs": "https://krtech.in"
    },
    "courseCode": course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    "educationalCredentialAwarded": "Official KR Tech Certificate of Professional Mastery",
    "timeRequired": course.duration || "P12W",
    "offers": {
      "@type": "Offer",
      "category": "1:1 Live Training with Senior Industry Architects",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://krtech.in/courses/${course.slug || ""}`
    }
  }),

  getBreadcrumbSchema: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};
