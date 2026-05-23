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
  initDarkMode();
});

function bindBrand() {
  // Pretty-print the WhatsApp number as +234 813 997 0432 for display
  const whatsappDisplay = BRAND.whatsapp
    ? "+" + BRAND.whatsapp.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3 $4")
    : "";

  const map = {
    phone: BRAND.phone,
    "phone-alt": BRAND.phoneAlt,
    "whatsapp": whatsappDisplay,
    email: BRAND.email,
    address: BRAND.address,
    "phone-link": BRAND.phone,
    "phone-alt-link": BRAND.phoneAlt,
    "whatsapp-tel-link": whatsappDisplay,             // tel: link using the WhatsApp number (also callable)
    "email-link": BRAND.email,
    "whatsapp-link": BRAND.whatsapp ? `https://wa.me/${BRAND.whatsapp}` : "#",
  };

  // Strip everything except digits and leading + so the tel: dialer parses it
  const telSafe = (v) => String(v || "").replace(/[^+0-9]/g, "");

  document.querySelectorAll("[data-bind]").forEach((el) => {
    const key = el.getAttribute("data-bind");
    if (!(key in map)) return;
    const value = map[key];
    if (!value) return;
    if (key === "phone-link" || key === "phone-alt-link" || key === "whatsapp-tel-link") {
      el.setAttribute("href", `tel:${telSafe(value)}`);
      el.textContent = value;
    } else if (key === "email-link") {
      el.setAttribute("href", `mailto:${value}`);
      if (el.textContent.includes("PLACEHOLDER") || el.textContent.trim() === "") el.textContent = value;
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

function initDarkMode() {
  const isDark = () => document.documentElement.classList.contains("dark");
  const iconFor = () => (isDark() ? "light_mode" : "dark_mode");

  // Floating button — always visible on every page
  const float = document.createElement("button");
  float.id = "theme-toggle-float";
  float.className = "theme-toggle-float";
  float.setAttribute("aria-label", "Toggle dark mode");
  float.setAttribute("title", "Toggle dark mode");
  float.innerHTML = `<span class="material-symbols-outlined">${iconFor()}</span>`;
  document.body.appendChild(float);

  // Optional inline slot — pages that want it inline can add <span data-theme-toggle-slot></span>
  const slot = document.querySelector("[data-theme-toggle-slot]");
  let inline = null;
  if (slot) {
    inline = document.createElement("button");
    inline.className = "theme-toggle-btn";
    inline.setAttribute("aria-label", "Toggle dark mode");
    inline.innerHTML = `<span class="material-symbols-outlined">${iconFor()}</span>`;
    slot.appendChild(inline);
  }

  function toggle() {
    const dark = !isDark();
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("itosa.theme", dark ? "dark" : "light");
    const icon = dark ? "light_mode" : "dark_mode";
    float.querySelector(".material-symbols-outlined").textContent = icon;
    if (inline) inline.querySelector(".material-symbols-outlined").textContent = icon;
  }

  float.addEventListener("click", toggle);
  if (inline) inline.addEventListener("click", toggle);
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
