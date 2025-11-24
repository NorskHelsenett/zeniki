// Binary enable/disable parameter type for FortiOS boolean configuration values
export type FortiOSQueryEnableDisable = 0 | 1;

// FortiOS API action types for specialized configuration management and analytics operations
export type FortiOSQueryAction =
  | "datasource" // Return all applicable datasource entries for a specific attribute
  | "stats" // Return CMDB aggregated statistics
  | "find-index" // Return indexes of provided primary keys with respect to filter
  | "default" // Return the CLI default values for this object type
  | "json-schema" // Return the JSON Schema for this object type
  | "schema" // Return the CLI schema for this object type
  | "revision" // Return the CMDB revision for this object type
  | "transaction-list" // List all configuration transactions
  | "transaction-show"; // Show the content of the configuration transaction by ID

// FortiOS configuration scope types for multi-tenant and VDOM environments
export type FortiOSQueryScope = "global" | "vdom" | "both";

/**
 * FortiOS API query parameters for advanced configuration management and data retrieval.
 * 
 * Enterprise-grade parameter system supporting high-performance queries, advanced filtering,
 * multi-VDOM management, comprehensive metadata retrieval, performance optimizations,
 * intelligent caching, and automation-friendly features for infrastructure-as-code workflows.
 * 
 * @example
 * ```typescript
 * const params: FortiOSParams = {
 *   count: 100,
 *   search: 'internal*',
 *   format: ['name', 'subnet', 'comment'],
 *   vdom: ['tenant1', 'tenant2'],
 *   scope: 'both',
 *   with_meta: true,
 *   acs: true,
 *   datasource: false,
 *   skip: false,
 *   action: 'stats',
 *   attr: 'interface',
 *   skip_to: { pos: 50 }
 * };
 * ```
 */
export interface FortiOSParams {
  /**
   * Attribute name for cross-table references and relationship mapping.
   * @maxLength 255
   * @requires action must be 'datasource'
   * @optional
   */
  attr?: string;

  /**
   * Maximum number of entries to return for pagination and performance control.
   * @minimum 1
   * @maximum 1000
   * @optional
   */
  count?: number;

  /**
   * Advanced pagination positioning for efficient large dataset traversal.
   * @optional
   */
  skip_to?: {} | object;

  /**
   * Result ordering control for sorted data retrieval and presentation.
   * @values 0 | 1 | false | true
   * @optional
   */
  acs: FortiOSQueryEnableDisable | boolean;

  /**
   * Advanced search filtering with complex expression support.
   * @maxLength 2047
   * @optional
   */
  search?: string;

  /**
   * Configuration scope targeting for multi-VDOM and global operations.
   * @values "global" | "vdom" | "both"
   * @see FortiOSQueryScope
   * @optional
   */
  scope?: FortiOSQueryScope;

  /**
   * Datasource information inclusion for relationship mapping and dependency analysis.
   * @values 0 | 1 | false | true
   * @optional
   */
  datasource?: FortiOSQueryEnableDisable | boolean;

  /**
   * Skip parameter for pagination control and result set navigation.
   * @values 0 | 1 | false | true
   * @optional
   */
  skip?: FortiOSQueryEnableDisable | boolean;

  /**
   * Result field selection for bandwidth optimization and focused data retrieval.
   * @optional
   */
  format?: string | string[];

  /**
   * API action specification for specialized operations and data retrieval.
   * @see FortiOSQueryAction
   * @optional
   */
  action?: string | string[];

  /**
   * VDOM targeting for multi-tenant operations and tenant-specific queries.
   * @optional
   */
  vdom?: string | string[];

  /**
   * Metadata inclusion for enhanced object introspection and relationship analysis.
   * @values 0 | 1 | false | true
   * @optional
   */
  with_meta?: FortiOSQueryEnableDisable | boolean;
}
