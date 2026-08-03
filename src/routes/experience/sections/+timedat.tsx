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
          rel="noopener"
          onClick={(event) => event.stopPropagation()}
        >
          Visit timedat.app <ExternalLink aria-hidden="true" size={13} />
        </a>
      }
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
        <h3>timedat</h3>
        <h2 class="text-xl font-light">2026 - Present</h2>
      </div>
      <p class="text-white/70">Product design and full-stack development</p>
      <p class="text-white/60">Convex</p>
      <p class="mt-2 text-base text-white/80">
        A privacy-first time tracker for freelancers, teams, and founders to record billable work and sweat
        equity—without screen surveillance or productivity scoring.
      </p>
    </CollapsibleSummary>

    <div class="mt-4 border-t border-white/10 pt-4">
      <ul class="list-inside list-disc space-y-1 text-base text-white/80">
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
