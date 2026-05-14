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

// Shared Isheri fields (same building, same amenities/landmarks/coords for all 6 units)
const ISHERI_SHARED = {
  location: "Isheri",
  city: "Lagos",
  address: "Block 11, Teju Royal Estate, 18 Azuka Nwosu Street, White House Bus Stop, Isheri-Osun Ijegun, Lagos",
  coords: { lat: 6.5520, lng: 3.2810 },           // approximate Isheri-Osun Ijegun; refine if needed
  currency: "NGN",
  minStayNights: 1,
  rating: 4.8,
  reviewCount: 0,
  amenities: ["wifi", "ac", "kitchen", "smart_tv", "parking", "security", "inverter", "water"],
  landmarks: [
    { name: "White House Event Hall", distanceKm: 1.8, travelByCar: "5 min", coords: { lat: 6.5530, lng: 3.2825 } }
  ],
  galleryFallback: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
  houseRules: HOUSE_RULES_DEFAULT,
  damagePolicy: DAMAGE_POLICY_DEFAULT,
  status: "available",
  groupSlug: "isheri",
  groupName: "Isheri — Teju Royal Estate"
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
    floor: "Ground Floor",
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
    floor: "First Floor",
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
    floor: "Second Floor",
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
    ...ISHERI_SHARED,
    id: "apt-002-zion-a",
    slug: "isheri-zion-a",
    name: "Zion A — Isheri Self-Contain",
    type: "Single Room (Self-Contain)",
    beds: 1, baths: 1, maxGuests: 2,
    pricePerNight: 20000,
    floor: "First Floor",
    floorLabel: "Zion A",
    groupOrder: 1,
    description:
      "Compact, modern self-contain studio on the first floor of Block 11, Teju Royal Estate. Private bath, kitchen, AC, and 24/7 inverter. Perfect for solo travellers and short stays.",
    gallery: [
      "/assets/images/placeholders/isheri-zion-a-1.jpg",
      "/assets/images/placeholders/isheri-zion-a-2.jpg",
      "/assets/images/placeholders/isheri-zion-a-3.jpg",
      "/assets/images/placeholders/isheri-zion-a-4.jpg"
    ],
    seo: {
      title: "Zion A — Isheri Self-Contain Shortlet | ITOSA Apartment",
      description: "Book Zion A, a clean self-contain studio in Isheri-Osun Ijegun, Lagos. 24/7 inverter, fast WiFi, private bath. From ₦20,000 / night.",
      keywords: "isheri self contain, isheri studio shortlet, ijegun shortlet, lagos single room"
    }
  },
  {
    ...ISHERI_SHARED,
    id: "apt-002-zion-b",
    slug: "isheri-zion-b",
    name: "Zion B — Isheri Self-Contain",
    type: "Single Room (Self-Contain)",
    beds: 1, baths: 1, maxGuests: 2,
    pricePerNight: 20000,
    floor: "First Floor",
    floorLabel: "Zion B",
    groupOrder: 2,
    description:
      "A second self-contain studio on the first floor — same calm, secure setup as Zion A. Private bath, kitchen, AC, 24/7 power. Great for solo or couple stays.",
    gallery: [
      "/assets/images/placeholders/isheri-zion-b-1.jpg",
      "/assets/images/placeholders/isheri-zion-b-2.jpg"
    ],
    seo: {
      title: "Zion B — Isheri Self-Contain Shortlet | ITOSA Apartment",
      description: "Book Zion B, a clean self-contain studio in Isheri-Osun Ijegun, Lagos. 24/7 inverter, fast WiFi, private bath. From ₦20,000 / night.",
      keywords: "isheri self contain, isheri studio shortlet, ijegun shortlet, lagos single room"
    }
  },
  {
    ...ISHERI_SHARED,
    id: "apt-002-ivie",
    slug: "isheri-ivie-home",
    name: "Ivie Home — Isheri 2-Bedroom",
    type: "2 Bedroom Apartment",
    beds: 2, baths: 2, maxGuests: 4,
    pricePerNight: 50000,
    floor: "First Floor",
    floorLabel: "Ivie Home",
    groupOrder: 3,
    description:
      "Spacious 2-bedroom on the first floor — full kitchen, two en-suite bathrooms, smart TV, and a quiet, secure compound. Comfortable for families and small groups.",
    gallery: [
      "/assets/images/placeholders/isheri-ivie-home-1.jpg",
      "/assets/images/placeholders/isheri-ivie-home-2.jpg",
      "/assets/images/placeholders/isheri-ivie-home-3.jpg",
      "/assets/images/placeholders/isheri-ivie-home-4.jpg",
      "/assets/images/placeholders/isheri-ivie-home-5.jpg",
      "/assets/images/placeholders/isheri-ivie-home-6.jpg",
      "/assets/images/placeholders/isheri-ivie-home-7.jpg",
      "/assets/images/placeholders/isheri-ivie-home-8.jpg",
      "/assets/images/placeholders/isheri-ivie-home-9.jpg"
    ],
    seo: {
      title: "Ivie Home — Isheri 2-Bedroom Shortlet | ITOSA Apartment",
      description: "Book Ivie Home, a 2-bedroom shortlet in Isheri-Osun Ijegun, Lagos. Two en-suite baths, full kitchen, 24/7 inverter. From ₦50,000 / night.",
      keywords: "isheri 2 bedroom shortlet, ijegun shortlet, lagos family shortlet, isheri apartment"
    }
  },
  {
    ...ISHERI_SHARED,
    id: "apt-002-nicole",
    slug: "isheri-nicole-home",
    name: "Nicole Home — Isheri 2-Bedroom",
    type: "2 Bedroom Apartment",
    beds: 2, baths: 2, maxGuests: 4,
    pricePerNight: 50000,
    floor: "First Floor",
    floorLabel: "Nicole Home",
    groupOrder: 4,
    description:
      "Bright 2-bedroom on the first floor — two en-suite bathrooms, full kitchen, smart TV, and dedicated parking. A relaxed family-friendly stay in Ijegun.",
    gallery: [
      "/assets/images/placeholders/isheri-nicole-home-1.jpg",
      "/assets/images/placeholders/isheri-nicole-home-2.jpg",
      "/assets/images/placeholders/isheri-nicole-home-3.jpg",
      "/assets/images/placeholders/isheri-nicole-home-4.jpg",
      "/assets/images/placeholders/isheri-nicole-home-5.jpg",
      "/assets/images/placeholders/isheri-nicole-home-6.jpg",
      "/assets/images/placeholders/isheri-nicole-home-7.jpg",
      "/assets/images/placeholders/isheri-nicole-home-8.jpg",
      "/assets/images/placeholders/isheri-nicole-home-9.jpg"
    ],
    seo: {
      title: "Nicole Home — Isheri 2-Bedroom Shortlet | ITOSA Apartment",
      description: "Book Nicole Home, a 2-bedroom shortlet in Isheri-Osun Ijegun, Lagos. Two en-suite baths, full kitchen, 24/7 inverter. From ₦50,000 / night.",
      keywords: "isheri 2 bedroom shortlet, ijegun shortlet, lagos family shortlet, isheri apartment"
    }
  },
  {
    ...ISHERI_SHARED,
    id: "apt-002-ee-tasha",
    slug: "isheri-ee-tasha",
    name: "EE Tasha — Isheri 2-Bedroom",
    type: "2 Bedroom Apartment",
    beds: 2, baths: 2, maxGuests: 4,
    pricePerNight: 50000,
    floor: "Ground Floor",
    floorLabel: "EE Tasha",
    groupOrder: 5,
    description:
      "Ground-floor 2-bedroom — easy access, two en-suite bathrooms, full kitchen, smart TV, secure parking. Quiet neighbourhood, 5 minutes to White House Event Hall.",
    gallery: [
      "/assets/images/placeholders/isheri-ee-tasha-1.jpg",
      "/assets/images/placeholders/isheri-ee-tasha-2.jpg",
      "/assets/images/placeholders/isheri-ee-tasha-3.jpg",
      "/assets/images/placeholders/isheri-ee-tasha-4.jpg"
    ],
    seo: {
      title: "EE Tasha — Isheri 2-Bedroom Shortlet | ITOSA Apartment",
      description: "Book EE Tasha, a ground-floor 2-bedroom shortlet in Isheri-Osun Ijegun, Lagos. Two en-suite baths, full kitchen, 24/7 inverter. From ₦50,000 / night.",
      keywords: "isheri 2 bedroom shortlet, ijegun shortlet, lagos family shortlet, isheri apartment"
    }
  },
  {
    ...ISHERI_SHARED,
    id: "apt-002-trey",
    slug: "isheri-trey",
    name: "Trey — Isheri 3-Bedroom",
    type: "3 Bedroom Apartment",
    beds: 3, baths: 4, maxGuests: 6,
    pricePerNight: 70000,
    floor: "Ground Floor",
    floorLabel: "Trey",
    groupOrder: 6,
    description:
      "Roomy 3-bedroom on the ground floor — three en-suite bedrooms plus a visitor toilet, full kitchen, smart TV, secure parking. Built for families, friends, and longer stays.",
    gallery: [
      "/assets/images/placeholders/isheri-trey-1.jpg",
      "/assets/images/placeholders/isheri-trey-2.jpg",
      "/assets/images/placeholders/isheri-trey-3.jpg",
      "/assets/images/placeholders/isheri-trey-4.jpg",
      "/assets/images/placeholders/isheri-trey-5.jpg",
      "/assets/images/placeholders/isheri-trey-6.jpg",
      "/assets/images/placeholders/isheri-trey-7.jpg"
    ],
    seo: {
      title: "Trey — Isheri 3-Bedroom Shortlet | ITOSA Apartment",
      description: "Book Trey, a ground-floor 3-bedroom shortlet in Isheri-Osun Ijegun, Lagos. Three en-suite baths plus visitor toilet, full kitchen, 24/7 inverter. From ₦70,000 / night.",
      keywords: "isheri 3 bedroom shortlet, ijegun shortlet, lagos family shortlet, isheri apartment"
    }
  }
];

// Convenience: lookup by slug
export function getApartmentBySlug(slug) {
  return APARTMENTS.find((a) => a.slug === slug) || null;
}
