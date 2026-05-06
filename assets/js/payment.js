// Paystack inline payment wrapper.
// The Paystack inline script is loaded once at the top of booking.html:
//   <script src="https://js.paystack.co/v1/inline.js"></script>

import { PAYMENT } from "./data/config.js";
import { nairaToKobo } from "./utils/currency.js";

// Returns { reference, status } via the onSuccess callback.
// onClose fires if the user dismisses the modal without paying.
export function payWithPaystack({ email, amountNaira, metadata = {}, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    console.error("[payment] PaystackPop not loaded — is the Paystack inline script included?");
    return alert("Payment system failed to load. Please refresh the page.");
  }
  if (!PAYMENT.paystackPublicKey || PAYMENT.paystackPublicKey === "pk_test_PLACEHOLDER") {
    return alert(
      "Payment is not configured yet. The owner must add a Paystack public key in assets/js/data/config.js."
    );
  }

  const reference = "ITOSA-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const handler = window.PaystackPop.setup({
    key: PAYMENT.paystackPublicKey,
    email,
    amount: nairaToKobo(amountNaira),
    currency: PAYMENT.currency || "NGN",
    ref: reference,
    metadata: {
      custom_fields: Object.entries(metadata).map(([k, v]) => ({
        display_name: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        variable_name: k,
        value: String(v ?? "")
      }))
    },
    callback: (resp) => onSuccess && onSuccess(resp.reference || reference),
    onClose: () => onClose && onClose()
  });

  handler.openIframe();
}

// ============================================================
// TODO(backend): Server-side verification.
//
// Browser cannot safely verify a Paystack transaction because that requires
// the SECRET key (sk_live_...). Once you have a backend, implement:
//
//   POST /api/verify-payment  { reference }
//     -> server calls: GET https://api.paystack.co/transaction/verify/{reference}
//                      Authorization: Bearer <PAYSTACK_SECRET_KEY>
//     -> returns { status: "success" | "failed" | "pending", data }
//
// Then, on confirmation.html, call this endpoint and update the booking's
// paymentStatus from "pending_verification" to "paid" or "failed".
// ============================================================
export async function verifyPaymentOnServer(reference) {
  // Placeholder — uncomment and point at your real endpoint when ready.
  // const r = await fetch("/api/verify-payment", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ reference })
  // });
  // return r.json();
  console.warn("[payment] verifyPaymentOnServer is a stub. See TODO(backend) in payment.js.");
  return { status: "pending", reference };
}
