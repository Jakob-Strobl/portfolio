export const isTest = (): boolean =>
  import.meta.env.NODE_ENV === "test" || import.meta.env.VITEST !== undefined;
