import { LinearLayoutProps } from "./linear-layout";
import Shadow from "../components/shadow/shadow";
export default function CenteredLayout(props: LinearLayoutProps) {
  return (
    <div class={`flex flex-row h-screen items-center justify-center`}>
      {/* CENTER Content */}
      <div class="flex flex-row gap-2 mb-4 place-content-center relative">
        <div class="absolute w-fit right-[100%] mr-2">
          <Shadow warmupDelayMs={0} contentFadeInDelayMs={500} fixed>
            <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
              {props.navBack?.()}
            </div>
          </Shadow>
        </div>
        {props.content}
      </div>
    </div>
  );
}
