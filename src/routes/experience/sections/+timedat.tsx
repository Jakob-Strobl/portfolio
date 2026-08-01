import ExternalLink from "lucide-solid/icons/external-link";

import CollapsibleSummary from "~/components/collapsible-summary";

export const TimedatSection = () => (
  <details class="group" open={false}>
    <CollapsibleSummary
      label="View project details"
      actions={
        <a
          class="inline-flex items-center gap-1 text-sm text-night-400 hover:text-night-500"
          href="https://timedat.app"
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          Visit timedat.app <ExternalLink aria-hidden="true" size={13} />
        </a>
      }
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
        <h1>timedat</h1>
        <h2 class="text-xl font-light">2026 - Present</h2>
      </div>
      <p class="text-white/70">Product design · Full-stack web application</p>
      <p class="mt-2 text-base text-white/80">
        A calm, privacy-first time tracker for freelancers and small teams that keeps billable work honest without
        screen surveillance or productivity scoring.
      </p>
    </CollapsibleSummary>

    <div class="mt-4 border-t border-white/10 pt-4">
      <ul class="list-inside list-disc space-y-1 text-base text-white/80">
        <li>
          Designed parallel-task tracking that lets people split overlapping work fairly instead of double-counting time
        </li>
        <li>Built a keyboard-first workflow around always-on timers, quick switching, projects, and custom reports</li>
        <li>
          Made session history and overlap review audit-ready while keeping the interface calm and distraction-free
        </li>
      </ul>
    </div>
  </details>
);
