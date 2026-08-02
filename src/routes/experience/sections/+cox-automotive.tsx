import CollapsibleSummary from "~/components/collapsible-summary";

export const CoxAutomotiveSection = () => (
  <details class="group min-w-0 w-full" open={false}>
    <CollapsibleSummary label="View full role history">
      <div>
        <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
          <h2>Cox Automotive</h2>
          <h3 class="text-xl font-light">Aug 2021 - Jul 2025</h3>
        </div>
        <p class="text-lg text-white/70">Full-stack developer · Remote (Arlington, VA)</p>
      </div>

      <div class="mt-3 space-y-3 text-base">
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-lg">
            <h3>Software Engineer II</h3>
            <span class="font-light">Mar 2023</span>
          </div>
          <p class="mt-1 text-sm text-white/80">
            • Automated upgrades for 10,000+ dealers with a custom .NET worker, saving more than 20,000 hours of manual
            work
          </p>
        </div>
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-lg">
            <h3>Software Engineer I</h3>
            <span class="font-light">Aug 2021</span>
          </div>
          <p class="mt-1 text-sm text-white/80">
            • Built a web-component library and delivered the Intelligent Promotions UI within seven months
          </p>
        </div>
      </div>
    </CollapsibleSummary>

    <div class="mt-4 space-y-4 border-t border-white/10 pt-4">
      <div>
        <p class="text-base text-white/70">
          B2B SaaS web applications for merchandising: Intelligent Promotions and vAuto
        </p>
        <p class="text-sm text-white/60">
          TypeScript, StencilJS, Tailwind CSS, SCSS, Terraform, C#/.NET, GitHub Actions, AWS, React, New Relic
        </p>
      </div>

      <div>
        <p class="text-sm text-white/60">Additional contributions as Software Engineer II</p>
        <ul class="mt-1 list-inside list-disc space-y-1 text-base text-white/80">
          <li>Onboarded teams to existing front-end projects and mentored them as a front-end subject-matter expert</li>
          <li>
            Revamped the front-end CI/CD pipeline to streamline internal deployments and testing, shortening the
            development feedback loop
          </li>
          <li>
            Diagnosed and fixed an architecture-mismatch bug in an enterprise platform tool that installed x86_64
            Terraform binaries and provider plugins during local Terraform setup on ARM64, restoring all ARM64 builds
            while keeping the setup aligned with enterprise guidelines
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm text-white/60">Additional contributions as Software Engineer I</p>
        <ul class="mt-1 list-inside list-disc space-y-1 text-base text-white/80">
          <li>
            Built a custom "Smart Fields" HTML5 text editor with a language parser, syntax highlighting, autocomplete,
            and backward compatibility
          </li>
        </ul>
      </div>
    </div>
  </details>
);
