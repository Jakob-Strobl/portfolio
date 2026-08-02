import ExternalLink from "lucide-solid/icons/external-link";

import CollapsibleSummary from "~/components/collapsible-summary";

export const PolishPicSection = () => (
  <details class="group min-w-0 w-full" open={false}>
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
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 class="experience-card-title">Polish Pic</h3>
        <h2 class="experience-card-date">Oct 2025 - Present</h2>
      </div>
      <p class="experience-card-tech">
        Svelte 5, SvelteKit, Rust/WebAssembly, Tailwind CSS v4, Cloudflare Durable Objects
      </p>
      <p class="experience-card-summary mt-2">A privacy-first image-processing SaaS with AI image generation</p>
    </CollapsibleSummary>

    <ul class="experience-card-expanded experience-card-expanded-standalone experience-card-body list-inside list-disc space-y-1">
      <li>Uses Durable Objects to coordinate image-generation sessions and record usage across requests</li>
      <li>
        Optimizes client-side image processing with WebAssembly, a Rust image engine, and asynchronous web workers to
        keep the UI responsive by moving work off the main thread
      </li>
    </ul>
  </details>
);
