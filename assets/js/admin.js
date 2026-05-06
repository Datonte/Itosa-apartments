// Admin shared utilities. Pages opt-in by importing what they need.

import { exportApartmentsAsCode } from "./data/store.js";
import { toast } from "./site.js";

// Highlight the active sidebar link based on the current path
export function highlightActiveAdminLink() {
  const path = window.location.pathname.replace(/\/$/, "");
  document.querySelectorAll("[data-admin-link]").forEach((link) => {
    const href = link.getAttribute("href").replace(/\/$/, "");
    if (href === path) {
      link.classList.remove("text-zinc-400");
      link.classList.add("bg-brand-yellow", "text-brand-ink");
    }
  });
}

// "Export changes" copies the current localStorage apartment overrides as a JS snippet
export function wireExportButton(btnId = "export-changes-btn") {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const code = exportApartmentsAsCode();
    try {
      await navigator.clipboard.writeText(code);
      toast("Apartments JS copied to clipboard. Paste into apartments.js to make permanent.", 4500);
    } catch {
      const w = window.open("", "_blank");
      w.document.write(`<pre style="font-family:monospace;white-space:pre-wrap;padding:24px;">${escapeHtml(code)}</pre>`);
      w.document.title = "Apartments — paste into apartments.js";
    }
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
