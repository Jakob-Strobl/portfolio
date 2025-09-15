import {
  children,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
} from "solid-js";
import type { JSX } from "solid-js";
import { addShadow, removeShadow } from "./umbra";
import { ShadowOriginOptions } from "./types";

interface ShadowProps {
  children: JSX.Element | JSX.ArrayElement;

  /**
   * Changes the behavior of where to set the starting position of the element on mount
   * @default 'relative'
   */
  origin?: ShadowOriginOptions;

  /**
   * Delay on the shadow's intial warmup transition - i.e., delays the isCold signal flip to warm
   * @default undefined := Do not transition the content's text opacity
   * @example Set to 0 or greater if you want the content to fade-in
   **/
  warmupDelayMs?: number;

  /**
   * Set the delay for fading in the content
   *
   * @warn fade-in only occurs if warmupDelayMs is not undefined and >= 0
   */
  contentFadeInDelayMs?: number;

  // TODO [ ]: Add optional title that goes above the shadow?
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
  const [showContent, setShowContent] = createSignal(
    props.warmupDelayMs === undefined,
  );
  let shadowEl: HTMLDivElement;

  onMount(() => {
    // setTimeout(() => setReady(true), 0);
    // use onMount or createEffect to read after connected to DOM
    addShadow(shadowEl, props.origin, props.warmupDelayMs, setShowContent);
  });

  onCleanup(() => {
    removeShadow(shadowId);
  });

  return (
    <div
      // "ease-out-quad" = cubic-bezier(0.5, 1, 0.89, 1)
      class="rounded-lg w-full p-5 text-white transition-opacity duration-1000 ease-[cubic-bezier(0.5, 1, 0.89, 1)]"
      style={{
        opacity: showContent() ? 100 : 0,
        "transition-delay": `${props.contentFadeInDelayMs ?? 250}ms`,
      }}
      ref={(el) => (shadowEl = el)}
      data-shadow={shadowId}
    >
      {resolved()}
    </div>
  );
}
