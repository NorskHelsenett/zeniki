import { NAMDefaultFields } from "./shared/nam-default-fields";

/**
 * NAM v2 SSL configuration.
 * Secure API endpoint certificate management
 * with inline content or file path references.
 * 
 * @example
 * ```typescript
 * const sslConfig: NAMAPIEndpointSSL = {
 *   crt: '-----BEGIN CERTIFICATE-----...',
 *   key: '-----BEGIN PRIVATE KEY-----...',
 *   ca: '-----BEGIN CERTIFICATE-----...'
 * };
 * ```
 */
export interface NAMAPIEndpointSSL extends NAMDefaultFields {
  /** Certificate content. */
  crt?: string;

  /** Private key content. */
  key?: string;

  /** CA certificate content. */
  ca?: string;

  /** Certificate file path. */
  crtPath?: string;

  /** Private key file path. */
  keyPath?: string;

  /** CA certificate file path. */
  caPath?: string;

  /** Certificate password. */
  pass?: string;
}
