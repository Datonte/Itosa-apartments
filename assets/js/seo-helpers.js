// JSON-LD builders for Schema.org structured data.
// Each helper returns a JSON object — callers stringify and inject into a <script type="application/ld+json"> tag.

import { BRAND, POLICIES } from "./data/config.js";

export function buildLocalBusinessLD() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: BRAND.name,
    description: BRAND.description,
    url: BRAND.domain,
    image: BRAND.domain + BRAND.ogDefaultImage,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressRegion: "Lagos",
      addressCountry: "NG",
      streetAddress: BRAND.address
    },
    areaServed: BRAND.serviceAreas.map((a) => ({ "@type": "City", name: a })),
    sameAs: Object.values(BRAND.social || {}).filter(Boolean),
    checkinTime: POLICIES.checkInTime,
    checkoutTime: POLICIES.checkOutTime,
    priceRange: "₦₦"
  };
}

export function buildBreadcrumbLD(items) {
  // items: [{ name, url }]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url
    }))
  };
}

export function buildAccommodationLD(apt, amenityCatalog = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: apt.name,
    description: apt.description,
    image: (apt.gallery && apt.gallery.length ? apt.gallery : [apt.galleryFallback]).map((u) =>
      u.startsWith("http") ? u : BRAND.domain + u
    ),
    url: BRAND.domain + "/apartments/" + apt.slug,
    address: {
      "@type": "PostalAddress",
      streetAddress: apt.address,
      addressLocality: apt.location || "Lagos",
      addressRegion: "Lagos",
      addressCountry: "NG"
    },
    geo: apt.coords && {
      "@type": "GeoCoordinates",
      latitude: apt.coords.lat,
      longitude: apt.coords.lng
    },
    numberOfRooms: apt.beds,
    occupancy: { "@type": "QuantitativeValue", maxValue: apt.maxGuests },
    amenityFeature: (apt.amenities || []).map((key) => ({
      "@type": "LocationFeatureSpecification",
      name: amenityCatalog[key]?.label || key,
      value: true
    })),
    priceRange: "₦" + (apt.pricePerNight || 0).toLocaleString(),
    offers: {
      "@type": "Offer",
      price: apt.pricePerNight,
      priceCurrency: apt.currency || "NGN",
      url: BRAND.domain + "/apartments/" + apt.slug,
      availability: apt.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
}

export function buildItemListLD(apartments) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: apartments.map((apt, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: BRAND.domain + "/apartments/" + apt.slug,
      name: apt.name
    }))
  };
}

export function buildFAQLD(qa) {
  // qa: [{ q, a }]
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
}

export function buildContactPageLD() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact " + BRAND.name,
    url: BRAND.domain + "/contact",
    mainEntity: buildLocalBusinessLD()
  };
}

export function buildWebPageLD({ title, url, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url,
    description,
    publisher: { "@type": "Organization", name: BRAND.name, url: BRAND.domain }
  };
}

// Inject one or more LD blocks into the document <head>.
export function injectLD(...blocks) {
  blocks.forEach((b) => {
    if (!b) return;
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(b);
    document.head.appendChild(s);
  });
}
