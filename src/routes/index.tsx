import Menu from "../components/menu";
import { onMount, createSignal } from "solid-js";

export default function Home() {
  const [isReady, setReady] = createSignal(false);
  onMount(() => {
    setTimeout(() => setReady(true), 1);
  });

  return (
    <>
      <div class="w-1/5"></div>
      <div class="w-4/5">
        <div
          class="w-72 flex flex-col items-center gap-1.5 fade-in"
          classList={{
            "opacity-0": !isReady(),
          }}
        >
          <h1 class="font-medium text-white text-5xl">Jakob Strobl</h1>
          <Menu></Menu>
          <p class="text-gray-300">
            <span class="text-xs">v</span>
            {process.env.PROJECT_VERSION}
          </p>
        </div>
      </div>
    </>
  );
}
