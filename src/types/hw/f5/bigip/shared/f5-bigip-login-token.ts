import { F5BigIPLinkReference } from "./f5-bigip-link-reference";

/**
 * Authentication token details from F5 BIG-IP login.
 * Contains token string, expiration, and user session information.
 * @interface
 * @example
 * ```typescript
 * const token: F5BigIPLoginToken = {
 *   token: 'abc123',
 *   name: 'token-name',
 *   userName: 'admin',
 *   timeout: 1200,
 *   startTime: '2026-01-30T12:00:00Z'
 * };
 * ```
 */
export interface F5BigIPLoginToken {
  /** Authentication token string */
  token: string;
  /** Token identifier name */
  name: string;
  /** Username associated with token */
  userName: string;
  /** Authentication provider name */
  authProviderName: string;
  /** Reference to user resource */
  user: F5BigIPLinkReference;
  /** Token timeout in seconds */
  timeout: number;
  /** Token creation timestamp */
  startTime: string;
  /** Client IP address */
  address: string;
  /** Partitions accessible with token */
  partition: string[];
  /** Configuration generation number */
  generation: number;
  /** Last update timestamp in microseconds */
  lastUpdateMicros: number;
  /** Token expiration timestamp in microseconds */
  expirationMicros: number;
  /** Resource kind identifier */
  kind: string;
  /** Self-reference link */
  selfLink: F5BigIPLinkReference;
}
