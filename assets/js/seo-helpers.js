// JSON-LD builders for Schema.org structured data.
// Each helper returns a JSON object — callers stringify and inject into a <script type="application/ld+json"> tag.
//
// IMPORTANT: Review schema must always be NESTED inside another schema type
// (Apartment, LodgingBusiness, etc.) — never standalone — or Google rejects it.

import { BRAND, POLICIES } from "./data/config.js";

// ---------- ratings + reviews ----------

export function buildAggregateRatingLD(reviews) {
  if (!reviews || !reviews.length) return null;
  const ratings = reviews.map((r) => r.rating).filter((n) => typeof n === "number");
  if (!ratings.length) return null;
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(avg.toFixed(1)),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  };
}

// Parse "April 2025" → "2025-04-01" (1st of the month — Schema.org accepts month-precision)
function parseReviewDate(s) {
  if (!s) return undefined;
  const months = { january:"01", february:"02", march:"03", april:"04", may:"05", june:"06",
                   july:"07", august:"08", september:"09", october:"10", november:"11", december:"12" };
  const parts = String(s).trim().split(/\s+/);
  if (parts.length === 2) {
    const m = months[parts[0].toLowerCase()];
    const y = parts[1];
    if (m && /^\d{4}$/.test(y)) return `${y}-${m}-01`;
  }
  return undefined;
}

export function buildReviewLD(r) {
  const out = {
    "@type": "Review",
    author: { "@type": "Person", name: r.name + (r.location ? ", " + r.location : "") },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    reviewBody: r.text
  };
  const dp = parseReviewDate(r.date);
  if (dp) out.datePublished = dp;
  return out;
}

// ---------- nearby attractions ----------

export function buildPlaceLD(landmark) {
  if (!landmark || !landmark.name) return null;
  const place = { "@type": "Place", name: landmark.name };
  if (landmark.coords) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: landmark.coords.lat,
      longitude: landmark.coords.lng
    };
  }
  return place;
}

// ---------- main builders ----------

export function buildLocalBusinessLD(reviews) {
  const out = {
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
    areaServed: (BRAND.serviceAreas || []).map((a) => ({ "@type": "City", name: a })),
    sameAs: Object.values(BRAND.social || {}).filter(Boolean),
    checkinTime: POLICIES.checkInTime,
    checkoutTime: POLICIES.checkOutTime,
    priceRange: BRAND.priceRange || "₦20,000–₦70,000"
  };
  if (reviews && reviews.length) {
    const agg = buildAggregateRatingLD(reviews);
    if (agg) out.aggregateRating = agg;
    out.review = reviews.slice(0, 3).map(buildReviewLD);
  }
  return out;
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

export function buildAccommodationLD(apt, amenityCatalog = {}, reviews) {
  const out = {
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

  // hasMap — direct link to Google Maps coords
  if (apt.coords) {
    out.hasMap = "https://www.google.com/maps/search/?api=1&query=" + apt.coords.lat + "," + apt.coords.lng;
  }

  // nearbyAttraction — landmarks with names (coords optional)
  if (apt.landmarks && apt.landmarks.length) {
    out.nearbyAttraction = apt.landmarks.map(buildPlaceLD).filter(Boolean);
  }

  // Reviews + aggregateRating — must be nested under itemReviewed (this Apartment)
  if (reviews && reviews.length) {
    const agg = buildAggregateRatingLD(reviews);
    if (agg) out.aggregateRating = agg;
    out.review = reviews.slice(0, 5).map(buildReviewLD);
  }

  return out;
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

export function buildContactPageLD(reviews) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact " + BRAND.name,
    url: BRAND.domain + "/contact",
    mainEntity: buildLocalBusinessLD(reviews)
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
