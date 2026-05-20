// Daily ping that keeps the Supabase free tier from pausing after
// 7 days of API inactivity. Triggered by Vercel cron — see vercel.json.
//
// The anon key is the public "publishable" key (already in
// assets/js/data/config.js), so embedding it here is safe.
// Row-Level Security on the database side gates what it can actually do.
// Never put the service-role key in a committed file.

export default async function handler(req, res) {
  const SUPABASE_URL = "https://hbruquongmzndoztctwo.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicnVxdW9uZ216bmRvenRjdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODc4NjIsImV4cCI6MjA5MzY2Mzg2Mn0.mXlJO8xszhTGP5Wljn1_jZKV7KZaoWuUHibAQmlMQKo";

  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!r.ok) {
      const body = await r.text();
      console.error("Supabase keep-alive failed:", r.status, body);
      return res.status(502).json({ ok: false, status: r.status, body });
    }

    return res.status(200).json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("Supabase keep-alive error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
