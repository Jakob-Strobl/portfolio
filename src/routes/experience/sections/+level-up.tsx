export const LevelUpSection = () => (
  <div class="flex flex-col gap-1">
    <h1 class="text-2xl">Level Up Software LLC</h1>
    <p class="text-white/70">Co-founder & Lead Full-Stack Developer · Remote (Arlington, VA)</p>
    <p class="text-white/70 text-base">Consulting and publishing</p>

    <div class="text-lg mt-2 flex justify-between">
      <h2>EMR Platform (under NDA)</h2> <h3>Feb 2025 - Jul 2025</h3>
    </div>
    <p class="text-white/60 text-base">React w/ Better-Auth (Zod, TypeScript) </p>
    <ul class="list-disc list-inside text-white/80 space-y-1">
      <li>
        Architected a containerized BFF microservice using ElysiaJS and Better-Auth to centralize API calls and manage
        authn/authz
      </li>
      <li>Integrated w/ a custom HIPAA (FHIR v4) compliant C# server and scheduling with Acuity API</li>
    </ul>
  </div>
);
