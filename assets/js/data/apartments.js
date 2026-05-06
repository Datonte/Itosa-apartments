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

export const APARTMENTS = [
  {
    id: "apt-001",
    slug: "surulere-1-bedroom",
    name: "The Surulere Suite",
    type: "1 Bedroom Apartment",
    location: "Surulere",
    city: "Lagos",
    address: "PLACEHOLDER_STREET, Surulere, Lagos",
    coords: { lat: 6.5009, lng: 3.3582 },          // Surulere centroid — update with exact location
    pricePerNight: 65000,
    currency: "NGN",
    minStayNights: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    rating: 4.9,
    reviewCount: 0,                                // PLACEHOLDER — increment as real reviews come in
    description:
      "A calm, modern 1-bedroom retreat in the heart of Surulere — minutes from the National Stadium and Barracks. Designed for guests who want quiet, secure rest after a long day in Lagos.",
    amenities: ["wifi", "ac", "kitchen", "smart_tv", "parking", "security", "inverter", "water"],
    landmarks: [
      { name: "National Stadium", distanceKm: 1.2 },
      { name: "Barracks",         distanceKm: 0.8 },
      { name: "Stadium Hotel",    distanceKm: 1.5 }
    ],
    gallery: [
      "/assets/images/placeholders/surulere-1-bedroom-1.jpg",
      "/assets/images/placeholders/surulere-1-bedroom-2.jpg",
      "/assets/images/placeholders/surulere-1-bedroom-3.jpg",
      "/assets/images/placeholders/surulere-1-bedroom-4.jpg",
      "/assets/images/placeholders/surulere-1-bedroom-5.jpg"
    ],
    galleryFallback: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
    houseRules: HOUSE_RULES_DEFAULT,
    damagePolicy: DAMAGE_POLICY_DEFAULT,
    status: "available",                           // available | renovation
    seo: {
      title: "Surulere 1-Bedroom Shortlet — ITOSA Apartment",
      description: "Book a clean, secure 1-bedroom shortlet in Surulere, Lagos. 24/7 inverter, fast WiFi, full kitchen. Direct booking, no hidden fees.",
      keywords: "surulere shortlet, surulere 1 bedroom apartment, shortlet apartment lagos, surulere apartment for rent"
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
  },
  {
    id: "apt-003",
    slug: "lagos-mainland-studio",
    name: "The Mainland Studio",
    type: "Studio Apartment",
    location: "Lagos Mainland",
    city: "Lagos",
    address: "PLACEHOLDER_STREET, Lagos Mainland",
    coords: { lat: 6.5244, lng: 3.3792 },
    pricePerNight: 45000,
    currency: "NGN",
    minStayNights: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    rating: 4.7,
    reviewCount: 0,
    description:
      "Stylish studio for solo travellers and couples. Smart TV, fast WiFi, complimentary water, and inverter backup so you never lose power. Walk to nearby cafés and transport links.",
    amenities: ["wifi", "ac", "kitchen", "smart_tv", "security", "inverter", "water", "workspace"],
    landmarks: [
      { name: "Yaba Market",   distanceKm: 1.8 },
      { name: "Onike Junction",distanceKm: 0.6 }
    ],
    gallery: [
      "/assets/images/placeholders/lagos-mainland-studio-1.jpg",
      "/assets/images/placeholders/lagos-mainland-studio-2.jpg",
      "/assets/images/placeholders/lagos-mainland-studio-3.jpg",
      "/assets/images/placeholders/lagos-mainland-studio-4.jpg",
      "/assets/images/placeholders/lagos-mainland-studio-5.jpg"
    ],
    galleryFallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    houseRules: HOUSE_RULES_DEFAULT,
    damagePolicy: DAMAGE_POLICY_DEFAULT,
    status: "available",
    seo: {
      title: "Lagos Mainland Studio Shortlet — ITOSA Apartment",
      description: "Affordable studio shortlet on the Lagos Mainland from ₦45,000 / night. 24/7 inverter, fast WiFi, secure entry. Direct booking online.",
      keywords: "lagos mainland shortlet, studio apartment lagos, affordable shortlet, lagos shortlet booking"
    }
  }
];

// Convenience: lookup by slug
export function getApartmentBySlug(slug) {
  return APARTMENTS.find((a) => a.slug === slug) || null;
}
