import { A } from "@solidjs/router";

export const FoglineSection = () => (
  <div class="min-w-0 w-full">
    <h3 class="experience-card-title">Fogline</h3>
    <p class="experience-card-meta">Private project · Agent benchmark</p>
    <p class="experience-card-summary mt-2">
      A seeded adversarial simulation for testing how AI agents make command decisions on partial, stale information.
    </p>
    <A class="experience-card-control mt-3 inline-flex text-night-400 hover:text-night-500" href="/projects/fogline">
      Read the case study
    </A>
  </div>
);
