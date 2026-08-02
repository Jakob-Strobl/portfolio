import CollapsibleSummary from "~/components/collapsible-summary";

export const WebcamSandboxSection = () => (
  <details class="group" open={false}>
    <CollapsibleSummary label="View project details">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-2xl">
        <h3>3D Webcam Sandbox</h3>
        <h2 class="text-xl font-light">2023 - Present</h2>
      </div>
      <p class="text-white/70">Godot, Rust with gdext, Nokhwa, OpenSeeFace</p>
      <p class="mt-2 text-base text-white/80">
        A real-time 3D renderer that maps tracked facial movement onto 3D models and updates their textures from a live
        video feed
      </p>
    </CollapsibleSummary>

    <ul class="mt-4 list-inside list-disc space-y-1 border-t border-white/10 pt-4 text-base text-white/80">
      <li>Built a Rust subprocess kernel for asynchronous, real-time FFI message passing</li>
      <li>
        Implemented virtual video splitting to provide separate feeds for face-tracker input and game-engine textures
      </li>
      <li>Used traits for dependency injection to enable mock-based system tests locally and on CI runners</li>
    </ul>
  </details>
);
