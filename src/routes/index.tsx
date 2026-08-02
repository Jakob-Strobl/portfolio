import ExternalLink from "lucide-solid/icons/external-link";
import X from "lucide-solid/icons/x";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";

import { BackgroundSettingsPanel, BackgroundSettingsTrigger } from "~/components/background-settings";
import Seo from "~/components/seo";

import Menu from "../components/menu";

export default function Home() {
  const SETTINGS_HINT_DURATION_MS = 7_000;
  const SETTINGS_HINT_FADE_MS = 300;
  const [isReady, setReady] = createSignal(false);
  const [isSettingsOpen, setSettingsOpen] = createSignal(false);
  const [isSettingsHintMounted, setSettingsHintMounted] = createSignal(false);
  const [isSettingsHintVisible, setSettingsHintVisible] = createSignal(false);
  const [settingsHintPlacement, setSettingsHintPlacement] = createSignal<"below" | "above">("below");
  const settingsPanelId = "home-background-settings";
  const settingsHintId = "home-background-settings-hint";
  const settingsHintStorageKey = "portfolio.background-settings-hint-seen";
  let settingsTriggerEl: HTMLButtonElement | undefined;
  let settingsHintEl: HTMLDivElement | undefined;
  let settingsHintAutoHideTimer: number | undefined;
  let settingsHintUnmountTimer: number | undefined;

  function closeSettings() {
    setSettingsOpen(false);
    queueMicrotask(() => settingsTriggerEl?.focus());
  }

  function markSettingsHintSeen() {
    try {
      window.sessionStorage.setItem(settingsHintStorageKey, "true");
    } catch (error) {
      console.error("Home: Could not save the background settings hint state for this session", error);
    }
  }

  function clearSettingsHintTimers() {
    if (settingsHintAutoHideTimer !== undefined) {
      window.clearTimeout(settingsHintAutoHideTimer);
      settingsHintAutoHideTimer = undefined;
    }

    if (settingsHintUnmountTimer !== undefined) {
      window.clearTimeout(settingsHintUnmountTimer);
      settingsHintUnmountTimer = undefined;
    }
  }

  function hideSettingsHint() {
    if (!isSettingsHintMounted()) return;

    setSettingsHintVisible(false);
    settingsHintUnmountTimer = window.setTimeout(() => {
      setSettingsHintMounted(false);
      settingsHintUnmountTimer = undefined;
    }, SETTINGS_HINT_FADE_MS);
  }

  function revealSettingsHint() {
    clearSettingsHintTimers();
    setSettingsHintMounted(true);
    queueMicrotask(() => setSettingsHintVisible(true));
    settingsHintAutoHideTimer = window.setTimeout(hideSettingsHint, SETTINGS_HINT_DURATION_MS);
  }

  function dismissSettingsHint() {
    hideSettingsHint();
    markSettingsHintSeen();
  }

  function handleSettingsOpenChange(isOpen: boolean) {
    if (isOpen) dismissSettingsHint();
    setSettingsOpen(isOpen);
  }

  function updateSettingsHintPlacement() {
    if (settingsTriggerEl == null || settingsHintEl == null) return;

    const triggerRect = settingsTriggerEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const requiredSpaceBelow = settingsHintEl.offsetHeight + 12;
    setSettingsHintPlacement(spaceBelow >= requiredSpaceBelow ? "below" : "above");
  }

  createEffect(() => {
    if (!isSettingsHintMounted()) return;

    queueMicrotask(updateSettingsHintPlacement);
    window.addEventListener("resize", updateSettingsHintPlacement, { passive: true });
    onCleanup(() => window.removeEventListener("resize", updateSettingsHintPlacement));
  });

  onMount(() => {
    setTimeout(() => setReady(true), 0);

    try {
      if (window.sessionStorage.getItem(settingsHintStorageKey) === "true") return;
    } catch (error) {
      console.error("Home: Could not read the background settings hint state for this session", error);
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      revealSettingsHint();
      markSettingsHintSeen();
      window.removeEventListener("pointermove", handlePointerMove);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    onCleanup(() => {
      window.removeEventListener("pointermove", handlePointerMove);
      clearSettingsHintTimers();
    });
  });

  return (
    <>
      <Seo
        title="Jakob Strobl | Full-stack Developer & Indie Builder"
        description="Building privacy-first web products in TypeScript, Rust, and Cloudflare—fluent across modern frontend frameworks, with roots in compilers, game dev, and systems programming."
        path="/"
        pageType="ProfilePage"
      />
      <div class="xs:w-1/5"></div>
      <div class="xs:w-4/5">
        <div
          class="w-80 max-w-[90vw] flex flex-col items-center gap-1.5 fade-in"
          style={{
            opacity: !isReady() ? "0" : "100",
          }}
        >
          <h1 class="font-medium text-white text-5xl">Jakob Strobl</h1>
          <p class="text-center text-base text-gray-300">Full-stack developer &amp; indie builder</p>
          <div class="w-full">
            <Show when={isSettingsOpen()} fallback={<Menu />}>
              <BackgroundSettingsPanel id={settingsPanelId} onClose={closeSettings} />
            </Show>
          </div>
          <div class="flex items-center gap-2 text-gray-300">
            <p class="group flex h-8 items-baseline rounded-md py-1 pr-1 pl-1.5 transition-colors duration-200 hover:bg-white/10 focus-within:bg-white/10">
              <span class="text-xs">v</span>
              <a
                class="inline-flex items-center transition-colors duration-200 group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
                target="_blank"
                rel="noopener"
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
            <div class="relative flex items-center">
              <BackgroundSettingsTrigger
                isOpen={isSettingsOpen()}
                panelId={settingsPanelId}
                onOpenChange={handleSettingsOpenChange}
                triggerRef={(element) => (settingsTriggerEl = element)}
                describedBy={isSettingsHintVisible() ? settingsHintId : undefined}
              />
              <Show when={isSettingsHintMounted()}>
                <div
                  ref={(element) => (settingsHintEl = element)}
                  id={settingsHintId}
                  role="note"
                  class={`absolute right-0 z-20 w-64 rounded-lg border border-white/15 bg-night-900/95 p-3 text-left text-xs leading-relaxed text-gray-200 shadow-2xl shadow-black/50 backdrop-blur-xl transition-opacity duration-300 ease-out ${settingsHintPlacement() === "below" ? "top-full mt-3" : "bottom-full mb-3"} ${isSettingsHintVisible() ? "opacity-100" : "pointer-events-none opacity-0"}`}
                >
                  <div class="flex items-start gap-2">
                    <p>
                      <span class="font-medium text-white">Make the ambience yours.</span> Open Settings to switch
                      visual styles and fine-tune performance.
                    </p>
                    <button
                      type="button"
                      class="-mt-1 -mr-1 shrink-0 rounded p-1 text-gray-300/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
                      aria-label="Dismiss background settings tip"
                      onClick={dismissSettingsHint}
                    >
                      <X aria-hidden="true" size={14} />
                    </button>
                  </div>
                  <span
                    aria-hidden="true"
                    class={`absolute right-1.5 h-3 w-3 rotate-45 border-white/15 bg-night-900/95 ${settingsHintPlacement() === "below" ? "-top-1.5 border-t border-l" : "-bottom-1.5 border-r border-b"}`}
                  ></span>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
