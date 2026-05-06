// Bento gallery + lightbox for the apartment details page.
// Renders a 5-tile bento grid into a target element from an array of image URLs.

export function renderBentoGallery({ root, images, alt = "" }) {
  if (!root || !images || images.length === 0) {
    if (root) root.innerHTML = '<div class="placeholder-tile aspect-[16/9] rounded-2xl">Photos coming soon — owner will replace.</div>';
    return;
  }

  // Pad to 5 tiles for the bento layout
  const imgs = images.slice(0, 5);
  while (imgs.length < 5) imgs.push(null);

  const tile = (src, idx, classes, altSuffix) => {
    if (!src) {
      return `<div class="placeholder-tile rounded-${idx === 0 ? "l-2xl" : ""} ${classes}">Photo ${idx + 1}</div>`;
    }
    return `<img loading="${idx === 0 ? "eager" : "lazy"}"
                 src="${src}"
                 alt="${alt} — view ${idx + 1}${altSuffix || ""}"
                 data-gallery-index="${idx}"
                 class="gallery-thumb w-full h-full object-cover ${classes}" />`;
  };

  root.innerHTML = `
    <div class="grid grid-cols-4 grid-rows-2 gap-2 h-[260px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden relative">
      <div class="col-span-4 sm:col-span-2 row-span-2 overflow-hidden">${tile(imgs[0], 0, "rounded-none")}</div>
      <div class="hidden sm:block overflow-hidden">${tile(imgs[1], 1, "")}</div>
      <div class="hidden sm:block overflow-hidden">${tile(imgs[2], 2, "")}</div>
      <div class="hidden sm:block overflow-hidden">${tile(imgs[3], 3, "")}</div>
      <div class="hidden sm:block overflow-hidden relative">
        ${tile(imgs[4], 4, "")}
        <button type="button" id="show-all-photos" class="absolute bottom-3 right-3 px-4 py-2 bg-white/95 backdrop-blur text-brand-ink text-sm font-semibold rounded-full shadow-md hover:bg-white">
          <span class="inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">photo_library</span>
            Show all ${images.length}
          </span>
        </button>
      </div>
    </div>`;

  // Wire lightbox
  const validImages = imgs.filter(Boolean);
  if (validImages.length === 0) return;

  root.querySelectorAll(".gallery-thumb").forEach((el) => {
    el.addEventListener("click", () => openLightbox(validImages, Number(el.dataset.galleryIndex), alt));
  });
  const showAll = root.querySelector("#show-all-photos");
  if (showAll) showAll.addEventListener("click", () => openLightbox(validImages, 0, alt));
}

function openLightbox(images, startIdx, alt) {
  let idx = startIdx;
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Close"><span class="material-symbols-outlined">close</span></button>
    <button class="lightbox-nav prev" aria-label="Previous"><span class="material-symbols-outlined">chevron_left</span></button>
    <img src="${images[idx]}" alt="${alt}" />
    <button class="lightbox-nav next" aria-label="Next"><span class="material-symbols-outlined">chevron_right</span></button>
  `;
  document.body.appendChild(lb);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => lb.classList.add("open"));

  const img = lb.querySelector("img");
  const show = (i) => { idx = (i + images.length) % images.length; img.src = images[idx]; };
  lb.querySelector(".prev").addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
  lb.querySelector(".next").addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
  lb.querySelector(".lightbox-close").addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", onKey);

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  }

  function close() {
    document.removeEventListener("keydown", onKey);
    lb.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => lb.remove(), 250);
  }
}
