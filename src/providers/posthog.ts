import { useLocation } from "@solidjs/router";
import { createEffect, onMount } from "solid-js";
import posthog from "posthog-js";

export function PostHogProvider(props: { children: any }) {
  const location = useLocation();

  onMount(() => {
    if (typeof window !== "undefined" && import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
      posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // Disable auto-capture; we handle it manually
        capture_pageleave: true,
      });
    }
  });

  // Track Page Views
  createEffect(() => {
    if (typeof window !== "undefined") {
      // Accessing location.pathname registers this effect to run on route change
      const url = window.location.origin + location.pathname;
      posthog.capture("$pageview", { $current_url: url });
    }
  });

  return props.children;
}
