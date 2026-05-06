// Site-wide behaviors loaded on every page.
// - Auto-fills brand contact info from data/config.js into [data-bind="..."] elements
// - Auto-fills footer year
// - Mobile menu toggle
// - Active nav highlight
// - Active mobile bottom-nav highlight

import { BRAND } from "./data/config.js";

document.addEventListener("DOMContentLoaded", () => {
  bindBrand();
  bindYear();
  bindMobileMenu();
  highlightActiveNav();
  highlightMobileNav();
});

function bindBrand() {
  const map = {
    phone: BRAND.phone,
    email: BRAND.email,
    address: BRAND.address,
    "phone-link": BRAND.phone,
    "email-link": BRAND.email,
    "whatsapp-link": BRAND.whatsapp ? `https://wa.me/${BRAND.whatsapp}` : "#",
  };

  document.querySelectorAll("[data-bind]").forEach((el) => {
    const key = el.getAttribute("data-bind");
    if (!(key in map)) return;
    const value = map[key];
    if (key === "phone-link") {
      el.setAttribute("href", `tel:${value}`);
      if (el.textContent.includes("PLACEHOLDER")) el.textContent = value;
    } else if (key === "email-link") {
      el.setAttribute("href", `mailto:${value}`);
      if (el.textContent.includes("PLACEHOLDER")) el.textContent = value;
    } else if (key === "whatsapp-link") {
      el.setAttribute("href", value);
    } else {
      if (typeof value === "string") el.textContent = value;
    }
  });

  // Decorate any social link with placeholder hrefs from config
  document.querySelectorAll("[data-social]").forEach((el) => {
    const platform = el.getAttribute("data-social");
    if (BRAND.social && BRAND.social[platform]) {
      el.setAttribute("href", BRAND.social[platform]);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });
}

function bindYear() {
  document.querySelectorAll('[data-bind="year"]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function bindMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", String(!open));
  });
}

function highlightActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href").replace(/\/$/, "") || "/";
    if (href === path || (href !== "/" && path.startsWith(href))) {
      link.classList.remove("text-zinc-600");
      link.classList.add("text-brand-ink", "border-b-2", "border-brand-yellow", "pb-1");
    }
  });
}

function highlightMobileNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = link.getAttribute("data-nav");
    if (href === path || (href !== "/" && path.startsWith(href))) {
      link.classList.remove("text-zinc-500");
      link.classList.add("text-brand-yellow");
      link.querySelector(".material-symbols-outlined")?.style.setProperty("font-variation-settings", "'FILL' 1");
    }
  });
}

// Tiny toast helper (importable elsewhere too)
export function toast(msg, ms = 2400) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, ms);
}
