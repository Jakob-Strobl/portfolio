import { onMount, createSignal, createEffect } from "solid-js";

export default function Menu() {
  const [isReady, setReady] = createSignal(false);
  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  return (
    <nav class="text-3xl text-white bg-night-black rounded-lg w-full py-5 pl-2 bg-opacity-50">
      <ul class="flex flex-col gap-6 opacity-88">
        <li
          class="fade-in delay-75"
          style={{
            // Set inline so the browser doesn't try to fade from 100% -> 0% opacity
            // and then fade back to 100% once ready flag is flipped
            // This is why the fade looked like it wasn't working. It was starting with fade out.
            opacity: !isReady() ? "0" : "100",
          }}
        >
          <a
            href="/experience"
            class="hover:text-stroke-lg duration-300 transition-text"
          >
            Experience
          </a>
        </li>
        <li
          class="fade-in delay-150"
          style={{
            opacity: !isReady() ? "0" : "100",
          }}
        >
          <a
            href="/contact"
            class="hover:text-stroke-lg duration-300 transition-text"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}
