// Sends transactional emails via Resend.
// RESEND_API_KEY must be set in Vercel env vars (Settings → Environment Variables).
// Currently only the "owner-new-booking" type is active. Guest-facing emails are
// stubbed but disabled until a sender domain is verified in Resend (Phase 22).
//
// POST body shape:
//   { type: "owner-new-booking", booking: {...}, apartment: { name, slug, location } }

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
  } else {
    return res.status(400).json({ ok: false, error: "Unknown or disabled email type: " + type });
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

function buildOwnerNotification(b, a) {
  const total = "₦" + (b?.totals?.total || 0).toLocaleString();
  const aptName = a?.name || b?.apartmentSlug || "An apartment";
  const aptLoc  = a?.location || "";
  const bookingId = b?.paystackRef || b?.id || "—";
  const checkin = b?.checkin || "—";
  const checkout = b?.checkout || "—";
  const nights = b?.nights || "";

  const subject = `New booking · ${aptName} · ${total} · ${checkin} → ${checkout}`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf8f8;font-family:'Helvetica Neue',Arial,sans-serif;color:#181919;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e2e1;">
    <div style="background:#f9bd22;padding:20px 24px;">
      <h1 style="margin:0;font-size:18px;letter-spacing:0.1em;text-transform:uppercase;color:#181919;">ITOSA Apartment — new booking</h1>
    </div>
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
        <a href="https://itosa-apartments.vercel.app/admin-bookings" style="display:inline-block;padding:12px 24px;background:#181919;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px;">Open admin bookings</a>
      </div>

      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">When the transfer arrives, open the booking in the admin panel and click "Confirm payment received".</p>
    </div>
  </div>
</body></html>`;

  return {
    from: "ITOSA Bookings <onboarding@resend.dev>",   // Switch to noreply@itosaapartment.com once domain is verified
    to: ["itosaapartmentss@gmail.com"],
    subject,
    html,
    reply_to: b?.email || undefined                    // Owner can reply directly to the guest
  };
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
