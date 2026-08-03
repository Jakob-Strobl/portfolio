import ExternalLink from "lucide-solid/icons/external-link";

import CollapsibleSummary from "~/components/collapsible-summary";

export const ExclaimSection = () => (
  <details class="group min-w-0 w-full" open={false}>
    <CollapsibleSummary
      label="View project details"
      actions={
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            class="inline-flex items-center gap-1 text-sm text-night-400 hover:text-night-500"
            href="https://github.com/Jakob-Strobl/exclaim"
            target="_blank"
            rel="noopener"
            onClick={(event) => event.stopPropagation()}
          >
            github/exclaim <ExternalLink aria-hidden="true" size={13} />
          </a>
          <a
            class="inline-flex items-center gap-1 text-sm text-night-400 hover:text-night-500"
            href="https://github.com/Jakob-Strobl/exclaim-grammar"
            target="_blank"
            rel="noopener"
            onClick={(event) => event.stopPropagation()}
          >
            github/exclaim-grammar <ExternalLink aria-hidden="true" size={13} />
          </a>
        </div>
      }
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 class="experience-card-title">Exclaim</h3>
        <h2 class="experience-card-date">2021</h2>
      </div>
      <p class="experience-card-meta">COVID-era project · Language designer &amp; Compiler engineer · Deprecated</p>
      <p class="experience-card-tech">Rust</p>
      <p class="experience-card-summary mt-2">
        A template language (exclaim-grammar) and compiler for static-site generation
      </p>
    </CollapsibleSummary>

    <ul class="experience-card-expanded experience-card-expanded-standalone experience-card-body list-inside list-disc space-y-1">
      <li>Designed an LL(1) grammar that enabled implementation of a non-backtracking recursive-descent parser</li>
      <li>
        Used an arena-allocated index-tree pattern for memory-performant AST generation without per-node allocations in
        the hot loop
      </li>
    </ul>
  </details>
);
