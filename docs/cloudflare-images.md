# Cloudflare R2 + Image Transformations Setup

Images are stored in Cloudflare R2 and served through Image Transformations on `jstrobl.dev`.

## Architecture

- **R2 bucket** (`portfolio-images`) stores original high-res images
- **Custom domain** `images.jstrobl.dev` serves the bucket publicly
- **Image Transformations** on `jstrobl.dev` resizes on the fly via `/cdn-cgi/image/` URLs

## Variant Parameters

| Variant | Fit        | Width | Height | Quality |
| ------- | ---------- | ----- | ------ | ------- |
| thumb   | cover      | 640   | 640    | 70      |
| grid    | cover      | 1280  | 960    | 78      |
| full    | scale-down | 2560  | 2560   | 82      |

These are defined in `src/types/photo-resource.ts` as `IMAGE_VARIANTS`.

The `full` variant skips transforms entirely and serves the original from R2.

## Required Environment Variables

### Runtime (Cloudflare Pages)

- `VITE_PUBLIC_R2_IMAGES_DOMAIN` — R2 custom domain (default: `images.jstrobl.dev`)

## R2 object key structure

```
gallery/{collection}/{slug}.jpg
```

Example: `gallery/korea-seoul/seoul-alley.jpg`

## Testing transforms on preview deployments

Image Transformations go through `jstrobl.dev/cdn-cgi/image/...`. If Hotlink Protection is
enabled on the zone, requests from non-`jstrobl.dev` origins (e.g. Cloudflare Pages preview
URLs like `*.portfolio-7m9.pages.dev`) will be blocked with a 403.

To allow preview environments to load transformed images, create a **Configuration Rule** in
the Cloudflare dashboard:

1. **Dashboard > jstrobl.dev > Rules > Configuration Rules > Create Rule**
2. **If:** Referer contains `portfolio-7m9.pages.dev`
3. **Then:** Hotlink Protection = Off

This scopes the bypass to preview deployments only. Production at `jstrobl.dev` is unaffected
since the referer matches the zone.

In local dev (`bun run dev`), transforms are skipped automatically — all variants serve
the raw R2 URL so images load without needing Cloudflare's edge.
