// ============================================================
// STORE — single read/write surface for apartments, bookings,
// and availability.
//
// Apartments: sync (static JS module) — admin overrides in localStorage.
// Bookings: async — primary store is Supabase, fallback to localStorage.
// Availability: async — primary store is Supabase, fallback to localStorage.
//
// Every page imports from here. To swap to a different backend,
// replace the Supabase calls inside each function — signatures stay the same.
// ============================================================

import { APARTMENTS as DEFAULT_APARTMENTS } from "./apartments.js";
import { BOOKED_RANGES as DEFAULT_BLOCKED } from "./availability.js";
import { db } from "./supabase.js";

const KEYS = {
  apartments: "itosa.apartments_overrides",
  blocked: "itosa.blocked_overrides",
  bookings: "itosa.bookings"
};

// ---------- localStorage helpers ----------
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[store] failed to write", key, e);
  }
}

// ---------- row mappers (JS camelCase ↔ Supabase snake_case) ----------
function bookingToRow(b) {
  return {
    id: b.id,
    apartment_slug: b.apartmentSlug,
    guest_name: b.name,
    guest_email: b.email,
    guest_phone: b.phone,
    guests: b.guests,
    checkin: b.checkin,
    checkout: b.checkout,
    nights: b.nights,
    subtotal: b.totals?.subtotal ?? 0,
    cleaning_fee: b.totals?.cleaningFee ?? 0,
    service_fee: b.totals?.serviceFee ?? 0,
    total: b.totals?.total ?? 0,
    special_requests: b.specialRequests || null,
    paystack_ref: b.paystackRef || null,
    payment_status: b.paymentStatus || "pending_verification",
    created_at: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString()
  };
}

function rowToBooking(row) {
  return {
    id: row.id,
    apartmentSlug: row.apartment_slug,
    name: row.guest_name,
    email: row.guest_email,
    phone: row.guest_phone,
    guests: row.guests,
    checkin: row.checkin,
    checkout: row.checkout,
    nights: row.nights,
    totals: {
      subtotal: row.subtotal,
      cleaningFee: row.cleaning_fee,
      serviceFee: row.service_fee,
      total: row.total
    },
    specialRequests: row.special_requests,
    paystackRef: row.paystack_ref,
    paymentStatus: row.payment_status,
    createdAt: new Date(row.created_at).getTime()
  };
}

// ---------- apartments (sync — static data + localStorage overrides) ----------
export function getApartments() {
  const overrides = readJSON(KEYS.apartments, {});
  const merged = DEFAULT_APARTMENTS.map((a) => ({ ...a, ...(overrides[a.slug] || {}) }));
  Object.values(overrides).forEach((a) => {
    if (a && a.slug && !merged.find((m) => m.slug === a.slug)) merged.push(a);
  });
  return merged.filter((a) => !a.__deleted);
}

export function getApartmentBySlug(slug) {
  return getApartments().find((a) => a.slug === slug) || null;
}

export function saveApartment(apt) {
  if (!apt || !apt.slug) throw new Error("saveApartment: slug is required");
  const overrides = readJSON(KEYS.apartments, {});
  overrides[apt.slug] = { ...(overrides[apt.slug] || {}), ...apt };
  writeJSON(KEYS.apartments, overrides);
  return apt;
}

export function deleteApartment(slug) {
  const overrides = readJSON(KEYS.apartments, {});
  const isDefault = DEFAULT_APARTMENTS.find((a) => a.slug === slug);
  if (isDefault) {
    overrides[slug] = { slug, __deleted: true };
  } else {
    delete overrides[slug];
  }
  writeJSON(KEYS.apartments, overrides);
}

export function exportApartmentsAsCode() {
  return "export const APARTMENTS = " + JSON.stringify(getApartments(), null, 2) + ";";
}

// ---------- bookings (async — Supabase primary, localStorage fallback) ----------
export async function getBookings() {
  try {
    const { data, error } = await db
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const bookings = data.map(rowToBooking);
    writeJSON(KEYS.bookings, bookings);
    return bookings;
  } catch (err) {
    console.warn("[store] getBookings: Supabase failed, using localStorage", err);
    return readJSON(KEYS.bookings, []);
  }
}

