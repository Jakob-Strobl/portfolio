import { children, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { JSX, Signal } from "solid-js";
import { addShadow, removeShadow } from "./actions";
import { ShadowOriginOptions, ShadowStartingStates, ShadowStates } from "./types";
import { DataAttributeKey } from "../../types/dom";

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

  dataset?: {
    [name: DataAttributeKey]: string | undefined;
  };

  // TODO [ ]: Add optional title that goes above the shadow?
  // TODO [ ]: Parameterize the padding of a shadow?
  paddingOverride?: string;
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
  let shadowEl: HTMLDivElement;

  onMount(() => {
    // setTimeout(() => setReady(true), 0);
    // use onMount or createEffect to read after connected to DOM
    addShadow(shadowEl, props.origin, {
      shadowState,
      setShadowState,
      fixed: props.fixed ?? false,
      warmupDelayMs: props.warmupDelayMs ?? 0,
    });
  });

  onCleanup(() => {
    removeShadow(shadowId);
  });

  return (
    <div
      class={`
        w-full border-[1px] transition-colors duration-300 rounded-lg
        ${shadowState() === "warm" ? "border-white/6 hover:border-white/14" : "border-white/0 hover:border-white/0"} 
      `}
      {...props.dataset}
    >
      <div
        class={`text-white ${props.paddingOverride !== undefined ? props.paddingOverride : "p-5"} rounded-lg
          transition-opacity duration-750 ease-[cubic-bezier(0.5, 1, 0.89, 1)]
        `}
        style={{
          // Start with 0 opacity so we can "fade-in"
          opacity: shadowState() === "fade-in" ? 0 : 100,
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
