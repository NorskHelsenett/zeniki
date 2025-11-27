import { EnvLoader } from "./env-loader";

const SECRETS_PATH = process.env.SECRETS_PATH ?? undefined;
const CONFIG_PATH = process.env.CONFIG_PATH ?? undefined;

new EnvLoader(SECRETS_PATH, CONFIG_PATH);

const ENVIRONMENT = process.env.NODE_ENV ?? process.env.DENO_ENV;

/**
 * Checks if the application is running in development mode.
 * @returns True if NODE_ENV or DENO_ENV is "development"
 * @example
 * ```typescript
 * if (isDevMode()) logger.debug('Dev mode');
 * ```
 */
export const isDevMode = (): boolean => {
  return ENVIRONMENT === "development";
};
