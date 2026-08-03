import { Link as HeadLink, Meta, MetaContext, Title } from "@solidjs/meta";
import { useContext } from "solid-js";
import {
  getCanonicalUrl,
  JsonLdNode,
  PERSON_ENTITY,
  PERSON_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "~/data/seo";

export interface SeoProps {
  title: string;
  description?: string;
  path: string;
  pageType?: "CollectionPage" | "ProfilePage" | "WebPage";
  image?: string;
  imageAlt?: string;
  structuredData?: JsonLdNode | JsonLdNode[];
  noindex?: boolean;
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} portfolio homepage with a waves background`;

function serializeJsonLd(value: JsonLdNode): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default function Seo(props: SeoProps) {
  const metaContext = useContext(MetaContext);
  const description = () => props.description ?? SITE_DESCRIPTION;
  const canonical = () => getCanonicalUrl(props.path);
  const image = () => props.image ?? DEFAULT_OG_IMAGE;
  const imageAlt = () => props.imageAlt ?? DEFAULT_OG_IMAGE_ALT;
  const extraStructuredData = () => {
    if (props.structuredData == null) {
      return [];
    }

    return Array.isArray(props.structuredData) ? props.structuredData : [props.structuredData];
  };
  const structuredData = () => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: "jstrobl.dev",
      },
      PERSON_ENTITY,
      {
        "@type": props.pageType ?? "WebPage",
        "@id": `${canonical()}#webpage`,
        url: canonical(),
        name: props.title,
        description: description(),
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": PERSON_ID },
        ...(props.pageType === "ProfilePage" ? { mainEntity: { "@id": PERSON_ID } } : {}),
      },
      ...extraStructuredData(),
    ],
  });

  const jsonLd = () => serializeJsonLd(structuredData());

  return (
    <>
      {metaContext != null && (
        <>
          <Title>{props.title}</Title>
          <Meta name="description" content={description()} />
          <Meta name="author" content={SITE_NAME} />
          <Meta name="robots" content={props.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"} />
          <HeadLink rel="canonical" href={canonical()} />
          <Meta property="og:title" content={props.title} />
          <Meta property="og:description" content={description()} />
          <Meta property="og:url" content={canonical()} />
          <Meta property="og:type" content="website" />
          <Meta property="og:site_name" content={SITE_NAME} />
          <Meta property="og:locale" content="en_US" />
          <Meta property="og:image" content={image()} />
          <Meta property="og:image:type" content="image/png" />
          <Meta property="og:image:alt" content={imageAlt()} />
          <Meta property="og:image:width" content="1200" />
          <Meta property="og:image:height" content="630" />
          <Meta name="twitter:card" content="summary_large_image" />
          <Meta name="twitter:title" content={props.title} />
          <Meta name="twitter:description" content={description()} />
          <Meta name="twitter:image" content={image()} />
          <Meta name="twitter:image:alt" content={imageAlt()} />
          <Meta name="theme-color" content="#130d20" />
        </>
      )}
      <script type="application/ld+json" innerHTML={jsonLd()}></script>
    </>
  );
}
