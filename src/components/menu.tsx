import { onMount, createSignal } from "solid-js";
import Shadow from "./shadow/shadow";

export default function Menu() {
  const [isReady, setReady] = createSignal(false);
  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  return (
    <Shadow>
      <nav>
        {/* Define text size on each element as granular as possible
         *  Controls resulting height of elements in flex col
         */}
        <ul class="flex flex-col gap-2 text-white/88">
          <li
            class="fade-in delay-75 mb-1"
            style={{
              // Set inline so the browser doesn't try to fade from 100% -> 0% opacity
              // and then fade back to 100% once ready flag is flipped
              // This is why the fade looked like it wasn't working. It was starting with fade out.
              opacity: !isReady() ? "0" : "100",
            }}
          >
            <a
              href="/experience"
              class="hover:text-shadow-lg duration-300 text-3xl transition-text"
            >
              Experience
            </a>
          </li>
          <li
            class="fade-in delay-150 mb-2"
            style={{ opacity: !isReady() ? "0" : "100" }}
          >
            <a
              href="/contact"
              class="hover:text-shadow-lg duration-300 text-3xl transition-text"
            >
              Contact
            </a>
          </li>
          <hr
            class="fade-in delay-300 border-night-100/90 mb-1"
            style={{ opacity: !isReady() ? "0" : "100" }}
          ></hr>
          <li
            class="fade-in delay-400"
            style={{ opacity: !isReady() ? "0" : "100" }}
          >
            <a
              href="/gallery"
              class="hover:text-shadow-lg duration-300 transition-text text-xl"
            >
              Photography
            </a>
          </li>
          <li
            class="fade-in delay-500"
            style={{ opacity: !isReady() ? "0" : "100" }}
          >
            <a
              href="/gallery"
              class="hover:text-shadow-lg duration-300 transition-text text-xl"
            >
              TBD
            </a>
          </li>
        </ul>
      </nav>
    </Shadow>
  );
}
