export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Read the slug from either a query string ?slug=... or from the path /apartments/<slug>
export function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("slug")) return params.get("slug");
  const m = window.location.pathname.match(/\/apartments\/([^/]+)/);
  return m ? m[1] : null;
}
