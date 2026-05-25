// ============================================================
// BRAND, PAYMENT, FEES — central configuration.
// Replace any "PLACEHOLDER_*" value before going live.
// ============================================================

export const BRAND = {
  name: "ITOSA APARTMENT",
  tagline: "Rest. Relax. Recharge.",
  description:
    "Premium shortlet apartments in Lagos — Surulere & Isheri. Direct booking, secure payment, no hidden fees.",
  // CONTACT
  phone:    "+234 808 591 8163",         // primary line (tel: href is auto-stripped to digits)
  phoneAlt: "+234 813 662 0256",         // secondary line
  whatsapp: "2348139970432",             // WhatsApp number, digits only with country code, no '+'
  email: "itosaapartmentss@gmail.com",
  address: "Lagos, Nigeria",             // street + city. Update once you have a public address.
  // SOCIAL — replace each with full URL
  social: {
    instagram: "https://instagram.com/PLACEHOLDER_HANDLE",
    twitter:   "https://x.com/PLACEHOLDER_HANDLE",
    facebook:  "https://facebook.com/PLACEHOLDER_HANDLE",
    tiktok:    "https://tiktok.com/@PLACEHOLDER_HANDLE"
  },
  // GEO targets — used for SEO copy + JSON-LD
  serviceAreas: ["Lagos", "Surulere", "Isheri"],
  // SITE
  domain: "https://itosa-apartments.com",  // PLACEHOLDER — replace with your real domain
  ogDefaultImage: "/assets/images/icons/og-default.svg"  // SVG placeholder — replace with og-default.jpg (1200x630) for real social previews
};

export const PAYMENT = {
  // "bank-transfer" → guest sees bank transfer instructions, admin manually confirms.
  // "paystack"      → guest pays online via Paystack inline checkout.
  // Flip this single value to switch the whole booking flow once Paystack is live.
  mode: "bank-transfer",

  // Paystack public key — safe in the browser (only public keys belong here).
  // Test key currently active. When KYC clears, swap for the live key starting pk_live_…
  // Dashboard: https://dashboard.paystack.com/#/settings/developer
  paystackPublicKey: "pk_test_b79619dd1a02b34cfdeb57edb936a4053e7f6884",
  currency: "NGN"
};

// Bank account for manual transfers (used when PAYMENT.mode === "bank-transfer").
export const BANK = {
  accountNumber: "3091820975",
  bankName: "First Bank",
  accountName: "Ayodele James"
};

export const FEES = {
  cleaningFee: 15000,    // ₦ flat per booking
  serviceFeeRate: 0.08,  // 8% of subtotal
  cautionDeposit: 0      // optional refundable damage deposit; set > 0 to add to total
};

export const SUPABASE = {
  url: "https://hbruquongmzndoztctwo.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicnVxdW9uZ216bmRvenRjdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODc4NjIsImV4cCI6MjA5MzY2Mzg2Mn0.mXlJO8xszhTGP5Wljn1_jZKV7KZaoWuUHibAQmlMQKo"
};

export const POLICIES = {
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  minimumStayNights: 1,         // override per apartment in apartments.js if you need
  cancellationSummary: "Full refund if cancelled more than 14 days before check-in. 70% refund 8–14 days before. 50% refund 4–7 days before. 25% refund 48–72 hours before. No refund within 48 hours or for no-shows.",
  petsAllowed: false,
  smokingAllowed: false
};
