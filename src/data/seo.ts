export const SITE_URL = "https://jstrobl.dev";
export const SITE_NAME = "Jakob Strobl";
export const SITE_DESCRIPTION =
  "Jakob Strobl is a full-stack developer and product builder creating privacy-first web products with TypeScript, Rust, and Cloudflare, with a broad technical background spanning systems programming, compilers, computer graphics, and game development.";
export const PERSON_ID = `${SITE_URL}/#person`;

export const SOCIAL_PROFILES = ["https://github.com/Jakob-Strobl", "https://www.linkedin.com/in/jakob-strobl"] as const;

export type JsonLdNode = Record<string, unknown>;

export const PERSON_ENTITY: JsonLdNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  jobTitle: "Full-stack developer and product builder",
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
      "A time tracker that helps freelancers and small teams track billable work accurately across overlapping projects in the AI era—without screen surveillance or productivity scoring.",
    creator: { "@id": PERSON_ID },
  },
  {
    "@type": "CreativeWork",
    "@id": "https://polishpic.com/#project",
    name: "Polish Pic",
    url: "https://polishpic.com/",
    sameAs: "https://polishpic.com/",
    description: "A privacy-preserving image processing SaaS with AI-powered image generation.",
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
