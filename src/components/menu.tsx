import { onMount, createSignal, createEffect } from "solid-js";
import Shadow from "./shadow";

export default function Menu() {
  const [isReady, setReady] = createSignal(false);
  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  return (
    <Shadow>
      <nav>
        <ul class="flex flex-col gap-6 opacity-88 text-3xl text-white">
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
    </Shadow>
  );
}
