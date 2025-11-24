import { EnvLoader } from "./env-loader";

const SECRETS_PATH = process.env.SECRETS_PATH ?? undefined;
const CONFIG_PATH = process.env.CONFIG_PATH ?? undefined;

new EnvLoader(SECRETS_PATH, CONFIG_PATH);

const ENVIRONMENT = process.env.NODE_ENV ?? process.env.DENO_ENV;

/**
 * Checks if the application is running in development mode.
 *
 * @returns {boolean} True if NODE_ENV or DENO_ENV is set to "development"
 *
 * @example
 * import { isDevMode } from '@norskhelsenett/zeniki';
 *
 * if (isDevMode()) {
 *   logger.debug('Running in development mode');
 *   // Enable additional debugging features
 * }
 */
export const isDevMode = (): boolean => {
  return ENVIRONMENT === "development";
};
