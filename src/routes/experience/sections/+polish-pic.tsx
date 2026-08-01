import ExternalLink from "lucide-solid/icons/external-link";

import CollapsibleSummary from "~/components/collapsible-summary";

export const PolishPicSection = () => (
  <details class="group" open={false}>
    <CollapsibleSummary
      label="View project details"
      actions={
        <a
          class="inline-flex items-center gap-1 text-sm text-night-400 hover:text-night-500"
          href="https://polishpic.com"
          target="_blank"
          rel="noopener"
          onClick={(event) => event.stopPropagation()}
        >
          Visit polishpic.com <ExternalLink aria-hidden="true" size={13} />
        </a>
      }
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
        <h3>Polish Pic</h3>
        <h2 class="text-xl font-light">Oct 2025 - Present</h2>
      </div>
      <p class="text-white/70">Svelte 5 with SvelteKit, Rust + WASM, Tailwind v4, Cloudflare Durable Objects</p>
      <p class="mt-2 text-base text-white/80">
        A privacy-preserving image processing SaaS with AI-powered image generation
      </p>
    </CollapsibleSummary>

    <ul class="mt-4 list-inside list-disc space-y-1 border-t border-white/10 pt-4 text-base text-white/80">
      <li>Uses Durable Objects to coordinate image-generation sessions and track usage across requests</li>
      <li>Optimized client-side image processing with WebAssembly and Rust image engine</li>
    </ul>
  </details>
);
