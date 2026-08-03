export const SkillsSection = () => (
  <div>
    <dl class="grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="experience-card-subtitle">Languages & runtimes</dt>
        <dd class="experience-card-meta mt-1">
          TypeScript, JavaScript, Rust, C#/.NET, GDScript, Python, C, C++, Assembly, Bun, Node.js, Deno
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Frontend</dt>
        <dd class="experience-card-meta mt-1">
          React, Svelte/SvelteKit, SolidJS, StencilJS, Web Components, Tailwind CSS, SCSS
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Backend & infrastructure</dt>
        <dd class="experience-card-meta mt-1">
          ElysiaJS, Better Auth, Zod, FHIR v4, Convex, AWS, Cloudflare (Pages, Workers, Durable Objects), Terraform,
          GitHub Actions
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Systems, performance & graphics</dt>
        <dd class="experience-card-meta mt-1">
          High-performance computing (HPC), parallel programming, multiprocessing/multithreading, synchronization
          primitives, cache locality, Godot, WebAssembly, WebGL/GLSL, FFI, compiler design
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">AI & developer tooling</dt>
        <dd class="experience-card-meta mt-1">
          AI product integration, agent harnesses, computer-vision systems, New Relic, PostHog, Wrangler
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Engineering practice</dt>
        <dd class="experience-card-meta mt-1">
          Product design, system architecture, workflow orchestration, SDLC automation, CI/CD, testing, observability,
          analytics
        </dd>
      </div>
    </dl>
    <p class="experience-card-muted mt-4">
      <span class="experience-card-detail-label">Additional contributions:</span> Exarchos SDLC tooling; early Deno v1
      TOML parser work—fixed edge cases and expanded test coverage.
    </p>
  </div>
);
