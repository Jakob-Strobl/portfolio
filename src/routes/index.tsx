import Shadow from "../components/shadow/shadow";
import Menu from "../components/menu";
import { onMount, createSignal, createEffect } from "solid-js";
import { useForceRecalculateShadowClientRects } from "~/components/shadow/hook";

export default function Home() {
  const [isReady, setReady] = createSignal(false);
  const [showShadow, setShowShadow] = createSignal(false);
  useForceRecalculateShadowClientRects(showShadow);

  onMount(() => {
    setTimeout(() => setReady(true), 0);
  });

  createEffect(() => {
    showShadow();
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
          <p class="text-gray-300">
            <span class="text-xs">v</span>
            {process.env.PROJECT_VERSION}
          </p>
        </div>
        <div class="w-fit">
          <Shadow>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => {
                setShowShadow(!showShadow());
              }}
            >
              Toggle Third Shadow
            </button>
          </Shadow>
        </div>
        {showShadow() && (
          <div class="w-128">
            <Shadow>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum
            </Shadow>
          </div>
        )}
      </div>
    </>
  );
}
