import Menu from "../components/menu";
import { onMount, createSignal } from "solid-js";
import ExternalLink from "lucide-solid/icons/external-link";

export default function Home() {
  const [isReady, setReady] = createSignal(false);

  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  return (
    <>
      <div class="xs:w-1/5"></div>
      <div class="xs:w-4/5">
        <div
          class="w-72 flex flex-col items-center gap-1.5 fade-in"
          style={{
            opacity: !isReady() ? "0" : "100",
          }}
        >
          <h1 class="font-medium text-white text-5xl">Jakob Strobl</h1>
          <Menu></Menu>
          <p class="text-gray-300 group flex items-baseline">
            <span class="text-xs">v</span>
            <a class="relative" target="_blank" href="https://github.com/Jakob-Strobl/portfolio/releases">
              {process.env.PROJECT_VERSION}{" "}
              <ExternalLink
                class="absolute top-1/4 left-full ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                size={12}
              ></ExternalLink>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
