import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

import { BackgroundProvider } from "~/providers/background";
import { PostHogProvider } from "~/providers/posthog";

import IsomorphicBackground from "../components/background";
import Umbra from "../components/shadow/umbra";

export default function BaseLayout(props: RouteSectionProps) {
  return (
    <PostHogProvider>
      <BackgroundProvider>
        <IsomorphicBackground></IsomorphicBackground>
        <main class="flex flex-row h-screen max-w-dvw items-center justify-center">
          <Umbra></Umbra>
          <Suspense>{props.children}</Suspense>
        </main>
      </BackgroundProvider>
    </PostHogProvider>
  );
}
