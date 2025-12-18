import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import IsomorphicBackground from "../components/background";
import Umbra from "../components/shadow/umbra";
import { PostHogProvider } from "~/providers/posthog";

export default function BaseLayout(props: RouteSectionProps) {
  return (
    <PostHogProvider>
      <IsomorphicBackground></IsomorphicBackground>
      <main class="flex flex-row h-screen max-w-dvw items-center justify-center">
        <Umbra></Umbra>
        <Suspense>{props.children}</Suspense>
      </main>
    </PostHogProvider>
  );
}
