// ============================================================
// APARTMENTS — placeholder data.
// To add or edit a listing in production, EITHER:
//   (a) edit this file directly (permanent — commit + deploy), OR
//   (b) use /admin-apartments which writes overrides to localStorage
//       (browser-local; export from admin to promote to permanent).
//
// Image paths point at /assets/images/placeholders/<slug>-N.jpg.
// Drop your real photos at those paths to replace them — no code changes needed.
// ============================================================

export const AMENITY_CATALOG = {
  wifi:        { label: "Fast WiFi",            icon: "wifi" },
  ac:          { label: "Air Conditioning",     icon: "ac_unit" },
  kitchen:     { label: "Full Kitchen",         icon: "kitchen" },
  smart_tv:    { label: "Smart TV",             icon: "tv" },
  parking:     { label: "Secure Parking",       icon: "local_parking" },
  security:    { label: "24/7 Security",        icon: "security" },
  inverter:    { label: "Inverter — 24/7 Power",icon: "bolt" },
  water:       { label: "Complimentary Water",  icon: "water_drop" },
  workspace:   { label: "Dedicated Workspace",  icon: "laptop_chromebook" },
  washer:      { label: "Washer / Dryer",       icon: "local_laundry_service" },
  balcony:     { label: "Private Balcony",      icon: "balcony" }
};

const HOUSE_RULES_DEFAULT = [
  { icon: "ac_unit",        rule: "One AC at a time — please conserve power." },
  { icon: "power",          rule: "Turn off electronics when leaving the apartment." },
  { icon: "smoke_free",     rule: "No smoking anywhere on the premises." },
  { icon: "pets",           rule: "No pets allowed." },
  { icon: "cleaning_services", rule: "Standard cleaning every 5 days. Extra cleaning available on request." },
  { icon: "schedule",       rule: "Check-in from 3:00 PM. Check-out by 11:00 AM." }
];

const DAMAGE_POLICY_DEFAULT = {
  summary: "Guests are responsible for any damage during their stay.",
  itemsCovered: ["Air conditioner", "Flooring", "Doors and windows", "Wardrobes", "Smart TV"],
  note: "A walk-through is conducted at check-in and check-out. Major damages will be invoiced separately."
};

// Shared Surulere fields (same building, same amenities/landmarks/coords for all 3 floors)
const SURULERE_SHARED = {
  type: "1 Bedroom Apartment",
  location: "Surulere",
  city: "Lagos",
  address: "SD 7, Colindale Park Estate, Surulere, Lagos 101241",
  coords: { lat: 6.5009, lng: 3.3582 },
  pricePerNight: 65000,
  currency: "NGN",
  minStayNights: 1,
  beds: 1,
  baths: 1,
  maxGuests: 2,
  rating: 4.9,
  reviewCount: 0,
  description:
    "A calm, modern 1-bedroom retreat in the heart of Surulere — minutes from the National Stadium and Barracks. Designed for guests who want quiet, secure rest after a long day in Lagos.",
  amenities: ["wifi", "ac", "kitchen", "smart_tv", "parking", "security", "inverter", "water"],
  landmarks: [
    { name: "Femi Gbajabiamila General Hospital", distanceKm: 0.3,  travelByCar: "2 min",  coords: { lat: 6.4980, lng: 3.3590 } },
    { name: "National Stadium",                   distanceKm: 2.0,  travelByCar: "8 min",  coords: { lat: 6.5006, lng: 3.3625 } },
    { name: "National Theatre",                   distanceKm: 8.5,  travelByCar: "21 min", coords: { lat: 6.4707, lng: 3.3833 } },
    { name: "NTA Lagos",                          distanceKm: 9.0,  travelByCar: "22 min", coords: { lat: 6.5095, lng: 3.3711 } },
    { name: "Lagos International Airport",        distanceKm: 20.0, travelByCar: "25 min", coords: { lat: 6.5774, lng: 3.3214 } },
    { name: "Lekki",                              distanceKm: 22.0, travelByCar: "30 min", coords: { lat: 6.4474, lng: 3.4710 } },
    { name: "Victoria Island",                    distanceKm: 28.0, travelByCar: "45 min", coords: { lat: 6.4281, lng: 3.4219 } }
  ],
  galleryFallback: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
  houseRules: HOUSE_RULES_DEFAULT,
  damagePolicy: DAMAGE_POLICY_DEFAULT,
  status: "available",
  groupSlug: "surulere",
  groupName: "Surulere — Colindale Park Estate"
};

