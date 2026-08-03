import { children, createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { Accessor, JSX, Signal } from "solid-js";
import { addShadow, beginShadowEntrance, removeShadow } from "./actions";
import { ShadowOriginOptions, ShadowStartingStates, ShadowStates } from "./types";

interface ShadowProps {
  children: JSX.Element | JSX.ArrayElement;
  /**
   * Set the origin strategy for where to set the starting position of the element on-mount
   * @default 'relative'
   */
  origin?: ShadowOriginOptions;

  /**
   * Delay on the shadow's intial warmup transition - i.e., delays the isCold signal flip to warm
   * @default undefined := Do not transition the content's text opacity
   * @example Set prop to 0 or greater if you want the content to fade-in
   *
   * // TODO IDEA: Kind of crazy but what if we added shadows in order of warmup vs DOM
   **/
  warmupDelayMs?: number;

  /**
   * Set the delay for fading in the content
   *
   * @warn fade-in only occurs if warmupDelayMs is not undefined and >= 0
   */
  contentFadeInDelayMs?: number;

  /**
   * Set the resulting shadow element's position to fixed
   *
   * TIP: Useful for pinning navigation elements
   */
  fixed?: boolean;

  // TODO [ ]: Add optional title that goes above the shadow?
  // TODO [ ]: Parameterize the padding of a shadow?
  paddingOverride?: string;

  /**
   * Controls the opacity of the detached shadow background.
   * @default 0.6
   */
  shadowOpacity?: Accessor<number>;
}

/**
 * This component wraps any content that should have a shadow applied to it
 * @param props
 * @returns
 */
export default function Shadow(props: ShadowProps) {
  const resolved = children(() => props.children);
  const shadowId = createUniqueId();
  // If warmupDelayMs is defined, fade-in content
  const [shadowState, setShadowState] = createSignal<ShadowStartingStates>(
    props.warmupDelayMs === undefined ? "ready" : "fade-in",
  ) as Signal<ShadowStates>;
  const [pointerHovered, setPointerHovered] = createSignal(false);
  const [focusWithin, setFocusWithin] = createSignal(false);
  const interactionActive = createMemo(() => pointerHovered() || focusWithin());
  const [settlingEpoch, advanceSettlingEpoch] = createSignal(0);
  const [entranceEpoch, startEntranceEpoch] = createSignal(0);
  let shadowEl: HTMLDivElement;
  let registered = false;
  let active = false;

  createEffect(() => {
    if (typeof window === "undefined") return;
    if (entranceEpoch() === 0 || !active) return;
    const state = shadowState();
    settlingEpoch();
    if (state !== "ready" && state !== "fade-in" && state !== "settling") return;

    let firstPaintFrame: number | undefined;
    let secondPaintFrame: number | undefined;
    let warmupTimer: number | undefined;
    firstPaintFrame = window.requestAnimationFrame(() => {
      secondPaintFrame = window.requestAnimationFrame(() => {
        const warmupDelayMs = props.warmupDelayMs ?? 0;
        const begin = () => active && beginShadowEntrance(shadowId);
        if (warmupDelayMs >= 0) {
          warmupTimer = window.setTimeout(begin, warmupDelayMs);
        } else {
          queueMicrotask(begin);
        }
      });
    });
    onCleanup(() => {
      if (firstPaintFrame !== undefined) window.cancelAnimationFrame(firstPaintFrame);
      if (secondPaintFrame !== undefined) window.cancelAnimationFrame(secondPaintFrame);
      if (warmupTimer !== undefined) window.clearTimeout(warmupTimer);
    });
  });

  onMount(() => {
    registered = addShadow(shadowEl, props.origin, {
      shadowState,
      setShadowState,
      settlingEpoch,
      advanceSettlingEpoch,
      fixed: props.fixed ?? false,
      warmupDelayMs: props.warmupDelayMs ?? 0,
      backgroundOpacity: props.shadowOpacity ?? (() => 0.6),
    });
    if (!registered) return;

    active = true;
    startEntranceEpoch((epoch) => epoch + 1);
  });

  onCleanup(() => {
    active = false;
    if (!registered) return;
    registered = false;
    removeShadow(shadowId);
  });

  return (
    <div
      class={`
        min-w-0 w-full h-[inherit] border-[1px] transition-colors duration-300 rounded-lg
        ${shadowState() === "warm" ? (interactionActive() ? "border-white/14" : "border-white/6") : "border-white/0"}
      `}
      onPointerEnter={(event) => event.pointerType !== "touch" && setPointerHovered(true)}
      onPointerLeave={(event) => event.pointerType !== "touch" && setPointerHovered(false)}
      onFocusIn={() => setFocusWithin(true)}
      onFocusOut={(event) => {
        const nextFocusedElement = event.relatedTarget;
        if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) return;
        setFocusWithin(false);
      }}
    >
      <div
        class={`min-w-0 text-white ${props.paddingOverride !== undefined ? props.paddingOverride : "p-3 lg:p-4 2xl:p-5"} rounded-lg
          transition-opacity duration-750 ease-[cubic-bezier(0.5, 1, 0.89, 1)] h-[inherit] text-sm md:text-md xl:text-lg 
        `}
        style={{
          // Start with 0 opacity so we can "fade-in"
          opacity: shadowState() === "fade-in" || shadowState() === "settling" ? 0 : 100,
          "transition-delay": `${props.contentFadeInDelayMs ?? 250}ms`,
        }}
        ref={(el) => (shadowEl = el)}
        data-shadow={shadowId}
      >
        {resolved()}
      </div>
    </div>
  );
}
