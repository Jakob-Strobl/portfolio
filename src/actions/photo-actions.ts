import { IMAGE_VARIANTS, PhotoVariantKey } from "~/types/photo-resource";

const FALLBACK_R2_DOMAIN = "images.jstrobl.dev";
const FALLBACK_ZONE_DOMAIN = "jstrobl.dev";

function normalizeDomain(configuredDomain: string | undefined, fallback: string): string {
  const normalized = configuredDomain
    ?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return normalized?.length ? normalized : fallback;
}

export function getImageUrl(r2Key: string, variant: PhotoVariantKey): string {
  const r2Domain = normalizeDomain(import.meta.env.VITE_PUBLIC_R2_IMAGES_DOMAIN, FALLBACK_R2_DOMAIN);
  const rawUrl = `https://${r2Domain}/${r2Key}`;

  if (variant === "full" || import.meta.env.DEV) {
    return rawUrl;
  }

  const zoneDomain = normalizeDomain(import.meta.env.VITE_PUBLIC_ZONE_DOMAIN, FALLBACK_ZONE_DOMAIN);
  const v = IMAGE_VARIANTS[variant];
  const params = `width=${v.width},height=${v.height},fit=${v.fit},quality=${v.quality},format=auto`;
  return `https://${zoneDomain}/cdn-cgi/image/${params}/${rawUrl}`;
}
