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
        A real-time 3D renderer with face tracking that rigs face movements to any 3D model and simultaneously updates
        texture resources with the video feed
      </p>
    </CollapsibleSummary>

    <ul class="mt-4 list-inside list-disc space-y-1 border-t border-white/10 pt-4 text-base text-white/80">
      <li>Developed a Rust sub-process kernel for real-time async FFI message passing and handling</li>
      <li>Implemented virtualized video splitting for face tracker input and game engine textures</li>
      <li>Used traits for dependency injection, enabling mock-based testing of system-level behavior</li>
    </ul>
  </details>
);
