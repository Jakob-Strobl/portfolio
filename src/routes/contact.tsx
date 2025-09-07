import { createSignal } from "solid-js";
import { copyToClipboard } from "../actions/clipboard-actions";
import NotifyBubble from "../components/notify-bubble";
import Shadow from "../components/shadow/shadow";

export default function Contact() {
  const handle = "hey";
  const [showClipboardBubble, setBubbleVisible] = createSignal<MouseEvent>();

  const clickEmailHandler = async (ev: MouseEvent) => {
    const successful = await copyToClipboard(`${handle + "@"}jstrobl.com`);
    if (successful) {
      setBubbleVisible(ev);
      setTimeout(() => setBubbleVisible(undefined), 2400);
    }
  };

  return (
    <div class="m-4">
      <Shadow>
        {/* padding's screem size breakpoints should match the image width's breakpoints */}
        <div class="flex flex-col p-6 sm:p-8 xl:p-12">
          <div>
            <p class="text-3xl">Connect with me:</p>
          </div>
          <div class="flex gap-8 p-8 sm:gap-12 sm:p-12 xl:gap-16 xl:p-16">
            <div id="github">
              <a
                class="group flex flex-col items-center gap-8"
                href="https://github.com/Jakob-Strobl"
                target="_blank"
              >
                <img
                  class="github-normalized-size"
                  src="./images/Github-octocat.png"
                />
                <p class="group-hover:text-shadow-lg duration-300 transition-text">
                  GitHub
                </p>
              </a>
            </div>
            <div id="linkedin">
              <a
                class="group flex flex-col items-center gap-8"
                href="https://www.linkedin.com/in/jakob-strobl"
                target="_blank"
              >
                <img
                  class="linkedin-normalized-size select-none"
                  src="./images/LinkedIn.png"
                />
                <p class="group-hover:text-shadow-lg duration-300 transition-text">
                  LinkedIn
                </p>
              </a>
            </div>
          </div>
          <p class="text-xl">
            Contact me directly:
            <span class="flex mt-4 sm:mt-0 sm:inline justify-center">
              <span
                class="
                  sm:ml-4 inline-block                   
                  text-night-300 text-center whitespace-nowrap break-normal
                  cursor-pointer select-none
                  border-b-2 border-gray-300/60 hover:border-night-300/90
                  transition-colors duration-300 ease-in-out
                "
                onclick={clickEmailHandler}
                title="Click to copy email to clipboard"
                aria-label="Click to copy email to clipboard"
              >
                {handle}
                <span class="text-white p-2"> at </span>jstrobl.com
                {showClipboardBubble() != undefined && (
                  <NotifyBubble
                    offset={{ x: 0, y: -8 }}
                    originEvent={showClipboardBubble()}
                  >
                    <p>Copied to clipboard!</p>
                  </NotifyBubble>
                )}
              </span>
            </span>
          </p>
        </div>
        <a
          href="/"
          class="inline-block mt-4 hover:text-shadow-lg duration-300 transition-text "
        >
          back
        </a>
      </Shadow>
    </div>
  );
}
