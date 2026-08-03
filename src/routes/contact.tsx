import { createSignal } from "solid-js";
import { copyToClipboard } from "../actions/clipboard-actions";
import NotifyBubble from "../components/notify-bubble";
import Shadow from "../components/shadow/shadow";
import { A } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import CenteredLayout from "../layouts/centered-layout";
import Seo from "~/components/seo";

export default function Contact() {
  const handle = "hey";
  const [showClipboardBubble, setBubbleVisible] = createSignal<MouseEvent>();

  const clickEmailHandler = async (ev: MouseEvent) => {
    const successful = await copyToClipboard(`${handle + "@"}jstrobl.dev`);
    if (successful) {
      setBubbleVisible(ev);
      setTimeout(() => setBubbleVisible(undefined), 2400);
    }
  };

  return (
    <>
      <Seo
        title="Contact Jakob Strobl | Full-stack Developer & Indie Builder"
        description="Connect with Jakob Strobl, a full-stack developer and indie builder, via GitHub, LinkedIn, or email."
        path="/contact"
      />
      <CenteredLayout
        navBack={() => (
          <A href="/">
            <ArrowBigLeft size={20} class="hover:stroke-night-300 transition-colors duration-300" />
            <span class="hidden sm:inline">Home</span>
          </A>
        )}
      >
        <Shadow warmupDelayMs={0} contentFadeInDelayMs={400}>
          <div class="flex w-full flex-col">
            <div>
              <h1 class="text-3xl">Let's connect</h1>
            </div>
            <p class="mt-4 w-full max-w-[calc(116px_+_153.17px_+_2rem)] text-md text-white/80 sm:max-w-[calc(171.5px_+_226.45px_+_3rem)] xl:max-w-[calc(257px_+_339.35px_+_4rem)]">
              <span class="block">
                Building <span class="font-medium text-night-300">privacy-first</span> web products with TypeScript,
                Rust, and Cloudflare—while pushing back against the dark patterns of the web.
              </span>
              <span class="mt-2 block">
                Fluent across high- and low-level programming languages, modern frameworks, and developer tools, with
                roots in systems programming, game development, and compilers.
              </span>
            </p>
            <div class="mt-6 flex gap-8 sm:gap-12 xl:gap-16">
              <div id="github">
                <a
                  class="group flex flex-col items-center gap-8"
                  href="https://github.com/Jakob-Strobl"
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  <img class="github-normalized-size" src="./images/Github-octocat.png" alt="GitHub Octocat" />
                  <p class="group-hover:text-shadow-lg duration-300 transition-text">GitHub</p>
                </a>
              </div>
              <div id="linkedin">
                <a
                  class="group flex flex-col items-center gap-8"
                  href="https://www.linkedin.com/in/jakob-strobl"
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  <img class="linkedin-normalized-size select-none" src="./images/LinkedIn.png" alt="LinkedIn" />
                  <p class="group-hover:text-shadow-lg duration-300 transition-text">LinkedIn</p>
                </a>
              </div>
            </div>
            <p class="mt-6 w-full max-w-[calc(116px_+_153.17px_+_2rem)] text-md text-white/80 sm:max-w-[calc(171.5px_+_226.45px_+_3rem)] xl:max-w-[calc(257px_+_339.35px_+_4rem)]">
              Looking for a versatile, product-minded developer with a sharp eye for UI/UX who designs and builds
              polished, intuitive interfaces? <span class="font-medium text-night-300">Let's talk.</span>
            </p>
            <p class="mt-8 text-xl">
              Contact me directly:
              <span class="flex sm:mt-0 sm:inline sm:justify-center">
                <a
                  class="
                    sm:ml-4 inline-block
                    text-night-300 text-center whitespace-nowrap break-normal
                    cursor-pointer select-none
                    border-b-2 border-gray-300/60 hover:border-night-300/90
                    transition-colors duration-300 ease-in-out
                  "
                  href={`mailto:${handle}@jstrobl.dev`}
                  onclick={clickEmailHandler}
                  title="Email Jakob Strobl"
                  aria-label="Email Jakob Strobl"
                >
                  {handle}
                  <span class="text-white p-2"> at </span>jstrobl.dev
                  {showClipboardBubble() != undefined && (
                    <NotifyBubble offset={{ x: 0, y: -8 }} originEvent={showClipboardBubble()}>
                      <p>Copied to clipboard!</p>
                    </NotifyBubble>
                  )}
                </a>
              </span>
            </p>
          </div>
        </Shadow>
      </CenteredLayout>
    </>
  );
}
