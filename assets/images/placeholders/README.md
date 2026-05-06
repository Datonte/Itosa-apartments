# Apartment photos

Drop your real apartment photos here, named after each apartment's slug.

## Naming convention

For each apartment in `assets/js/data/apartments.js`, the gallery references files like:

```
/assets/images/placeholders/<slug>-1.jpg
/assets/images/placeholders/<slug>-2.jpg
…
/assets/images/placeholders/<slug>-5.jpg
```

So for `slug: "surulere-1-bedroom"` you would add:

```
surulere-1-bedroom-1.jpg
surulere-1-bedroom-2.jpg
surulere-1-bedroom-3.jpg
surulere-1-bedroom-4.jpg
surulere-1-bedroom-5.jpg
```

The first image is the hero shot — make it your best one.

## Recommended specs

- **Format:** JPG (WebP also fine)
- **Aspect ratio:** 4:3 or 16:9, photos look best when consistent within a listing
- **Dimensions:** 1600×1200 (or 1920×1080 for 16:9). Smaller will display blurry on retina screens; larger wastes bandwidth.
- **File size:** under 400KB each (use [squoosh.app](https://squoosh.app) to compress)
- **Lighting:** natural daylight; clean rooms; wide-angle lens preferred

## Until you replace these

The site falls back to `galleryFallback` (an Unsplash URL set on each apartment in `apartments.js`) so visitors don't see broken images. Replace the `gallery` array entirely with your own paths once your photos are uploaded — or just drop files at the expected paths and the app will pick them up automatically.

## OG image

While you're here, consider adding `assets/images/icons/og-default.jpg` (1200×630) — a real photo version of the placeholder SVG. This is what social platforms (WhatsApp, Twitter, Facebook) show when someone shares your link.
