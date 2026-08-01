import { useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export function isTimelineRoute(pathname: string) {
  return pathname === "/experience" || pathname === "/gallery";
}

export default function TimelineGradient() {
  const location = useLocation();
  const [isReady, setReady] = createSignal(false);

  onMount(() => setReady(true));

  return (
    <div
      aria-hidden="true"
      // Keep the layer mounted across route changes so its exit transition can finish.
      class="pointer-events-none fixed top-0 left-0 z-10 w-[300vw] bg-linear-to-b from-[#130d20] from-20% to-transparent transition-opacity duration-1000 ease-out lg:h-40 md:h-32 sm:h-24 h-16"
      style={{ opacity: isReady() && isTimelineRoute(location.pathname) ? 1 : 0 }}
    ></div>
  );
}
