export const LevelUpSection = () => (
  <div class="flex flex-col gap-1">
    <div>
      <div class="text-2xl flex justify-between items-baseline flex-wrap">
        <h2>Level Up Software LLC</h2> <h3 class="font-light text-xl">2025 - Present</h3>
      </div>
      <p class="text-white/70 text-lg">Co-founder & Lead Full-Stack Developer · Remote (Arlington, VA)</p>
      <p class="text-white/70 text-sm">Consulting and publishing</p>
    </div>

    <div>
      <div class="text-lg mt-2 flex justify-between flex-wrap">
        <h2>EMR Platform (under NDA)</h2> <h3 class="font-light">Feb 2025 - Jul 2025</h3>
      </div>
      <p class="text-white/60 text-base">React w/ Better-Auth (Zod, TypeScript) </p>
    </div>
    <ul class="list-disc list-inside text-white/80 space-y-1 text-base">
      <li>
        Architected a containerized BFF microservice using ElysiaJS and Better-Auth to centralize API calls and manage
        authn/authz
      </li>
      <li>Integrated w/ a custom HIPAA (FHIR v4) compliant C# server and scheduling with Acuity API</li>
    </ul>
  </div>
);
