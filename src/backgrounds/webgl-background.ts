import { createAnimationLoop } from "./animation-loop";
import {
  DEFAULT_BACKGROUND_PREFERENCES,
  observeBackgroundPerformanceHints,
  resolveBackgroundFrameMode,
  resolveBackgroundResolutionScale,
  type BackgroundPerformanceObserver,
  type BackgroundFrameMode,
} from "./performance-policy";
import type {
  BackgroundConfig,
  BackgroundEffect,
  BackgroundEffectFactory,
  BackgroundRuntimePreferences,
} from "./types";

export type WebGlBackgroundHost = {
  update(config: BackgroundConfig, preferences?: BackgroundRuntimePreferences): void;
  resize(): void;
  dispose(): void;
};

const POINTER_FOLLOW_RATE = 7;
const FALLBACK_COLOR = [0.0745, 0.051, 0.1255, 1] as const;

export function normalizePointerPosition(clientX: number, clientY: number, width: number, height: number) {
  return {
    x: Math.min(1, Math.max(0, clientX / Math.max(1, width))),
    y: Math.min(1, Math.max(0, 1 - clientY / Math.max(1, height))),
  };
}

function getViewportDimensions(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();

  return {
    width: Math.max(1, Math.round(canvasRect.width || window.innerWidth)),
    height: Math.max(1, Math.round(canvasRect.height || window.innerHeight)),
  };
}

function getDevicePixelRatio() {
  const devicePixelRatio = window.devicePixelRatio;
  return Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
}

export function createWebGlBackgroundHost(
  canvas: HTMLCanvasElement,
  factory: BackgroundEffectFactory<BackgroundConfig>,
  initialConfig: BackgroundConfig,
  initialPreferences: BackgroundRuntimePreferences = DEFAULT_BACKGROUND_PREFERENCES,
): WebGlBackgroundHost | undefined {
  const context = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    desynchronized: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "default",
    preserveDrawingBuffer: false,
    stencil: false,
  });

  if (context == null) return undefined;
  const gl = context as WebGL2RenderingContext;
  gl.clearColor(...FALLBACK_COLOR);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let config = initialConfig;
  let preferences = initialPreferences;
  let effect: BackgroundEffect<BackgroundConfig> | undefined;
  let performanceObserver: BackgroundPerformanceObserver | undefined;
  let disposed = false;
  let contextLost = false;
  let elapsedSeconds = 0;
  let previousTimestamp: number | undefined;
  let resolutionScale = 1;
  let frameMode: BackgroundFrameMode = "display";
  let pointerX = 0.5;
  let pointerY = 0.5;
  let pointerTargetX = 0.5;
  let pointerTargetY = 0.5;

  const loop = createAnimationLoop((timestamp) => {
    const deltaSeconds =
      frameMode === "static" || previousTimestamp == null ? 0 : Math.min((timestamp - previousTimestamp) / 1000, 0.1);
    previousTimestamp = timestamp;
    elapsedSeconds += deltaSeconds;
    const pointerFollow = 1 - Math.exp(-POINTER_FOLLOW_RATE * deltaSeconds);
    pointerX += (pointerTargetX - pointerX) * pointerFollow;
    pointerY += (pointerTargetY - pointerY) * pointerFollow;
    effect?.render({
      elapsedSeconds,
      deltaSeconds,
      pointer: { x: pointerX, y: pointerY },
    });
  });

  function resize() {
    if (disposed) return;
    const { width, height } = getViewportDimensions(canvas);
    const coarsePointer = performanceObserver?.snapshot().coarsePointer ?? false;
    const nextResolutionScale = resolveBackgroundResolutionScale(
      preferences.quality,
      coarsePointer,
      getDevicePixelRatio(),
    );
    resolutionScale = nextResolutionScale;
    const renderWidth = Math.max(1, Math.round(width * resolutionScale));
    const renderHeight = Math.max(1, Math.round(height * resolutionScale));

    if (canvas.width !== renderWidth) canvas.width = renderWidth;
    if (canvas.height !== renderHeight) canvas.height = renderHeight;
    gl.viewport(0, 0, renderWidth, renderHeight);
    // Effects receive both physical backing dimensions and the logical CSS
    // viewport. Tessellation uses the latter for its mobile anchor budget.
    effect?.resize(renderWidth, renderHeight, width, height);
    loop.invalidate();
  }

  function initializeEffect() {
    effect = factory(gl, config);
    resize();
    elapsedSeconds = 0;
    previousTimestamp = undefined;
  }

  function applyPerformancePolicy() {
    if (disposed || performanceObserver == null) return;
    const hints = performanceObserver.snapshot();
    const nextResolutionScale = resolveBackgroundResolutionScale(
      preferences.quality,
      hints.coarsePointer,
      getDevicePixelRatio(),
    );
    const nextFrameMode = resolveBackgroundFrameMode(preferences.frameRate, hints);

    if (frameMode !== nextFrameMode) previousTimestamp = undefined;
    frameMode = nextFrameMode;
    loop.setMode(nextFrameMode);
    if (resolutionScale !== nextResolutionScale) {
      resolutionScale = nextResolutionScale;
      resize();
    } else {
      loop.invalidate();
    }
  }

  function startIfVisible() {
    if (disposed || contextLost || document.hidden || effect == null) return;
    previousTimestamp = undefined;
    loop.start();
  }

  function showFallback() {
    gl.clearColor(...FALLBACK_COLOR);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function handlePointerMove(event: PointerEvent) {
    const { width, height } = getViewportDimensions(canvas);
    const pointer = normalizePointerPosition(event.clientX, event.clientY, width, height);
    pointerTargetX = pointer.x;
    pointerTargetY = pointer.y;
  }

  function handleContextLost(event: Event) {
    event.preventDefault();
    contextLost = true;
    loop.stop();
    previousTimestamp = undefined;
    effect = undefined;
  }

  function handleContextRestored() {
    if (disposed) return;
    contextLost = false;

    try {
      initializeEffect();
      startIfVisible();
    } catch (error) {
      console.error("Background: Failed to restore WebGL context", error);
      effect = undefined;
      showFallback();
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      loop.stop();
      previousTimestamp = undefined;
      return;
    }

    startIfVisible();
  }

  performanceObserver = observeBackgroundPerformanceHints(applyPerformancePolicy);
  applyPerformancePolicy();

  try {
    initializeEffect();
  } catch (error) {
    console.error("Background: Failed to initialize WebGL effect", error);
    showFallback();
    performanceObserver.dispose();
    performanceObserver = undefined;
    return undefined;
  }

  window.addEventListener("resize", resize, { passive: true });
  window.visualViewport?.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  startIfVisible();

  return {
    update(nextConfig, nextPreferences = preferences) {
      preferences = nextPreferences;
      applyPerformancePolicy();

      if (nextConfig.kind !== config.kind) {
        effect?.dispose();
        effect = undefined;
        config = nextConfig;

        try {
          initializeEffect();
          loop.invalidate();
          startIfVisible();
        } catch (error) {
          console.error("Background: Failed to switch WebGL effect", error);
          effect = undefined;
          loop.stop();
          showFallback();
        }
        return;
      }

      config = nextConfig;
      effect?.update(nextConfig);
      loop.invalidate();
    },
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      loop.stop();
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      performanceObserver?.dispose();
      performanceObserver = undefined;
      effect?.dispose();
      effect = undefined;
    },
  };
}
