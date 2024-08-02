import { onMount, createSignal } from "solid-js";

export default function Menu() {
  const [isReady, setReady] = createSignal(false);
  onMount(() => {
    setTimeout(() => setReady(true), 1);
  });

  return (
    <nav class="text-3xl text-white bg-night-black rounded-lg w-full py-5 pl-2 bg-opacity-50">
      <ul class="flex flex-col gap-6 opacity-88">
        <li class="fade-in delay-150" classList={{ "opacity-0": !isReady() }}>
          <a
            href="/experience"
            class="hover:text-stroke-lg duration-300 transition-text"
          >
            Experience
          </a>
        </li>
        <li class="fade-in delay-300" classList={{ "opacity-0": !isReady() }}>
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
