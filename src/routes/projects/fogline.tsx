import { A } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import { For, JSX } from "solid-js";

import Seo from "~/components/seo";
import Shadow from "~/components/shadow/shadow";
import TimelineLayout from "~/layouts/timeline-layout";

const ASSET_DIR = "/projects/fogline";

const EVALUATION_METHOD = [
  ["Seeded runs.", "Every run starts from a recorded seed, so a result can be replayed."],
  ["Matched groups.", "Controllers are compared on the same seeds and scenarios."],
  ["Frozen input hashes.", "Scenario and protocol inputs are hashed and frozen before a comparison runs."],
  ["Failure counts kept.", "Failed and rejected runs stay in the record instead of being filtered out."],
  [
    "Corrections versioned, not rewritten.",
    "When a result is corrected, the correction ships as a new version next to the original.",
  ],
] as const;

const ROADMAP = [
  {
    label: "Shipped",
    items: [
      "Seeded adversarial sim core (deterministic seeds)",
      "Agent observation layer (partial, stale intel)",
      "Agent protocols v1–v6 with versioned JSON schemas",
      "Agent runtime boundary",
      "Controllers: Codex subprocess, time budgets, controller recovery",
      "Replay & diagnostics: C2-style console and replay viewer",
      "Results: per-run records",
    ],
  },
  {
    label: "In progress",
    items: ["Headless Docker sim container", "Results database (SQLite, optional Parquet export)"],
  },
  {
    label: "Planned",
    items: ["SITL fault injection at a gRPC runtime boundary with per-call traces", "Optional RL/SFT episode export"],
  },
] as const;

interface ClipProps {
  name: string;
  label: string;
  caption: string;
}

// Muted, user-started clips: no autoplay, so reduced-motion users never get unrequested motion.
function Clip(props: ClipProps) {
  return (
    <figure class="mt-4">
      <video
        class="w-full rounded-sm border border-white/10 bg-night-black"
        controls
        muted
        playsinline
        preload="none"
        width="960"
        height="540"
        poster={`${ASSET_DIR}/${props.name}-poster.jpg`}
        aria-label={props.label}
      >
        <source src={`${ASSET_DIR}/${props.name}.mp4`} type="video/mp4" />
      </video>
      <figcaption class="experience-card-muted mt-2">{props.caption}</figcaption>
    </figure>
  );
}

function Section(props: { title: string; delay: number; children: JSX.Element }) {
  return (
    <Shadow warmupDelayMs={props.delay} contentFadeInDelayMs={500}>
      <section class="min-w-0 w-full">
        <h2 class="experience-card-title">{props.title}</h2>
        {props.children}
      </section>
    </Shadow>
  );
}

export default function Fogline() {
  return (
    <>
      <Seo
        title="Fogline: agent benchmark case study | Jakob Strobl"
        description="Fogline is a seeded adversarial simulation for testing how AI agents make command decisions on partial, stale information."
        path="/projects/fogline"
      />
      <TimelineLayout
        contentGap="gap-4"
        navBack={() => (
          <A href="/experience">
            <ArrowBigLeft size={20} />
            <span class="hidden sm:inline">Experience</span>
          </A>
        )}
        content={
          <>
            <div>
              <p class="experience-card-meta">Project · Agent benchmark</p>
              <h1 class="experience-section-title">Fogline</h1>
              <hr class="mt-2 border-night-300" />
            </div>
            <Shadow warmupDelayMs={125} contentFadeInDelayMs={500}>
              <div class="min-w-0 w-full">
                <p class="experience-card-summary">
                  A seeded adversarial simulation for testing how AI agents make command decisions when what they can
                  see is partial and out of date.
                </p>
                <Clip
                  name="c2-console"
                  label="C2 console replaying a seeded run"
                  caption="C2 console replaying a seeded run (scripted baseline controller)."
                />
              </div>
            </Shadow>
            <Section title="Problem" delay={250}>
              <p class="experience-card-body mt-2">
                AI agents are increasingly asked to make command decisions, but in contested settings they rarely see
                the whole picture. Intel arrives partial and stale. Fogline asks what an agent does with that: whether
                it acts on old information, how it recovers, and how often it fails.
              </p>
            </Section>
            <Section title="Architecture" delay={375}>
              <p class="experience-card-body mt-2">
                The pipeline runs left to right, from the seeded sim core to results. Solid stages are shipped. Dashed
                pieces are in progress or planned, drawn next to the stage they extend.
              </p>
              <div class="scrollbar-custom mt-4 overflow-x-auto" tabindex="0" aria-label="Architecture diagram">
                <img
                  class="min-w-[56rem] w-full rounded-sm"
                  src={`${ASSET_DIR}/architecture.svg`}
                  width="1400"
                  height="384"
                  alt="Fogline architecture. Shipped pipeline: seeded adversarial sim core with deterministic seeds, agent observation layer with partial, stale intel, agent protocols v1 to v6 with versioned JSON schemas, agent runtime boundary, controllers (Codex subprocess, time budgets, controller recovery), replay and diagnostics (C2-style console, replay viewer), and results as per-run records. In progress: headless Docker sim container and a results database. Planned: SITL fault injection with gRPC per-call traces, and optional RL/SFT episode export."
                />
              </div>
              <p class="experience-card-muted mt-2 md:hidden">Scroll sideways to see all seven stages.</p>
              <h3 class="experience-card-detail-label mt-4">Replay &amp; diagnostics</h3>
              <Clip
                name="replay-scrub"
                label="Replay viewer scrubbing a seeded run"
                caption="Replay viewer scrubbing the same seeded run's timeline (truth view)."
              />
            </Section>
            <Section title="Evaluation method" delay={500}>
              <ul class="experience-card-body mt-1 list-inside list-disc space-y-1">
                <For each={EVALUATION_METHOD}>
                  {([term, detail]) => (
                    <li>
                      <span class="font-medium text-white">{term}</span> {detail}
                    </li>
                  )}
                </For>
              </ul>
            </Section>
            <Section title="Roadmap" delay={625}>
              <div class="mt-2 space-y-4">
                <For each={ROADMAP}>
                  {(group) => (
                    <div>
                      <h3 class="experience-card-detail-label">{group.label}</h3>
                      <ul class="experience-card-body mt-1 list-inside list-disc space-y-1">
                        <For each={group.items}>{(item) => <li>{item}</li>}</For>
                      </ul>
                    </div>
                  )}
                </For>
              </div>
            </Section>
            <Section title="Results" delay={750}>
              <p class="experience-card-body mt-2">Benchmark results will be published once reviewed.</p>
            </Section>
            <Shadow warmupDelayMs={875} contentFadeInDelayMs={500}>
              <div class="min-w-0 w-full space-y-2">
                <p class="experience-card-body">
                  Fogline's code is private while the benchmark matures. The write-up, architecture, and recorded runs
                  are public. Happy to walk through the code in an interview.
                </p>
                <p class="experience-card-muted">Designed by Jakob; built with AI coding agents under his direction.</p>
              </div>
            </Shadow>
          </>
        }
      ></TimelineLayout>
    </>
  );
}
