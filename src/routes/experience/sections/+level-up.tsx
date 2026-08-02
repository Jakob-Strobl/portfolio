export const LevelUpSection = () => (
  <div class="flex flex-col gap-1">
    <div>
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 class="experience-card-title">Level Up Software LLC</h2>
        <h3 class="experience-card-date">2025 - Present</h3>
      </div>
      <p class="experience-card-meta">Co-founder, full-stack developer, and UI/UX designer · Remote (Arlington, VA)</p>
      <p class="experience-card-muted">Software consulting and product development</p>
    </div>

    <div>
      <div class="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 class="experience-card-subtitle">EMR Platform (under NDA)</h2>
        <h3 class="experience-card-date">Feb 2025 - Present</h3>
      </div>
      <p class="experience-card-tech">React, Better Auth, Zod, TypeScript</p>
    </div>
    <ul class="experience-card-body list-inside list-disc space-y-1">
      <li>
        Architected a containerized backend-for-frontend (BFF) microservice using ElysiaJS and Better Auth to centralize
        API calls and handle authentication and authorization
      </li>
      <li>
        Integrated with a custom C# server using FHIR v4 for HIPAA-regulated workflows, plus scheduling through the
        Acuity API
      </li>
    </ul>
  </div>
);
