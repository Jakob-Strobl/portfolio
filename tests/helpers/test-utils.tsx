/** Yield one macrotask so Solid effects can settle after render. */
export async function waitForShadowAnimations(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
