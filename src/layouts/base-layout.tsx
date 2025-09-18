import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import IsomorphicBackground from "~/components/background";
import Umbra from "~/components/shadow/umbra";

export default function BaseLayout(props: RouteSectionProps) {
  return (
    <>
      <IsomorphicBackground></IsomorphicBackground>
      <main class="flex flex-row h-screen w-screen items-center justify-center">
        <Umbra></Umbra>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
}
