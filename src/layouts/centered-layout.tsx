import { LinearLayoutProps } from "./linear-layout";
import Shadow from "../components/shadow/shadow";
import { children, JSX } from "solid-js";

export interface CenteredLayoutProps {
  children: JSX.Element | JSX.ArrayElement;
  navBack?: () => JSX.Element;
}
export default function CenteredLayout(props: CenteredLayoutProps) {
  const resolved = children(() => props.children);
  return (
    <div class={`flex flex-row h-screen items-center justify-center m-4`}>
      {/* CENTER Content */}
      <div class="flex flex-row gap-2 place-content-center relative w-full">
        <div class="w-fit">
          <Shadow warmupDelayMs={0} contentFadeInDelayMs={500}>
            <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
              {props.navBack?.()}
            </div>
          </Shadow>
        </div>
        {resolved()}
      </div>
    </div>
  );
}
