import { NAMAPIEndpointSSL } from "./nam-api-endpoint-ssl";
import { NAMApiEndpointTypes, NAMApiEndpointVendors } from "./shared/nam-api-endpoint-types";
import { NAMDefaultFields } from "./shared/nam-default-fields";

/**
 * NAM v2 API endpoint configuration interface for multi-vendor network device connectivity.
 * Extends NAMDefaultFields to provide MongoDB document tracking capabilities for API endpoint
 * management including authentication, SSL configuration, and vendor-specific settings.
 * 
 * @interface NAMAPIEndpoint
 * @since NAM v2.0
 * @context API endpoint configuration for network device management
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
  /**
   * Username for API authentication
   * @optional
   */
  user?: string;

  /**
   * Password for API authentication
   * @optional
   */
  pass?: string;

  /**
   * Description text providing contextual information about endpoint
   * @optional
   */
  desc?: string;

  /**
   * Enable flag controlling endpoint active state
   * @required
   */
  enabled: boolean;

  /**
   * Base URL for API endpoint connectivity
   * @required
   */
  url: string;

  /**
   * Endpoint name identifier for configuration reference
   * @optional
   */
  name?: string;

  /**
   * Vendor identifier for device type classification
   * @optional
   * @see NAMApiEndpointVendors
   */
  vendor?: NAMApiEndpointVendors | string;

  /**
   * Device type specification for vendor-specific operations
   * @optional
   * @see NAMApiEndpointTypes
   */
  type?: NAMApiEndpointTypes | string;

  /**
   * API key for token-based authentication
   * @optional
   */
  key?: string;

  /**
   * API key expiration timestamp for token lifecycle management
   * @optional
   */
  keyExpires?: Date;

  /**
   * SSL configuration settings for secure connectivity
   * @optional
   * @see NAMAPIEndpointSSL
   */
  ssl?: NAMAPIEndpointSSL;
}