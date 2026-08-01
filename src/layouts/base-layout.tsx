import { RouteSectionProps } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";
import { Suspense } from "solid-js";

import { BackgroundProvider } from "~/providers/background";
import { PostHogProvider } from "~/providers/posthog";

import IsomorphicBackground from "../components/background";
import Umbra from "../components/shadow/umbra";
import TimelineGradient from "../components/timeline-gradient";

export default function BaseLayout(props: RouteSectionProps) {
  return (
    <MetaProvider>
      <Title>Jakob Strobl | Full-stack developer &amp; indie builder</Title>
      <PostHogProvider>
        <BackgroundProvider>
          <IsomorphicBackground></IsomorphicBackground>
          <TimelineGradient></TimelineGradient>
          <main class="min-w-0 w-full flex flex-row h-screen max-w-dvw items-center justify-center">
            <Umbra></Umbra>
            <Suspense>{props.children}</Suspense>
          </main>
        </BackgroundProvider>
      </PostHogProvider>
    </MetaProvider>
  );
}
