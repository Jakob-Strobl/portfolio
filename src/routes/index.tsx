import ExternalLink from "lucide-solid/icons/external-link";
import { createSignal, onMount, Show } from "solid-js";

import { BackgroundSettingsPanel, BackgroundSettingsTrigger } from "~/components/background-settings";

import Menu from "../components/menu";

export default function Home() {
  const [isReady, setReady] = createSignal(false);
  const [isSettingsOpen, setSettingsOpen] = createSignal(false);
  const settingsPanelId = "home-background-settings";
  let settingsTriggerEl: HTMLButtonElement | undefined;

  function closeSettings() {
    setSettingsOpen(false);
    queueMicrotask(() => settingsTriggerEl?.focus());
  }

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
          <div class="w-full">
            <Show when={isSettingsOpen()} fallback={<Menu />}>
              <BackgroundSettingsPanel id={settingsPanelId} onClose={closeSettings} />
            </Show>
          </div>
          <div class="flex items-center gap-2 text-gray-300">
            <p class="group flex items-baseline rounded-md py-0.5 pr-1 pl-1.5 transition-colors duration-200 hover:bg-white/10 focus-within:bg-white/10">
              <span class="text-xs">v</span>
              <a
                class="inline-flex items-center transition-colors duration-200 group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
                target="_blank"
                href="https://github.com/Jakob-Strobl/portfolio/releases"
              >
                <span>{process.env.PROJECT_VERSION}</span>
                <span class="inline-flex w-4 justify-end">
                  <ExternalLink
                    aria-hidden="true"
                    class="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                    size={12}
                  />
                </span>
              </a>
            </p>
            <BackgroundSettingsTrigger
              isOpen={isSettingsOpen()}
              panelId={settingsPanelId}
              onOpenChange={setSettingsOpen}
              triggerRef={(element) => (settingsTriggerEl = element)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