export const APARTMENTS = [
  {
    ...SURULERE_SHARED,
    id: "apt-001-g",
    slug: "surulere-ground-floor",
    name: "The Surulere Suite — Ground Floor",
    floorLabel: "Ground Floor",
    groupOrder: 1,
    gallery: [
      "/assets/images/placeholders/surulere-ground-floor-1.jpg",
      "/assets/images/placeholders/surulere-ground-floor-2.jpg",
      "/assets/images/placeholders/surulere-ground-floor-3.jpg",
      "/assets/images/placeholders/surulere-ground-floor-4.jpg",
      "/assets/images/placeholders/surulere-ground-floor-5.jpg",
      "/assets/images/placeholders/surulere-ground-floor-6.jpg"
    ],
    seo: {
      title: "Surulere Shortlet — Ground Floor 1BR | ITOSA Apartment",
      description: "Book the ground-floor 1-bedroom shortlet at SD 7 Colindale Park, Surulere. 24/7 inverter, fast WiFi, full kitchen. Direct booking, no hidden fees.",
      keywords: "surulere ground floor shortlet, surulere 1 bedroom apartment, shortlet apartment lagos"
    }
  },
  {
    ...SURULERE_SHARED,
    id: "apt-001-1",
    slug: "surulere-first-floor",
    name: "The Surulere Suite — First Floor",
    floorLabel: "First Floor",
    groupOrder: 2,
    gallery: [
      "/assets/images/placeholders/surulere-first-floor-1.jpg",
      "/assets/images/placeholders/surulere-first-floor-2.jpg",
      "/assets/images/placeholders/surulere-first-floor-3.jpg",
      "/assets/images/placeholders/surulere-first-floor-4.jpg",
      "/assets/images/placeholders/surulere-first-floor-5.jpg",
      "/assets/images/placeholders/surulere-first-floor-6.jpg"
    ],
    seo: {
      title: "Surulere Shortlet — First Floor 1BR | ITOSA Apartment",
      description: "Book the first-floor 1-bedroom shortlet at SD 7 Colindale Park, Surulere. 24/7 inverter, fast WiFi, full kitchen. Direct booking, no hidden fees.",
      keywords: "surulere first floor shortlet, surulere 1 bedroom apartment, shortlet apartment lagos"
    }
  },
  {
    ...SURULERE_SHARED,
    id: "apt-001-2",
    slug: "surulere-second-floor",
    name: "The Surulere Suite — Second Floor",
    floorLabel: "Second Floor",
    groupOrder: 3,
    gallery: [
      "/assets/images/placeholders/surulere-second-floor-1.jpg",
      "/assets/images/placeholders/surulere-second-floor-2.jpg",
      "/assets/images/placeholders/surulere-second-floor-3.jpg",
      "/assets/images/placeholders/surulere-second-floor-4.jpg",
      "/assets/images/placeholders/surulere-second-floor-5.jpg"
    ],
    seo: {
      title: "Surulere Shortlet — Second Floor 1BR | ITOSA Apartment",
      description: "Book the second-floor 1-bedroom shortlet at SD 7 Colindale Park, Surulere. 24/7 inverter, fast WiFi, full kitchen. Direct booking, no hidden fees.",
      keywords: "surulere second floor shortlet, surulere 1 bedroom apartment, shortlet apartment lagos"
    }
  },
  {
    id: "apt-002",
    slug: "isheri-2-bedroom",
    name: "The Isheri Loft",
    type: "2 Bedroom Apartment",
    location: "Isheri",
    city: "Lagos",
    address: "PLACEHOLDER_STREET, Isheri, Lagos",
    coords: { lat: 6.6322, lng: 3.3470 },
    pricePerNight: 95000,
    currency: "NGN",
    minStayNights: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    rating: 4.8,
    reviewCount: 0,
    description:
      "Spacious 2-bedroom apartment in Isheri — perfect for families and small groups. Full kitchen, dedicated workspace, secure parking, and a quiet neighborhood that lets you actually rest.",
    amenities: ["wifi", "ac", "kitchen", "smart_tv", "parking", "security", "inverter", "water", "workspace", "washer"],
    landmarks: [
      { name: "Isheri-Magodo Bridge", distanceKm: 1.0 },
      { name: "Berger Bus Stop",      distanceKm: 2.4 }
    ],
    gallery: [
      "/assets/images/placeholders/isheri-2-bedroom-1.jpg",
      "/assets/images/placeholders/isheri-2-bedroom-2.jpg",
      "/assets/images/placeholders/isheri-2-bedroom-3.jpg",
      "/assets/images/placeholders/isheri-2-bedroom-4.jpg",
      "/assets/images/placeholders/isheri-2-bedroom-5.jpg"
    ],
    galleryFallback: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    houseRules: HOUSE_RULES_DEFAULT,
    damagePolicy: DAMAGE_POLICY_DEFAULT,
    status: "available",
    seo: {
      title: "Isheri 2-Bedroom Shortlet — ITOSA Apartment",
      description: "Book a 2-bedroom shortlet apartment in Isheri, Lagos. Family-friendly, secure, 24/7 inverter, fast WiFi. Direct booking from ₦95,000 / night.",
      keywords: "isheri shortlet, isheri 2 bedroom, shortlet apartment lagos, family shortlet lagos"
    }
  }
];

// Convenience: lookup by slug
export function getApartmentBySlug(slug) {
  return APARTMENTS.find((a) => a.slug === slug) || null;
}
