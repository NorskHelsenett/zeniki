// Binary enable/disable parameter type
export type FortiOSQueryEnableDisable = 0 | 1;

// FortiOS API action types
export type FortiOSQueryAction =
  | "datasource" // Return all applicable datasource entries for a specific attribute
  | "stats" // Return CMDB aggregated statistics
  | "find-index" // Return indexes of provided primary keys with respect to filter
  | "default" // Return the CLI default values for this object type
  | "json-schema" // Return the JSON Schema for this object type
  | "schema" // Return the CLI schema for this object type
  | "revision" // Return the CMDB revision for this object type
  | "transaction-list" // List all configuration transactions
  | "transaction-show";

// FortiOS configuration scope types
export type FortiOSQueryScope = "global" | "vdom" | "both";

/**
 * FortiOS API query parameters for configuration and data retrieval.
 * Supports filtering, pagination, VDOM targeting, and metadata retrieval.
 * 
 * @example
 * ```typescript
 * const params: FortiOSParams = {
 *   count: 100,
 *   search: 'internal*',
 *   format: ['name', 'subnet'],
 *   vdom: 'tenant1',
 *   with_meta: true
 * };
 * ```
 */
export interface FortiOSParams {
  /**
   * Attribute name for cross-table references.
   * @maxLength 255
   */
  attr?: string;

  /**
   * Maximum entries to return for pagination.
   * @minimum 1
   * @maximum 1000
   */
  count?: number;

  /** Pagination positioning for dataset traversal. */
  skip_to?: {} | object;

  /** Result ordering control. */
  acs: FortiOSQueryEnableDisable | boolean;

  /**
   * Advanced search filtering.
   * @maxLength 2047
   */
  search?: string;

  /** Configuration scope targeting. */
  scope?: FortiOSQueryScope;

  /** Datasource information inclusion. */
  datasource?: FortiOSQueryEnableDisable | boolean;

  /** Skip parameter for pagination control. */
  skip?: FortiOSQueryEnableDisable | boolean;

  /** Result field selection. */
  format?: string | string[];

  /** API action specification. */
  action?: string | string[];

  /** VDOM targeting. */
  vdom?: string | string[];

  /** Metadata inclusion. */
  with_meta?: FortiOSQueryEnableDisable | boolean;
}
