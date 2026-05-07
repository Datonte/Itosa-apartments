// ============================================================
// AVAILABILITY — pre-blocked date ranges per apartment slug.
// Dates are inclusive ISO strings: "YYYY-MM-DD".
// Edit here for permanent blocks, OR use /admin-availability
// to block via the UI (writes to localStorage).
// ============================================================

export const BOOKED_RANGES = {
  // Sample blocked windows so the calendar shows real disabled dates on first load.
  // Replace with your actual booking calendar before going live.
  "surulere-ground-floor": [
    // { start: "2026-06-10", end: "2026-06-14" }
  ],
  "surulere-first-floor": [],
  "surulere-second-floor": [],
  "isheri-2-bedroom": [
    // { start: "2026-05-20", end: "2026-05-25" }
  ]
};
