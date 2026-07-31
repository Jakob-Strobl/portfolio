import { createRenderEffect, createSignal, onCleanup, onMount } from "solid-js";

import { createBackgroundEffect } from "./background-effect";
import type {
  BackgroundConfig,
  BackgroundFrameRatePreference,
  BackgroundKind,
  BackgroundQuality,
  BackgroundRuntimePreferences,
} from "./types";
import { createBackgroundSeed } from "./wave-model";
import { createWebGlBackgroundHost, type WebGlBackgroundHost } from "./webgl-background";

export interface WavesBackgroundProps {
  kind?: BackgroundKind;
  seed?: number;
  speed?: number;
  intensity?: number;
  quality?: BackgroundQuality;
  frameRate?: BackgroundFrameRatePreference;
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

  const getPreferences = (): BackgroundRuntimePreferences => ({
    quality: props.quality ?? "auto",
    frameRate: props.frameRate ?? "auto",
  });

  createRenderEffect(() => {
    const config = getConfig();
    const preferences = getPreferences();
    host?.update(config, preferences);
  });

  onMount(() => {
    if (canvasEl == null) return;

    host = createWebGlBackgroundHost(canvasEl, createBackgroundEffect, getConfig(), getPreferences());
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
