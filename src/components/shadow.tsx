import { children, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";

interface ShadowProps {
  children: JSX.Element | JSX.ArrayElement;
}

export default function Shadow(props: ShadowProps) {
  const resolved = children(() => props.children);
  const [isReady, setReady] = createSignal(false);
  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  debugger;
  return (
    <div
      class="
        text-3xl text-white bg-night-black rounded-lg w-full py-5 pl-2 
        fade-in-bg
      "
      style={{
        // Set inline so the browser doesn't try to fade from 100% -> 0% opacity
        // and then fade back to 100% once ready flag is flipped
        // This is why the fade looked like it wasn't working. It was starting with fade out.
        "--tw-bg-opacity": !isReady() ? 0 : 0.5,
      }}
    >
      {resolved()}
    </div>
  );
}
