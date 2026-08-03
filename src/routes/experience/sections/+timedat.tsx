import ExternalLink from "lucide-solid/icons/external-link";

import CollapsibleSummary from "~/components/collapsible-summary";

export const TimedatSection = () => (
  <details class="group min-w-0 w-full" open={false}>
    <CollapsibleSummary
      label="View project details"
      actions={
        <a
          class="inline-flex items-center gap-1 text-sm text-night-400 hover:text-night-500"
          href="https://timedat.app"
          target="_blank"
          rel="noopener"
          onClick={(event) => event.stopPropagation()}
        >
          Visit timedat.app <ExternalLink aria-hidden="true" size={13} />
        </a>
      }
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 class="experience-card-title">timedat</h3>
        <h2 class="experience-card-date">2026 - Present</h2>
      </div>
      <p class="experience-card-meta">Product lead · Product design &amp; UX · Full-stack development</p>
      <p class="experience-card-tech">Svelte 5, SvelteKit, Clerk, Tailwind CSS, Vitest, Convex</p>
      <p class="experience-card-summary mt-2">
        A privacy-first time tracker for freelancers, teams, and founders to record billable work and sweat
        equity—without screen surveillance or productivity scoring.
      </p>
    </CollapsibleSummary>

    <div class="experience-card-expanded experience-card-expanded-standalone">
      <ul class="experience-card-body list-inside list-disc space-y-1">
        <li>Designed parallel-task tracking to allocate overlapping time across tasks without double-counting it</li>
        <li>
          Built flexible, portable live sessions backed by Convex's ACID-compliant database, with a custom diff builder
          for manual edits and saves while a session is active
        </li>
        <li>
          Tracked fine-grained slices of task activity, breaks, and task switches in live sessions, so people can review
          active-time overlaps without double-counting ad hoc work logged while another session was paused
        </li>
      </ul>
    </div>
  </details>
);
