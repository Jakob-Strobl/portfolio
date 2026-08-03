export const SkillsSection = () => (
  <div>
    <dl class="grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-lg">Languages & runtimes</dt>
        <dd class="mt-1 text-base text-white/70">
          TypeScript, JavaScript, Rust, C#/.NET, GDScript, Python, C, C++, Java, Assembly, Bun, Node.js, Deno
        </dd>
      </div>

      <div>
        <dt class="text-lg">Frontend</dt>
        <dd class="mt-1 text-base text-white/70">
          React, Svelte/SvelteKit, SolidJS, StencilJS, Web Components, Tailwind CSS, SCSS
        </dd>
      </div>

      <div>
        <dt class="text-lg">Backend & infrastructure</dt>
        <dd class="mt-1 text-base text-white/70">
          ElysiaJS, Better Auth, Zod, FHIR v4, Convex, AWS, Cloudflare (Pages, Workers, Durable Objects), Terraform,
          GitHub Actions
        </dd>
      </div>

      <div>
        <dt class="text-lg">Systems & graphics</dt>
        <dd class="mt-1 text-base text-white/70">
          Godot, WebAssembly, WebGL/GLSL, vertex and fragment shaders, FFI, compiler design
        </dd>
      </div>

      <div>
        <dt class="text-lg">AI & developer tooling</dt>
        <dd class="mt-1 text-base text-white/70">
          AI product integration, agent harnesses, computer-vision systems, New Relic, PostHog, Wrangler
        </dd>
      </div>

      <div>
        <dt class="text-lg">Engineering practice</dt>
        <dd class="mt-1 text-base text-white/70">
          Product design, system architecture, workflow orchestration, SDLC automation, CI/CD, testing, observability,
          analytics
        </dd>
      </div>
    </dl>
    <p class="mt-4 text-sm text-white/60">
      <span class="font-medium text-white/70">Additional contributions:</span> Exarchos SDLC tooling; early Deno v1
      TOML parser work—fixed edge cases and expanded test coverage.
    </p>
  </div>
);
