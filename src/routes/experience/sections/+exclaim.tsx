import CollapsibleSummary from "~/components/collapsible-summary";

export const ExclaimSection = () => (
  <details class="group" open={false}>
    <CollapsibleSummary label="View project details">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
        <h3>Exclaim</h3>
        <h2 class="text-xl font-light">2021</h2>
      </div>
      <p class="text-white/70">Rust</p>
      <p class="mt-2 text-base text-white/80">
        A template language (exclaim-grammar) and compiler for static site generation
      </p>
    </CollapsibleSummary>

    <ul class="mt-4 list-inside list-disc space-y-1 border-t border-white/10 pt-4 text-base text-white/80">
      <li>Implemented a non-backtracking recursive descent parser by designing an LL(1) grammar</li>
      <li>Utilized arena-allocated index tree pattern for memory-performant AST generation</li>
    </ul>
  </details>
);
