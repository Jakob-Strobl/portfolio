export const isTest = (): boolean =>
  process.env.NODE_ENV === "test" || process.env.VITEST !== undefined;
