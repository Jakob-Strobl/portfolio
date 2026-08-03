import CollapsibleSummary from "~/components/collapsible-summary";

export const WebcamSandboxSection = () => (
  <details class="group min-w-0 w-full" open={false}>
    <CollapsibleSummary label="View project details">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 class="experience-card-title">3D Webcam Sandbox</h3>
        <h2 class="experience-card-date">2023 - Present</h2>
      </div>
      <p class="experience-card-meta">Private project · Sole developer</p>
      <p class="experience-card-tech">Godot, GDScript, Rust with gdext, Nokhwa, OpenSeeFace (Python)</p>
      <p class="experience-card-summary mt-2">
        A real-time 3D VTuber renderer that maps tracked facial movement onto 3D models and updates their textures from
        a live video feed
      </p>
    </CollapsibleSummary>

    <ul class="experience-card-expanded experience-card-expanded-standalone experience-card-body list-inside list-disc space-y-1">
      <li>Built a Rust subprocess kernel for asynchronous, real-time FFI message passing</li>
      <li>
        Implemented virtual video splitting to provide separate feeds for face-tracker input and game-engine textures
      </li>
      <li>Used traits for dependency injection to enable mock-based system tests locally and on CI runners</li>
      <li>
        Kept the OpenSeeFace integration current by updating dependencies and adapting the surrounding plumbing to
        breaking changes
      </li>
    </ul>
  </details>
);
