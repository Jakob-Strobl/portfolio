import CollapsibleSummary from "~/components/collapsible-summary";

export const ExclaimSection = () => (
  <details class="group min-w-0 w-full" open={false}>
    <CollapsibleSummary label="View project details">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 class="experience-card-title">Exclaim</h3>
        <h2 class="experience-card-date">2021</h2>
      </div>
      <p class="experience-card-meta">
        COVID-era project · Deprecated · Designed the grammar; built the tokenizer, parser, generator, and templating
        system
      </p>
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
