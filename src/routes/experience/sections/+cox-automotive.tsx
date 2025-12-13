export const CoxAutomotiveSection = () => (
  <div class="flex flex-col gap-1">
    <div>
      <div class="text-2xl flex justify-between items-baseline">
        <h2>Cox Automotive </h2> <h3 class="font-light text-xl">Aug 2021 - Jul 2025</h3>
      </div>

      <p class="text-white/70 text-lg">Full Stack Developer · Remote (Arlington, VA)</p>
    </div>
    <div>
      <p class="text-white/70 text-base">Merchandising B2B SaaS web apps - Intelligent Promotions/vAuto</p>
      <p class="text-white/60 text-sm">
        Typescript, StencilJS, Tailwind, SCSS, Terraform, C#.NET, GHA, AWS, React, NewRelic
      </p>
    </div>
    <div class="text-lg mt-2 flex justify-between">
      <h2>Software Engineer II </h2> <h3 class="font-light">Mar 2023</h3>
    </div>

    <ul class="list-disc list-inside text-white/80 space-y-1 text-base">
      <li>Automated 10,000+ dealer upgrades with a custom .NET worker, saving over 20,000 work-hours</li>
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

    <div class="text-lg mt-4 flex justify-between">
      <h2>Software Engineer I</h2> <h3 class="font-light">Aug 2021</h3>
    </div>

    <ul class="list-disc list-inside text-white/80 space-y-1 text-base">
      <li>Developed a web component library and delivered Intelligent Promotions UI in 7 months</li>
      <li>
        Implemented a hand-made "Smart Fields" text editor in HTML5 with a custom language parser featuring syntax
        highlighting, suggestions with auto-fill, and backward compatibility
      </li>
    </ul>
  </div>
);
