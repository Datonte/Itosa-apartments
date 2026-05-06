// ============================================================
// STORE — single read/write surface for apartments, bookings,
// and availability. Reads from data modules first, mirrors any
// mutations to localStorage. THIS IS THE SWAP-IN-A-BACKEND SEAM:
// every page imports from here, never from the raw data modules
// (except the data modules themselves).
//
// To swap in a real backend later, replace the bodies of these
// functions with fetch() calls — keep the same signatures and
// nothing else needs to change.
// ============================================================

import { APARTMENTS as DEFAULT_APARTMENTS } from "./apartments.js";
import { BOOKED_RANGES as DEFAULT_BLOCKED } from "./availability.js";

const KEYS = {
  apartments: "itosa.apartments_overrides",
  blocked: "itosa.blocked_overrides",
  bookings: "itosa.bookings"
};

// ---------- internal helpers ----------
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

// ---------- apartments ----------
// Strategy: defaults from the data file are the baseline; localStorage
// holds an "overrides" map keyed by slug that wins over the default.
// Apartments created in admin live entirely in localStorage with a slug.
export function getApartments() {
  const overrides = readJSON(KEYS.apartments, {});
  const merged = DEFAULT_APARTMENTS.map((a) => ({ ...a, ...(overrides[a.slug] || {}) }));
  // Add any pure-localStorage additions (slugs not in defaults)
  Object.values(overrides).forEach((a) => {
    if (a && a.slug && !merged.find((m) => m.slug === a.slug)) merged.push(a);
  });
  // Filter out hard-deleted apartments (override with __deleted: true)
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
  // For a default apartment, mark deleted so it filters out.
  // For a localStorage-only apartment, simply remove the override.
  const isDefault = DEFAULT_APARTMENTS.find((a) => a.slug === slug);
  if (isDefault) {
    overrides[slug] = { slug, __deleted: true };
  } else {
    delete overrides[slug];
  }
  writeJSON(KEYS.apartments, overrides);
}

export function exportApartmentsAsCode() {
  // For the admin "Export changes" button.
  // Produces a JS snippet the maintainer can paste into apartments.js.
  const apts = getApartments();
  return "export const APARTMENTS = " + JSON.stringify(apts, null, 2) + ";";
}

// ---------- availability ----------
export function getBlockedDates(slug) {
  const overrides = readJSON(KEYS.blocked, {});
  const fromDefault = DEFAULT_BLOCKED[slug] || [];
  const fromOverride = overrides[slug];
  // Override fully replaces if present
  return fromOverride !== undefined ? fromOverride : fromDefault;
}

export function setBlockedDates(slug, ranges) {
  const overrides = readJSON(KEYS.blocked, {});
  overrides[slug] = ranges;
  writeJSON(KEYS.blocked, overrides);
}

export function getAllBlockedRanges() {
  // Returns merged map { slug: ranges[] } across defaults + overrides
  const overrides = readJSON(KEYS.blocked, {});
  const out = { ...DEFAULT_BLOCKED };
  Object.keys(overrides).forEach((k) => { out[k] = overrides[k]; });
  return out;
}

// Effective blocked = manually blocked + booked (paid or pending) bookings
export function getEffectiveBlockedDates(slug) {
  const blocked = getBlockedDates(slug) || [];
  const bookings = getBookings()
    .filter((b) => b.apartmentSlug === slug && b.paymentStatus !== "cancelled" && b.paymentStatus !== "failed")
    .map((b) => ({ start: b.checkin, end: subOneDay(b.checkout) })); // checkout day is free
  return [...blocked, ...bookings];
}

function subOneDay(iso) {
  const d = new Date(iso);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ---------- bookings ----------
export function getBookings() {
  return readJSON(KEYS.bookings, []);
}

export function saveBooking(booking) {
  if (!booking || !booking.id) throw new Error("saveBooking: id is required");
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === booking.id);
  if (idx >= 0) all[idx] = { ...all[idx], ...booking };
  else all.unshift(booking);
  writeJSON(KEYS.bookings, all);
  return booking;
}

export function getBookingById(id) {
  return getBookings().find((b) => b.id === id) || null;
}

export function getBookingByRef(ref) {
  return getBookings().find((b) => b.paystackRef === ref) || null;
}

export function deleteBooking(id) {
  const all = getBookings().filter((b) => b.id !== id);
  writeJSON(KEYS.bookings, all);
}

export function updateBookingStatus(id, status) {
  const b = getBookingById(id);
  if (!b) return null;
  b.paymentStatus = status;
  return saveBooking(b);
}

// ---------- demo helpers ----------
export function clearAllOverrides() {
  // Used by admin "Reset to defaults" button.
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
