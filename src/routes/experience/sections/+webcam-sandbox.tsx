export const WebcamSandboxSection = () => (
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl">3D Webcam Sandbox</h1>
    <p class="text-white/70">Godot, Rust with gdext, Nokhwa, OpenSeeFace</p>
    <p class="text-white/70 text-sm">
      A real-time 3D renderer with face tracking that rigs face movements to any 3D model and simultaneously updates
      texture resources with the video feed
    </p>

    <ul class="list-disc list-inside text-white/80 space-y-1 mt-2">
      <li>Developed a Rust sub-process kernel for real-time async FFI message passing and handling</li>
      <li>Implemented virtualized video splitting for face tracker input and game engine textures</li>
      <li>Eased testing system-level results with mocks by using traits as dependency injection</li>
    </ul>
  </div>
);
