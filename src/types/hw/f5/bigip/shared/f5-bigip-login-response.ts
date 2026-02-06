import { F5BigIPLoginToken } from "./f5-bigip-login-token";
import { F5BigIPLinkReference } from "./f5-bigip-link-reference";

/**
 * Login response from F5 BIG-IP authentication endpoint.
 * Contains user information and authentication token.
 * @interface
 * @example
 * ```typescript
 * const response: F5BigIPLoginResponse = {
 *   username: 'admin',
 *   loginProviderName: 'tmos',
 *   token: { token: 'abc123', ... },
 *   generation: 1,
 *   lastUpdateMicros: 1234567890
 * };
 * ```
 */
export interface F5BigIPLoginResponse {
  /** Authenticated username */
  username: string;
  /** Reference link to login endpoint */
  loginReference: F5BigIPLinkReference;
  /** Authentication provider name */
  loginProviderName: string;
  /** Authentication token details */
  token: F5BigIPLoginToken;
  /** Configuration generation number */
  generation: number;
  /** Last update timestamp in microseconds */
  lastUpdateMicros: number;
}
