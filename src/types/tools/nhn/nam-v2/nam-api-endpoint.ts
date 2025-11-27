import { NAMAPIEndpointSSL } from "./nam-api-endpoint-ssl";
import { NAMApiEndpointTypes, NAMApiEndpointVendors } from "./shared/nam-api-endpoint-types";
import { NAMDefaultFields } from "./shared/nam-default-fields";

/**
 * NAM v2 API endpoint configuration.
 * Multi-vendor network device connectivity with authentication,
 * SSL configuration, and vendor-specific settings.
 * 
 * @example
 * ```typescript
 * const endpoint: NAMAPIEndpoint = {
 *   name: 'fortigate-01',
 *   url: 'https://192.168.1.1:443/api/v2',
 *   user: 'admin',
 *   enabled: true,
 *   vendor: 'fortinet',
 *   type: 'fortigate'
 * };
 * ```
 */
export interface NAMAPIEndpoint extends NAMDefaultFields {
  /** Username for authentication. */
  user?: string;

  /** Password for authentication. */
  pass?: string;

  /** Description. */
  desc?: string;

  /** Endpoint is enabled. */
  enabled: boolean;

  /** Base API URL. */
  url: string;

  /** Endpoint name. */
  name?: string;

  /** Vendor identifier. */
  vendor?: NAMApiEndpointVendors | string;

  /** Device type. */
  type?: NAMApiEndpointTypes | string;

  /** API key for authentication. */
  key?: string;

  /** API key expiration. */
  keyExpires?: Date;

  /** SSL configuration. */
  ssl?: NAMAPIEndpointSSL;
}