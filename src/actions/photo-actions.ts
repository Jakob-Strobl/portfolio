import { IMAGE_VARIANTS, PhotoVariantKey } from "~/types/photo-resource";

const FALLBACK_R2_DOMAIN = "images.jstrobl.dev";
const FALLBACK_ZONE_DOMAIN = "jstrobl.dev";

function getR2Domain(): string {
  const configuredDomain = import.meta.env.VITE_PUBLIC_R2_IMAGES_DOMAIN;
  const normalized = configuredDomain
    ?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return normalized?.length ? normalized : FALLBACK_R2_DOMAIN;
}

function getZoneDomain(): string {
  const configuredDomain = import.meta.env.VITE_PUBLIC_ZONE_DOMAIN;
  const normalized = configuredDomain
    ?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return normalized?.length ? normalized : FALLBACK_ZONE_DOMAIN;
}

export function getImageUrl(r2Key: string, variant: PhotoVariantKey): string {
  const r2Domain = getR2Domain();
  const rawUrl = `https://${r2Domain}/${r2Key}`;

  if (variant === "full" || import.meta.env.DEV) {
    return rawUrl;
  }

  const zoneDomain = getZoneDomain();
  const v = IMAGE_VARIANTS[variant];
  const params = `width=${v.width},height=${v.height},fit=${v.fit},quality=${v.quality},format=auto`;
  return `https://${zoneDomain}/cdn-cgi/image/${params}/${rawUrl}`;
}
