// Sends transactional emails via Resend.
// RESEND_API_KEY must be set in Vercel env vars (Settings → Environment Variables).
//
// Active types:
//   - "owner-new-booking"        → owner gets a notification at itosaapartmentss@gmail.com
//   - "guest-reservation-held"   → guest gets bank-transfer instructions + booking ID
//   - "guest-payment-confirmed"  → guest gets confirmation after admin marks paid
//
// POST body shape:
//   { type: "owner-new-booking" | "guest-reservation-held" | "guest-payment-confirmed",
//     booking: {...}, apartment: { name, slug, location, address? } }

const FROM_ADDRESS = "ITOSA Apartment <bookings@itosa-apartments.com>";
const OWNER_INBOX = "itosaapartmentss@gmail.com";
const ADMIN_URL = "https://itosa-apartments.com/admin-bookings";
const SUPPORT_PHONE_DISPLAY = "+234 808 591 8163";
const SUPPORT_WHATSAPP_DIGITS = "2348139970432"; // wa.me format
const BANK = {
  accountNumber: "3091820975",
  bankName: "First Bank",
  accountName: "Ayodele James"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing — set it in Vercel env vars");
    return res.status(500).json({ ok: false, error: "Email service not configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { type, booking, apartment } = body || {};

  let payload;
  if (type === "owner-new-booking") {
    payload = buildOwnerNotification(booking, apartment);
  } else if (type === "guest-reservation-held") {
    payload = buildGuestReservationHeld(booking, apartment);
  } else if (type === "guest-payment-confirmed") {
    payload = buildGuestPaymentConfirmed(booking, apartment);
  } else {
    return res.status(400).json({ ok: false, error: "Unknown email type: " + type });
  }

  if (!payload) {
    return res.status(400).json({ ok: false, error: "Invalid booking payload — missing required fields" });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("Resend API error:", r.status, data);
      return res.status(502).json({ ok: false, status: r.status, error: data });
    }
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error("send-email error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

// =====================================================
// EMAIL TEMPLATES
// All inline CSS — many email clients strip <style> tags.
// =====================================================

function buildOwnerNotification(b, a) {
  if (!b) return null;
  const total = "₦" + ((b?.totals?.total) || 0).toLocaleString();
  const aptName = a?.name || b?.apartmentSlug || "An apartment";
  const aptLoc  = a?.location || "";
  const bookingId = b?.paystackRef || b?.id || "—";
  const checkin = b?.checkin || "—";
  const checkout = b?.checkout || "—";
  const nights = b?.nights || "";

  const subject = `New booking · ${aptName} · ${total} · ${checkin} → ${checkout}`;
  const html = ownerHtml({ bookingId, aptName, aptLoc, checkin, checkout, nights, total, b });

  return {
    from: FROM_ADDRESS,
    to: [OWNER_INBOX],
    subject,
    html,
    reply_to: b?.email || undefined
  };
}

function buildGuestReservationHeld(b, a) {
  if (!b || !b.email) return null;
  const total = "₦" + ((b?.totals?.total) || 0).toLocaleString();
  const aptName = a?.name || "Your apartment";
  const aptLoc  = a?.location || "";
  const bookingId = b?.paystackRef || b?.id || "—";
  const checkin = b?.checkin || "—";
  const checkout = b?.checkout || "—";
  const nights = b?.nights || "";

  const subject = `Reservation held · Complete your transfer · Booking ${bookingId}`;
  const html = guestHeldHtml({ bookingId, aptName, aptLoc, checkin, checkout, nights, total, b });

  return {
    from: FROM_ADDRESS,
    to: [b.email],
    subject,
    html,
    reply_to: OWNER_INBOX
  };
}

function buildGuestPaymentConfirmed(b, a) {
  if (!b || !b.email) return null;
  const total = "₦" + ((b?.totals?.total) || 0).toLocaleString();
  const aptName = a?.name || "Your apartment";
  const aptLoc  = a?.location || "";
  const aptAddr = a?.address || "";
  const bookingId = b?.paystackRef || b?.id || "—";
  const checkin = b?.checkin || "—";
  const checkout = b?.checkout || "—";
  const nights = b?.nights || "";

  const subject = `Booking confirmed · See you on ${checkin} · ${aptName}`;
  const html = guestConfirmedHtml({ bookingId, aptName, aptLoc, aptAddr, checkin, checkout, nights, total, b });

  return {
    from: FROM_ADDRESS,
    to: [b.email],
    subject,
    html,
    reply_to: OWNER_INBOX
  };
}

// ---------- HTML builders ----------

function shell(bodyHtml, headerBg, headerText) {
  return `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf8f8;font-family:'Helvetica Neue',Arial,sans-serif;color:#181919;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e2e1;">
    <div style="background:${headerBg};padding:20px 24px;">
      <h1 style="margin:0;font-size:18px;letter-spacing:0.1em;text-transform:uppercase;color:${headerText};">${escapeHtml(headerText === "#181919" ? "ITOSA Apartment" : "ITOSA Apartment")}</h1>
    </div>
    ${bodyHtml}
    <div style="padding:16px 24px 24px;border-top:1px solid #eee;background:#fafafa;">
      <p style="margin:0;font-size:12px;color:#888;text-align:center;">
        Questions? WhatsApp <a href="https://wa.me/${SUPPORT_WHATSAPP_DIGITS}" style="color:#181919;">${SUPPORT_PHONE_DISPLAY}</a> or reply to this email.
      </p>
    </div>
  </div>
</body></html>`;
}

function ownerHtml({ bookingId, aptName, aptLoc, checkin, checkout, nights, total, b }) {
  const body = `
    <div style="padding:24px;">
      <p style="margin:0 0 8px;color:#444;font-size:14px;">A new reservation is being held. Check First Bank for the transfer using the booking ID below.</p>

      <div style="margin:20px 0;padding:16px;background:#fff8df;border:2px solid #f9bd22;border-radius:12px;text-align:center;">
        <p style="margin:0;font-size:11px;letter-spacing:0.15em;color:#795900;text-transform:uppercase;font-weight:700;">Booking ID — match to transfer description</p>
        <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:22px;font-weight:700;color:#181919;">${escapeHtml(bookingId)}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#666;width:130px;">Apartment</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(aptName)}${aptLoc ? " · " + escapeHtml(aptLoc) : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Dates</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(checkin)} → ${escapeHtml(checkout)}${nights ? " (" + nights + " nights)" : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Guests</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(String(b?.guests || "—"))}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Total</td><td style="padding:8px 0;font-weight:700;font-size:18px;">${total}</td></tr>
        <tr><td colspan="2" style="padding-top:16px;border-top:1px solid #eee;"></td></tr>
        <tr><td style="padding:8px 0;color:#666;">Guest name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(b?.name || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;font-weight:600;"><a href="tel:${escapeHtml(b?.phone || "")}" style="color:#181919;text-decoration:none;">${escapeHtml(b?.phone || "—")}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;font-weight:600;"><a href="mailto:${escapeHtml(b?.email || "")}" style="color:#181919;">${escapeHtml(b?.email || "—")}</a></td></tr>
        ${b?.notes ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top;">Notes</td><td style="padding:8px 0;">${escapeHtml(b.notes)}</td></tr>` : ""}
      </table>

      <div style="margin-top:24px;text-align:center;">
        <a href="${ADMIN_URL}" style="display:inline-block;padding:12px 24px;background:#181919;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px;">Open admin bookings</a>
      </div>

      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">When the transfer arrives, open the booking in the admin panel and click "Confirm payment received".</p>
    </div>
  `;
  return shell(body, "#f9bd22", "#181919");
}

function guestHeldHtml({ bookingId, aptName, aptLoc, checkin, checkout, nights, total, b }) {
  const body = `
    <div style="padding:24px;">
      <p style="margin:0 0 8px;font-size:16px;font-weight:600;">Hi ${escapeHtml(firstName(b?.name))},</p>
      <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.55;">Thanks for choosing ITOSA Apartment. Your dates are held while we wait for your bank transfer. Once we confirm the payment, you'll get a final confirmation email with check-in details.</p>

      <!-- Booking summary -->
      <div style="margin:0 0 20px;padding:16px;background:#fafafa;border:1px solid #eee;border-radius:12px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#888;font-weight:700;">Your reservation</p>
        <p style="margin:0 0 4px;font-size:15px;font-weight:700;">${escapeHtml(aptName)}${aptLoc ? " · " + escapeHtml(aptLoc) : ""}</p>
        <p style="margin:0;font-size:14px;color:#444;">${escapeHtml(checkin)} → ${escapeHtml(checkout)}${nights ? " · " + nights + " " + (nights === 1 ? "night" : "nights") : ""} · ${escapeHtml(String(b?.guests || "1"))} guest${(b?.guests || 1) > 1 ? "s" : ""}</p>
      </div>

      <!-- Bank transfer instructions -->
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;">Step 1 — Make the transfer</p>
      <div style="margin:0 0 20px;padding:18px;background:#fff8df;border:2px solid #f9bd22;border-radius:12px;">
        <table style="width:100%;font-size:14px;">
          <tr><td style="padding:6px 0;color:#666;width:130px;">Bank</td><td style="padding:6px 0;font-weight:700;">${escapeHtml(BANK.bankName)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Account number</td><td style="padding:6px 0;font-weight:700;font-family:'Courier New',monospace;font-size:16px;">${escapeHtml(BANK.accountNumber)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Account name</td><td style="padding:6px 0;font-weight:700;">${escapeHtml(BANK.accountName)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Amount</td><td style="padding:6px 0;font-weight:700;font-size:18px;">${total}</td></tr>
          <tr><td style="padding:6px 0;color:#666;border-top:1px solid #f3deb0;">Reference</td><td style="padding:6px 0;font-weight:700;font-family:'Courier New',monospace;font-size:16px;border-top:1px solid #f3deb0;color:#795900;">${escapeHtml(bookingId)}</td></tr>
        </table>
        <p style="margin:12px 0 0;font-size:12px;color:#795900;">⚠️ Use the reference exactly as shown — that's how we match your transfer to this booking.</p>
      </div>

      <!-- WhatsApp proof -->
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;">Step 2 — Send your transfer proof on WhatsApp</p>
      <p style="margin:0 0 12px;color:#444;font-size:14px;line-height:1.55;">Tap below to message us with your booking ID. We'll confirm your payment within minutes during business hours.</p>
      <div style="margin:0 0 24px;text-align:center;">
        <a href="${whatsappLink(bookingId, aptName, checkin, checkout, total, b?.name)}" style="display:inline-block;padding:12px 24px;background:#25D366;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px;">📱 Send proof on WhatsApp</a>
      </div>

      <p style="margin:0;font-size:12px;color:#888;text-align:center;">Your dates are held for 24 hours. After that, the dates may be released to other guests.</p>
    </div>
  `;
  return shell(body, "#f9bd22", "#181919");
}

function guestConfirmedHtml({ bookingId, aptName, aptLoc, aptAddr, checkin, checkout, nights, total, b }) {
  const body = `
    <div style="padding:24px;">
      <div style="margin:0 0 16px;padding:16px;background:#d1fae5;border:2px solid #10b981;border-radius:12px;text-align:center;">
        <p style="margin:0;font-size:22px;">✅</p>
        <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#065f46;">Booking confirmed</p>
        <p style="margin:4px 0 0;font-size:13px;color:#047857;">See you on ${escapeHtml(checkin)}.</p>
      </div>

      <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.55;">Hi ${escapeHtml(firstName(b?.name))} — your payment is confirmed and your stay is booked. Save this email for your records.</p>

      <!-- Booking details -->
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 20px;">
        <tr><td style="padding:8px 0;color:#666;width:130px;">Booking ID</td><td style="padding:8px 0;font-weight:700;font-family:'Courier New',monospace;">${escapeHtml(bookingId)}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Apartment</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(aptName)}${aptLoc ? " · " + escapeHtml(aptLoc) : ""}</td></tr>
        ${aptAddr ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top;">Address</td><td style="padding:8px 0;">${escapeHtml(aptAddr)}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#666;">Check-in</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(checkin)} (from 3:00 PM)</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Check-out</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(checkout)} (by 11:00 AM)</td></tr>
        ${nights ? `<tr><td style="padding:8px 0;color:#666;">Nights</td><td style="padding:8px 0;font-weight:600;">${nights}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#666;">Guests</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(String(b?.guests || "1"))}</td></tr>
        <tr><td style="padding:8px 0;color:#666;border-top:1px solid #eee;">Total paid</td><td style="padding:8px 0;font-weight:700;font-size:16px;border-top:1px solid #eee;">${total}</td></tr>
      </table>

      <!-- What to expect -->
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;">What happens next</p>
      <ul style="margin:0 0 20px;padding-left:20px;color:#444;font-size:14px;line-height:1.7;">
        <li>You'll receive check-in instructions on WhatsApp 24 hours before arrival.</li>
        <li>Our on-site team will meet you at the apartment.</li>
        <li>Free cancellation more than 14 days before check-in — see <a href="https://itosa-apartments.com/refund" style="color:#181919;">refund policy</a>.</li>
      </ul>

      <!-- Contact CTA -->
      <div style="margin:0 0 16px;text-align:center;">
        <a href="https://wa.me/${SUPPORT_WHATSAPP_DIGITS}" style="display:inline-block;padding:12px 24px;background:#25D366;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px;margin:0 4px 8px;">📱 WhatsApp us</a>
        <a href="tel:+2348085918163" style="display:inline-block;padding:12px 24px;background:#181919;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px;margin:0 4px 8px;">📞 Call us</a>
      </div>

      <p style="margin:0;font-size:13px;color:#444;text-align:center;">Looking forward to hosting you.</p>
    </div>
  `;
  return shell(body, "#10b981", "#ffffff");
}

// ---------- helpers ----------

function whatsappLink(bookingId, aptName, checkin, checkout, total, guestName) {
  const text = `Hi ITOSA Apartment, I just reserved ${aptName} for ${checkin} to ${checkout} (${total}). My booking ID is ${bookingId}. I'll send my transfer proof shortly.${guestName ? "\n\nFrom: " + guestName : ""}`;
  return `https://wa.me/${SUPPORT_WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;
}

function firstName(full) {
  if (!full) return "there";
  return String(full).trim().split(/\s+/)[0] || "there";
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
