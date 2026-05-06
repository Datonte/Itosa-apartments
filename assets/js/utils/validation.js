// Lightweight input validators. Each returns { ok: boolean, msg?: string }.

const NG_PHONE = /^(\+?234|0)[789][01]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value) {
  const v = String(value || "").trim();
  if (v.length < 2) return { ok: false, msg: "Please enter your full name." };
  if (v.length > 80) return { ok: false, msg: "Name is too long." };
  return { ok: true };
}

export function validateEmail(value) {
  const v = String(value || "").trim();
  if (!EMAIL.test(v)) return { ok: false, msg: "Enter a valid email address." };
  return { ok: true };
}

export function validatePhoneNG(value) {
  const v = String(value || "").trim().replace(/\s+/g, "");
  if (!NG_PHONE.test(v)) return { ok: false, msg: "Enter a Nigerian phone number (e.g. 08012345678 or +2348012345678)." };
  return { ok: true };
}

export function validateGuests(value, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return { ok: false, msg: "At least 1 guest is required." };
  if (max && n > max) return { ok: false, msg: `Maximum ${max} guests for this apartment.` };
  return { ok: true };
}

export function validateDates(checkin, checkout) {
  if (!checkin || !checkout) return { ok: false, msg: "Pick a check-in and check-out date." };
  if (new Date(checkin) >= new Date(checkout)) return { ok: false, msg: "Check-out must be after check-in." };
  if (new Date(checkin) < new Date(new Date().toISOString().slice(0,10))) return { ok: false, msg: "Check-in cannot be in the past." };
  return { ok: true };
}
