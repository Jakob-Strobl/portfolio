export const SITE_URL = "https://jstrobl.dev";
export const SITE_NAME = "Jakob Strobl";
export const SITE_DESCRIPTION =
  "Building privacy-first web products in TypeScript, Rust, and Cloudflare—fluent across modern frontend frameworks, with roots in compilers, game dev, and systems programming.";
export const PERSON_ID = `${SITE_URL}/#person`;

export const SOCIAL_PROFILES = ["https://github.com/Jakob-Strobl", "https://www.linkedin.com/in/jakob-strobl"] as const;

export type JsonLdNode = Record<string, unknown>;

export const PERSON_ENTITY: JsonLdNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  jobTitle: "Full-stack developer & indie builder",
  description: SITE_DESCRIPTION,
  sameAs: SOCIAL_PROFILES,
  worksFor: {
    "@type": "Organization",
    name: "Level Up Software LLC",
  },
  knowsAbout: [
    "Full-stack web development",
    "TypeScript",
    "Rust",
    "React",
    "Svelte",
    "Cloudflare",
    "WebAssembly",
    "WebGL",
  ],
};

export const PRODUCT_ENTITIES: JsonLdNode[] = [
  {
    "@type": "CreativeWork",
    "@id": "https://timedat.app/#project",
    name: "timedat",
    url: "https://timedat.app/",
    sameAs: "https://timedat.app/",
    description:
      "A privacy-first time tracker for freelancers, teams, and founders to record billable work and sweat equity—without screen surveillance or productivity scoring.",
    creator: { "@id": PERSON_ID },
  },
  {
    "@type": "CreativeWork",
    "@id": "https://polishpic.com/#project",
    name: "Polish Pic",
    url: "https://polishpic.com/",
    sameAs: "https://polishpic.com/",
    description: "A privacy-first image-processing SaaS with AI image generation.",
    creator: { "@id": PERSON_ID },
  },
];

export function getCanonicalUrl(pathname: string): string {
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalizedPath}`;
}
