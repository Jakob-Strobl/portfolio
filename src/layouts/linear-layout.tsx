import { JSX } from "solid-js";

export interface LinearLayoutProps {
  navBack?: () => JSX.Element;
  content: JSX.Element;
  focus?: JSX.Element;
}

export default function LinearLayout(props: LinearLayoutProps) {
  return (
    <>
      {/* LEFT Gutter */}
      <div class="w-1/5 h-full flex justify-end items-start px-2 mt-120">
        <div class="max-w-3/4 w-fit">{props.navBack?.()}</div>
      </div>
      {/* CENTER Content */}
      <div class="w-3/5 h-full mt-120">
        <div class="flex flex-col gap-8 mb-4">{props.content}</div>
      </div>
      {/* RIGHT Gutter */}
      <div class="w-1/5 h-full mt-120">{props.focus}</div>
    </>
  );
}
