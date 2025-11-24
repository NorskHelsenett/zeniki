import { NAMDefaultFields } from "./shared/nam-default-fields";

/**
 * NAM v2 API endpoint SSL configuration interface for secure network connectivity.
 * Extends NAMDefaultFields to provide MongoDB document tracking capabilities for SSL
 * certificate management supporting both inline certificates and file path references.
 * 
 * @interface NAMAPIEndpointSSL
 * @since NAM v2.0
 * @context SSL certificate configuration for secure API endpoints
 * 
 * @example
 * ```typescript
 * const sslConfig: NAMAPIEndpointSSL = {
 *   crt: '-----BEGIN CERTIFICATE-----...',
 *   key: '-----BEGIN PRIVATE KEY-----...',
 *   ca: '-----BEGIN CERTIFICATE-----...',
 *   pass: 'certificate-password'
 * };
 * ```
 */
export interface NAMAPIEndpointSSL extends NAMDefaultFields {
  /**
   * Certificate content as inline string
   * @optional
   */
  crt?: string;

  /**
   * Private key content as inline string
   * @optional
   */
  key?: string;

  /**
   * CA certificate content as inline string
   * @optional
   */
  ca?: string;

  /**
   * Certificate file path for filesystem-based storage
   * @optional
   */
  crtPath?: string;

  /**
   * Private key file path for filesystem-based storage
   * @optional
   */
  keyPath?: string;

  /**
   * CA certificate file path for filesystem-based storage
   * @optional
   */
  caPath?: string;

  /**
   * Certificate password for encrypted private keys
   * @optional
   */
  pass?: string;
}
