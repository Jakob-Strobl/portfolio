import { rm } from "node:fs/promises";
import { resolve } from "node:path";

// Nitro's Pages preset used to leave this ignored redirect behind. Remove only
// that generated file so Wrangler uses the checked-in Worker configuration.
await rm(resolve(process.cwd(), ".wrangler/deploy/config.json"), { force: true });
