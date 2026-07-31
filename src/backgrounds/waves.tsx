import { createRenderEffect, createSignal, onCleanup, onMount } from "solid-js";

import { createBackgroundEffect } from "./background-effect";
import type { BackgroundConfig, BackgroundKind } from "./types";
import { createBackgroundSeed } from "./wave-model";
import { createWebGlBackgroundHost, type WebGlBackgroundHost } from "./webgl-background";

export interface WavesBackgroundProps {
  kind?: BackgroundKind;
  seed?: number;
  speed?: number;
  intensity?: number;
}

export default function WebGlBackground(props: WavesBackgroundProps) {
  const runtimeSeed = createBackgroundSeed();
  const [isReady, setReady] = createSignal(false);
  let canvasEl: HTMLCanvasElement | undefined;
  let host: WebGlBackgroundHost | undefined;

  const getConfig = (): BackgroundConfig => ({
    kind: props.kind ?? "waves",
    seed: props.seed ?? runtimeSeed,
    speed: props.speed ?? 1,
    intensity: props.intensity ?? 1,
  });

  createRenderEffect(() => {
    const config = getConfig();
    host?.update(config);
  });

  onMount(() => {
    if (canvasEl == null) return;

    host = createWebGlBackgroundHost(canvasEl, createBackgroundEffect, getConfig());
    setReady(true);
  });

  onCleanup(() => host?.dispose());

  return (
    <canvas
      ref={canvasEl}
      aria-hidden="true"
      class="fade-in block h-[100dvh] w-screen pointer-events-none"
      style={{
        "background-color": "#130d20",
        opacity: isReady() ? "1" : "0",
      }}
    />
  );
}
