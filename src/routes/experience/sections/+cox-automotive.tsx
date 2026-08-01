import CollapsibleSummary from "~/components/collapsible-summary";

export const CoxAutomotiveSection = () => (
  <details class="group" open={false}>
    <CollapsibleSummary label="View full role history">
      <div>
        <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
          <h2>Cox Automotive</h2>
          <h3 class="text-xl font-light">Aug 2021 - Jul 2025</h3>
        </div>
        <p class="text-lg text-white/70">Full Stack Developer · Remote (Arlington, VA)</p>
      </div>

      <div class="mt-3 space-y-3 text-base">
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-lg">
            <h3>Software Engineer II</h3>
            <span class="font-light">Mar 2023</span>
          </div>
          <p class="mt-1 text-sm text-white/80">
            • Automated 10,000+ dealer upgrades with a custom .NET worker, saving over 20,000 work-hours
          </p>
        </div>
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-lg">
            <h3>Software Engineer I</h3>
            <span class="font-light">Aug 2021</span>
          </div>
          <p class="mt-1 text-sm text-white/80">
            • Developed a web component library and delivered Intelligent Promotions UI in 7 months
          </p>
        </div>
      </div>
    </CollapsibleSummary>

    <div class="mt-4 space-y-4 border-t border-white/10 pt-4">
      <div>
        <p class="text-base text-white/70">Merchandising B2B SaaS web apps - Intelligent Promotions/vAuto</p>
        <p class="text-sm text-white/60">
          Typescript, StencilJS, Tailwind, SCSS, Terraform, C#.NET, GHA, AWS, React, NewRelic
        </p>
      </div>

      <div>
        <p class="text-sm text-white/60">Additional Software Engineer II contributions</p>
        <ul class="mt-1 list-inside list-disc space-y-1 text-base text-white/80">
          <li>Onboarded and mentored teams on existing front-end projects as front-end SME</li>
          <li>
            Revamped the front-end CI/CD pipeline to reduce friction on internal deployments and testing, resulting in a
            tighter development loop
          </li>
          <li>
            Identified and resolved Terraform provider and binary architecture mismatches (ARM64 vs x86_64), enabling
            multi-platform support for an enterprise-wide internal platform tool
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm text-white/60">Additional Software Engineer I contributions</p>
        <ul class="mt-1 list-inside list-disc space-y-1 text-base text-white/80">
          <li>
            Implemented a hand-made "Smart Fields" text editor in HTML5 with a custom language parser featuring syntax
            highlighting, suggestions with auto-fill, and backward compatibility
          </li>
        </ul>
      </div>
    </div>
  </details>
);
