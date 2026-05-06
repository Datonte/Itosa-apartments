// Currency formatting. Default NGN, Nigerian locale.

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
});

const PLAIN_NGN = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

export function formatNGN(n) {
  if (n == null || isNaN(n)) return "—";
  return NGN.format(Number(n));
}

export function formatNumber(n) {
  if (n == null || isNaN(n)) return "—";
  return PLAIN_NGN.format(Number(n));
}

// Paystack works in kobo (NGN * 100)
export function nairaToKobo(naira) {
  return Math.round(Number(naira) * 100);
}
