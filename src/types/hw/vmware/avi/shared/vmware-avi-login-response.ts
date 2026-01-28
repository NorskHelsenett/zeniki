import { VMwareAVILoginResponseVersion } from "./vmware-avi-login-response-version";

/**
 * Response structure from VMware AVI controller login endpoint.
 * Contains session details, user info, and controller configuration.
 * @interface
 * @example
 * ```typescript
 * const response: VMwareAVILoginResponse = {
 *   controller: {},
 *   session_cookie_name: 'avi-sessionid',
 *   system_config: {},
 *   tenants: [{ name: 'admin' }],
 *   user: { username: 'admin' },
 *   user_initialized: true,
 *   version: { Version: '20.1.1', Product: 'controller' }
 * };
 * ```
 */
export interface VMwareAVILoginResponse {
  /** Controller configuration object */
  controller: object;
  /** Name of the session cookie */
  session_cookie_name: string;
  /** System configuration object */
  system_config: object;
  /** List of accessible tenants */
  tenants: object[];
  /** User information object */
  user?: object;
  /** Whether user initialization is complete */
  user_initialized: boolean;
  /** Controller version information */
  version?: VMwareAVILoginResponseVersion;
}
