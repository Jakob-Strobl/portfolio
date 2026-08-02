export const LevelUpSection = () => (
  <div class="flex flex-col gap-1">
    <div>
      <div class="text-2xl flex justify-between items-baseline flex-wrap">
        <h2>Level Up Software LLC</h2> <h3 class="font-light text-xl">2025 - Present</h3>
      </div>
      <p class="text-white/70 text-lg">
        Co-founder, lead full-stack developer, and primary product designer · Remote (Arlington, VA)
      </p>
      <p class="text-white/70 text-sm">Software consulting and product development</p>
    </div>

    <div>
      <div class="text-lg mt-2 flex justify-between flex-wrap">
        <h2>EMR Platform (under NDA)</h2> <h3 class="font-light">Feb 2025 - Present</h3>
      </div>
      <p class="text-white/60 text-base">React, Better Auth, Zod, TypeScript</p>
    </div>
    <ul class="list-disc list-inside text-white/80 space-y-1 text-base">
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
