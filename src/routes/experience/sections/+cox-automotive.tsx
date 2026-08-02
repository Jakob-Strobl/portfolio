import CollapsibleSummary from "~/components/collapsible-summary";

export const CoxAutomotiveSection = () => (
  <details class="group min-w-0 w-full" open={false}>
    <CollapsibleSummary label="View full role history">
      <div>
        <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 class="experience-card-title">Cox Automotive</h2>
          <h3 class="experience-card-date">Aug 2021 - Jul 2025</h3>
        </div>
        <p class="experience-card-meta">Full-stack developer · Remote (Arlington, VA)</p>
      </div>

      <div class="mt-3 space-y-3 text-base">
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 class="experience-card-subtitle">Software Engineer II</h3>
            <span class="experience-card-date">Mar 2023</span>
          </div>
          <p class="mt-1 experience-card-summary">
            • Automated upgrades for 10,000+ dealers with a custom .NET worker, saving more than 20,000 hours of manual
            work
          </p>
        </div>
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 class="experience-card-subtitle">Software Engineer I</h3>
            <span class="experience-card-date">Aug 2021</span>
          </div>
          <p class="mt-1 experience-card-summary">
            • Built a web-component library and delivered the Intelligent Promotions UI within seven months
          </p>
        </div>
      </div>
    </CollapsibleSummary>

    <div class="experience-card-expanded space-y-4">
      <div>
        <p class="experience-card-meta">
          B2B SaaS web applications for merchandising: Intelligent Promotions and vAuto
        </p>
        <p class="experience-card-tech">
          TypeScript, StencilJS, Tailwind CSS, SCSS, Terraform, C#/.NET, GitHub Actions, AWS, React, New Relic
        </p>
      </div>

      <div>
        <p class="experience-card-detail-label">Additional contributions as Software Engineer II</p>
        <ul class="experience-card-body mt-1 list-inside list-disc space-y-1">
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
        <p class="experience-card-detail-label">Additional contributions as Software Engineer I</p>
        <ul class="experience-card-body mt-1 list-inside list-disc space-y-1">
          <li>
            Built a custom "Smart Fields" HTML5 text editor with a language parser, syntax highlighting, autocomplete,
            and backward compatibility
          </li>
        </ul>
      </div>
    </div>
  </details>
);
