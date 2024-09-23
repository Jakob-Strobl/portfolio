import {
  children,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
} from "solid-js";
import type { JSX } from "solid-js";
import { addShadow, removeShadow } from "./umbra";

interface ShadowProps {
  children: JSX.Element | JSX.ArrayElement;
}

export default function Shadow(props: ShadowProps) {
  const resolved = children(() => props.children);
  const [isReady, setReady] = createSignal(false);
  const shadowId = createUniqueId();

  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  onCleanup(() => {
    removeShadow(shadowId);
  });

  return (
    <div
      class="
      bg-night-black rounded-lg w-full p-5
        fade-in-bg
        text-white
      "
      style={{
        // Set inline so the browser doesn't try to fade from 100% -> 0% opacity
        // and then fade back to 100% once ready flag is flipped
        // This is why the fade looked like it wasn't working. It was starting with fade out.
        "--tw-bg-opacity": !isReady() ? 0 : 0.5,
      }}
      ref={(el) => addShadow(el)}
      data-shadow={shadowId}
    >
      {resolved()}
    </div>
  );
}
