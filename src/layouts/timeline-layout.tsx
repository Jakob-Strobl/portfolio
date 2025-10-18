import { createEffect, createSignal, onMount } from "solid-js";
import { LinearLayoutProps } from "./linear-layout";
import Shadow from "../components/shadow/shadow";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { DataAttributeKey } from "../types/dom";

export type TimelineLayout = LinearLayoutProps & {
  defaultTitle?: string;
};

export const timelineTitleDatasetKey: DataAttributeKey = "data-timeline-title";

// TODO give this and linear a simimlar base layout if pattern sticks
export default function TimelineLayout(props: TimelineLayout) {
  const [title, setTitle] = createSignal(props.defaultTitle ?? "");
  const [isReady, setReady] = createSignal(false);
  const allIntersections = new Map<Element, IntersectionObserverEntry>();
  let contentContainerRef: HTMLDivElement | undefined;
  // These margins and height have relation - need to work together to look good
  // Gradient Height should at max be half the --spacing as the respective margin top rule
  const topMargin = "lg:mt-80 md:mt-64 sm:mt-48 mt-32";
  const gradientHeight = "lg:h-40 md:h-32 sm:h-24 h-16";

  // Holds the actual DOM elements we want to observe.
  // This will be populated once the contentContainerRef is available in the DOM. See createEffect below
  const [elementsToObserve, setElementsToObserve] = createSignal<HTMLElement[]>([]);
  createEffect(() => {
    if (contentContainerRef) {
      // ASSUME the constraint, we know Shadow renders a single div.
      const shadowElements = Array.from(contentContainerRef.children).filter(
        (el) => el instanceof HTMLElement && el.hasAttribute(timelineTitleDatasetKey),
      ) as HTMLElement[];
      setElementsToObserve(shadowElements);
    }
  });

  createIntersectionObserver(
    elementsToObserve,
    (entries) => {
      const intersecting = entries.filter((entry) => entry.isIntersecting);
      if (intersecting.length === 0) {
        return;
      }

      for (const entry of entries) {
        allIntersections.set(entry.target, entry);
      }

      let bestEntry: IntersectionObserverEntry | null = null;
      let highestRatio = -1;
      // TODO  [ ]: We can breakup ties with their current positions via the client rects
      //            and calculate distance to a special midpoint. It works good enough for now to skip that step
      for (const entry of allIntersections.values()) {
        if (entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio;
          bestEntry = entry;
        }
      }

      const year = bestEntry?.target.getAttribute(timelineTitleDatasetKey);
      if (year) {
        setTitle(year);
      }
    },
    { threshold: [0.1, 0.25, 0.5, 0.75, 1.0] }, // Adjust as needed to define "center of the screen"
  );

  onMount(() => {
    setTimeout(() => setReady(true), 0);
    // console.log("contentContainer", contentContainerRef);
  });

  return (
    <div class="flex flex-row h-screen items-center xs:justify-center justify-start">
      {/* Top Horizontal Margin - gradient fade out content at top (fades around same time as background)*/}
      <div
        // 300vw to cover portrait to landscape orientations on mobile
        class={`fixed top-0 left-0 w-[300vw] ${gradientHeight} z-10 duration-1000 bg-linear-to-b from-[#130d20] from-20% to-transparent`}
        style={{ opacity: isReady() ? 1 : 0 }}
      ></div>
      {/* LEFT Gutter */}
      <div class={`md:w-1/5 min-w-26 h-full flex flex-col items-end justify-start px-2  ${topMargin}`}>
        <div class="fixed md:max-w-3/4 max-w-1/2 w-fit">
          <Shadow warmupDelayMs={0} contentFadeInDelayMs={500} fixed>
            <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
              {props.navBack?.()}
            </div>
          </Shadow>
          <p
            class="text-white text-4xl/8 cursor-vertical-text w-[1ch] transition-opacity delay-1000 duration-1500 wrap-anywhere text-center mr-2 self-end float-right ease-[cubic-bezier(0.5, 1, 0.89, 1)]"
            style={{ opacity: isReady() ? 0.7 : 0 }}
          >
            {title()}
          </p>
        </div>
      </div>
      {/* CENTER Content */}
      <div class={`w-3/5 h-full ${topMargin}`}>
        <div ref={contentContainerRef} class="flex flex-col gap-8 mb-4 ">
          {props.content}
          <div class="max-h-[48vh] min-h-[16vh] h-dvh"></div>
        </div>
      </div>
      {/* RIGHT Gutter */}
      <div class={`md:w-1/5 w-0 h-full ${topMargin}`}>{props.focus}</div>
    </div>
  );
}