export async function saveBooking(booking) {
  if (!booking || !booking.id) throw new Error("saveBooking: id is required");
  const row = bookingToRow(booking);
  try {
    const { error } = await db.from("bookings").upsert(row, { onConflict: "id" });
    if (error) throw error;
  } catch (err) {
    console.warn("[store] saveBooking: Supabase failed, writing to localStorage", err);
    const all = readJSON(KEYS.bookings, []);
    const idx = all.findIndex((b) => b.id === booking.id);
    if (idx >= 0) all[idx] = { ...all[idx], ...booking };
    else all.unshift(booking);
    writeJSON(KEYS.bookings, all);
  }
  return booking;
}

export async function getBookingById(id) {
  try {
    const { data, error } = await db
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToBooking(data) : null;
  } catch (err) {
    console.warn("[store] getBookingById: Supabase failed, using localStorage", err);
    return readJSON(KEYS.bookings, []).find((b) => b.id === id) || null;
  }
}

export async function getBookingByRef(ref) {
  try {
    const { data, error } = await db
      .from("bookings")
      .select("*")
      .eq("paystack_ref", ref)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToBooking(data) : null;
  } catch (err) {
    console.warn("[store] getBookingByRef: Supabase failed, using localStorage", err);
    return readJSON(KEYS.bookings, []).find((b) => b.paystackRef === ref) || null;
  }
}

export async function deleteBooking(id) {
  try {
    const { error } = await db.from("bookings").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.warn("[store] deleteBooking: Supabase failed, deleting from localStorage", err);
    const all = readJSON(KEYS.bookings, []).filter((b) => b.id !== id);
    writeJSON(KEYS.bookings, all);
  }
}

export async function updateBookingStatus(id, status) {
  try {
    const { data, error } = await db
      .from("bookings")
      .update({ payment_status: status })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToBooking(data) : null;
  } catch (err) {
    console.warn("[store] updateBookingStatus: Supabase failed, using localStorage", err);
    const all = readJSON(KEYS.bookings, []);
    const b = all.find((x) => x.id === id);
    if (!b) return null;
    b.paymentStatus = status;
    writeJSON(KEYS.bookings, all);
    return b;
  }
}

// ---------- availability (async — Supabase primary, localStorage fallback) ----------
export async function getBlockedDates(slug) {
  try {
    const { data, error } = await db
      .from("blocked_dates")
      .select("start_date, end_date")
      .eq("apartment_slug", slug);
    if (error) throw error;
    const ranges = data.map((r) => ({ start: r.start_date, end: r.end_date }));
    // Cache in localStorage
    const cache = readJSON(KEYS.blocked, {});
    cache[slug] = ranges;
    writeJSON(KEYS.blocked, cache);
    return ranges;
  } catch (err) {
    console.warn("[store] getBlockedDates: Supabase failed, using fallback", err);
    const overrides = readJSON(KEYS.blocked, {});
    return overrides[slug] !== undefined ? overrides[slug] : (DEFAULT_BLOCKED[slug] || []);
  }
}

export async function setBlockedDates(slug, ranges) {
  try {
    // Replace all rows for this slug
    const { error: delErr } = await db
      .from("blocked_dates")
      .delete()
      .eq("apartment_slug", slug);
    if (delErr) throw delErr;

    if (ranges.length > 0) {
      const rows = ranges.map((r) => ({
        apartment_slug: slug,
        start_date: r.start,
        end_date: r.end
      }));
      const { error: insErr } = await db.from("blocked_dates").insert(rows);
      if (insErr) throw insErr;
    }
  } catch (err) {
    console.warn("[store] setBlockedDates: Supabase failed, writing to localStorage", err);
  }
  // Always update localStorage cache too
  const overrides = readJSON(KEYS.blocked, {});
  overrides[slug] = ranges;
  writeJSON(KEYS.blocked, overrides);
}

export async function getAllBlockedRanges() {
  const overrides = readJSON(KEYS.blocked, {});
  const out = { ...DEFAULT_BLOCKED };
  Object.keys(overrides).forEach((k) => { out[k] = overrides[k]; });
  return out;
}

// Effective blocked = manually blocked dates + confirmed/pending bookings
export async function getEffectiveBlockedDates(slug) {
  const [blocked, bookings] = await Promise.all([
    getBlockedDates(slug),
    getBookings()
  ]);
  const fromBookings = bookings
    .filter((b) => b.apartmentSlug === slug && b.paymentStatus !== "cancelled" && b.paymentStatus !== "failed")
    .map((b) => ({ start: b.checkin, end: subOneDay(b.checkout) }));
  return [...(blocked || []), ...fromBookings];
}

function subOneDay(iso) {
  const d = new Date(iso);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ---------- demo helpers ----------
export function clearAllOverrides() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
