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
  keywords = "Technology Training Institute, Certification Learning Platform, AI Learning Platform, Cloud Computing Training, Cyber Security Training, One-on-One Technology Learning, Professional Technology Courses, Practical Learning Platform, AWS Training, Azure Training, SAP Training, DevOps Training, Data Analytics Training",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=630&fit=crop&q=80",
  ogType = "website",
  ogUrl,
  twitterCard = "summary_large_image",
  structuredData,
}: SEOMetadata) {
  const fullTitle = title.includes("KR Global") || title.includes("KR GLOBAL") ? title : `${title} | KR Global Learning`;
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
  setMeta("name", "author", "KR GLOBAL LEARNING PRIVATE LIMITED");
  setMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

  // 2. Open Graph Tags
  setMeta("property", "og:site_name", "KR GLOBAL LEARNING PRIVATE LIMITED");
  setMeta("property", "og:title", ogTitle || fullTitle);
  setMeta("property", "og:description", ogDescription || description);
  setMeta("property", "og:image", ogImage);
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
  setMeta("property", "og:type", ogType);
  setMeta("property", "og:url", currentUrl);

  // 3. Twitter Card Tags
  setMeta("name", "twitter:card", twitterCard);
  setMeta("name", "twitter:site", "@krglobal_learning");
  setMeta("name", "twitter:creator", "@krglobal_learning");
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
    "name": "KR GLOBAL LEARNING PRIVATE LIMITED",
    "alternateName": "KR Global Learning",
    "url": "https://krgloballearning.com",
    "logo": "https://krgloballearning.com/favicon.svg",
    "industry": "Technology Training & Certification Company",
    "description": "KR GLOBAL LEARNING PRIVATE LIMITED is a technology-first education company that provides industry-focused training, certification programs, live One-on-One mentorship, project-based learning, and practical skill development in AI, Cloud Computing, Cyber Security, Full Stack Development, DevOps, SAP, Data Analytics, Microsoft Technologies, Cisco Networking, and other emerging technologies. The company focuses entirely on learning, practical implementation, certification preparation, and continuous student growth.",
    "telephone": "+91 9311073936",
    "email": "krglobal0713@gmail.com",
    "sameAs": [
      "https://www.linkedin.com/company/kr-global-learning",
      "https://github.com/krtech",
      "https://twitter.com/krglobal_learn",
      "https://www.youtube.com/@krgloballearning"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Unit No. 615, Artha Mart, Tech Zone IV",
      "addressLocality": "Greater Noida West",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201318",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    ]
  }),

  getWebSiteSchema: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KR GLOBAL LEARNING PRIVATE LIMITED",
    "url": "https://krgloballearning.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://krgloballearning.com/courses?search={search_term_string}",
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
      "name": "KR GLOBAL LEARNING PRIVATE LIMITED",
      "sameAs": "https://krgloballearning.com"
    },
    "courseCode": course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    "educationalCredentialAwarded": "Official KR GLOBAL LEARNING Certificate of Professional Mastery",
    "timeRequired": course.duration || "P12W",
    "offers": {
      "@type": "Offer",
      "category": "One-on-One Live Training with Senior Industry Architects",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://krgloballearning.com/courses/${course.slug || ""}`
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
