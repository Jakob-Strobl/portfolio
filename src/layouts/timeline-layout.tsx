import { LinearLayoutProps } from "./linear-layout";
import Shadow from "../components/shadow/shadow";

export type TimelineLayout = LinearLayoutProps & {
  contentGap?: string;
};

// TODO give this and linear a simimlar base layout if pattern sticks
export default function TimelineLayout(props: TimelineLayout) {
  const contentGap = props.contentGap ?? "gap-8";
  // Keep the top content margin in sync with the shared timeline gradient height.
  const topMargin = "lg:mt-80 md:mt-64 sm:mt-48 mt-32";

  return (
    <div class="min-w-0 w-full flex flex-row h-screen items-center xs:justify-center justify-start">
      {/* LEFT Gutter */}
      <div class={`md:w-1/5 w-2/12 h-full flex flex-col items-end justify-start px-2  ${topMargin}`}>
        <div class="fixed md:max-w-3/4 max-w-1/2 w-fit">
          <Shadow warmupDelayMs={0} contentFadeInDelayMs={500} fixed>
            <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
              {props.navBack?.()}
            </div>
          </Shadow>
        </div>
      </div>
      {/* CENTER Content */}
      <div class={`min-w-0 w-10/12 md:w-3/5 max-w-4xl h-full ${topMargin}`}>
        <div class={`min-w-0 w-full flex flex-col ${contentGap} mb-4`}>
          {props.content}
          <div class="max-h-[48vh] min-h-[16vh] h-dvh"></div>
        </div>
      </div>
      {/* RIGHT Gutter */}
      <div class={`w-2 xs:w-4 md:w-1/5 h-full ${topMargin}`}>{props.focus}</div>
    </div>
  );
}
