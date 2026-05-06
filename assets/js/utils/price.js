// Price calculations.

import { FEES } from "../data/config.js";

export function calcSubtotal(rate, nights) {
  return Math.max(0, Number(rate) * Number(nights));
}

export function calcServiceFee(subtotal, rate = FEES.serviceFeeRate) {
  return Math.round(Number(subtotal) * Number(rate));
}

// Single source of truth for the totals breakdown shown on the booking page.
export function calcTotal({ rate, nights, cleaning = FEES.cleaningFee, serviceRate = FEES.serviceFeeRate, caution = FEES.cautionDeposit }) {
  const subtotal = calcSubtotal(rate, nights);
  const service = calcServiceFee(subtotal, serviceRate);
  const cleaningFee = nights > 0 ? cleaning : 0;
  const cautionDeposit = caution || 0;
  const total = subtotal + cleaningFee + service + cautionDeposit;
  return { subtotal, cleaning: cleaningFee, service, caution: cautionDeposit, total, nights, rate };
}
