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
        <ul class="flex flex-col gap-2 text-3xl text-white/88">
          <li
            class="fade-in delay-75 mb-2"
            style={{
              // Set inline so the browser doesn't try to fade from 100% -> 0% opacity
              // and then fade back to 100% once ready flag is flipped
              // This is why the fade looked like it wasn't working. It was starting with fade out.
              opacity: !isReady() ? "0" : "100",
            }}
          >
            <a
              href="/experience"
              class="hover:text-shadow-lg duration-300 transition-text"
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
              class="hover:text-shadow-lg duration-300 transition-text"
            >
              Contact
            </a>
          </li>
          <hr
            class="fade-in delay-300 border-night-100/90 mb-1"
            style={{ opacity: !isReady() ? "0" : "100" }}
          ></hr>
          {/* Using flex on these to auto change the box height to fit */}
          {/* Avoids parent flex forcing matching larger height since the text is larger for the first two*/}
          <li
            class="fade-in delay-400 flex"
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
            class="fade-in delay-500 flex"
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
