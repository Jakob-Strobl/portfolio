// Photo Collections (re-exported from source)
export { photoCollection as himejiPhotos } from "../../src/routes/gallery/collections/himeji/+photos";
export { photoCollection as seoulPhotos } from "../../src/routes/gallery/collections/korea-seoul/+photos";
export { photoCollection as jejuPhotos } from "../../src/routes/gallery/collections/korea-jeju/+photos";
export { photoCollection as gangneungPhotos } from "../../src/routes/gallery/collections/korea-pacific-coast/+photos";

import { photoCollection as himejiPhotos } from "../../src/routes/gallery/collections/himeji/+photos";
import { photoCollection as seoulPhotos } from "../../src/routes/gallery/collections/korea-seoul/+photos";
import { photoCollection as jejuPhotos } from "../../src/routes/gallery/collections/korea-jeju/+photos";
import { photoCollection as gangneungPhotos } from "../../src/routes/gallery/collections/korea-pacific-coast/+photos";

// Collection Metadata
export const GALLERY_COLLECTIONS = [
  {
    title: "Korea - Seoul",
    dir: "korea-seoul",
    route: "/gallery/collections/korea-seoul",
    timelineTitle: "2018-2019",
    photos: seoulPhotos,
  },
  {
    title: "Korea - Jeju",
    dir: "korea-jeju",
    route: "/gallery/collections/korea-jeju",
    timelineTitle: "2019",
    photos: jejuPhotos,
  },
  {
    title: "Japan - Himeji",
    dir: "himeji",
    route: "/gallery/collections/himeji",
    timelineTitle: "2019",
    photos: himejiPhotos,
  },
  {
    title: "Korea - Around Gangneung (강릉시)",
    dir: "korea-pacific-coast",
    route: "/gallery/collections/korea-pacific-coast",
    timelineTitle: "2019",
    photos: gangneungPhotos,
  },
] as const;

// External Links
export const EXTERNAL_LINKS = {
  github: {
    profile: "https://github.com/Jakob-Strobl",
    releases: "https://github.com/Jakob-Strobl/portfolio/releases",
  },
  linkedin: "https://www.linkedin.com/in/jakob-strobl",
} as const;

// Navigation Links
export const NAV_LINKS = {
  home: "/",
  experience: "/experience",
  gallery: "/gallery",
  contact: "/contact",
} as const;

// Timeline Data Attribute Key (from timeline-layout.tsx)
export const TIMELINE_TITLE_ATTR = "data-timeline-title";
