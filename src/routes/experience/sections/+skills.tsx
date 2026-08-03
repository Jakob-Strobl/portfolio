export const SkillsSection = () => (
  <div>
    <dl class="grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="experience-card-subtitle">Languages & runtimes</dt>
        <dd class="experience-card-meta mt-1">
          TypeScript, JavaScript, Rust, C, GDScript, Python, C#/.NET, C++, Assembly, Bun, Node.js, Deno
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Frontend</dt>
        <dd class="experience-card-meta mt-1">
          React, Svelte/SvelteKit, SolidJS, Web Components, StencilJS, Tailwind CSS, SCSS, React Native
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Backend & infrastructure</dt>
        <dd class="experience-card-meta mt-1">
          Terraform, GitHub Actions, ElysiaJS, Better Auth, Convex, Clerk, Cloudflare (Pages, Workers, Durable Objects),
          Wrangler, FHIR v4, AWS
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Systems, performance & graphics</dt>
        <dd class="experience-card-meta mt-1">
          Godot, WebAssembly, WebGL/GLSL, Parallel programming, synchronization primitives, cache locality, FFI,
          compiler design
        </dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">AI & developer tooling</dt>
        <dd class="experience-card-meta mt-1">AI product integration, agent harnesses, computer-vision systems</dd>
      </div>

      <div>
        <dt class="experience-card-subtitle">Engineering practice</dt>
        <dd class="experience-card-meta mt-1">
          Product design, system architecture, workflow orchestration, SDLC automation, CI/CD, testing, observability
          (New Relic), analytics (PostHog)
        </dd>
      </div>
    </dl>
    <p class="experience-card-muted mt-4">
      <span class="experience-card-detail-label">Additional contributions:</span> Exarchos SDLC tooling; early Deno v1
      TOML parser work—fixed edge cases and expanded test coverage.
    </p>
  </div>
);
