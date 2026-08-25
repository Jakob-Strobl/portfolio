import { Storage } from "happy-dom";

if (typeof globalThis.window !== "undefined" && typeof globalThis.document !== "undefined") {
  Object.defineProperties(globalThis, {
    localStorage: {
      configurable: true,
      value: new Storage(),
    },
    sessionStorage: {
      configurable: true,
      value: new Storage(),
    },
  });
}
