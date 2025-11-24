/**
 * NAM v2 query parameters interface for API request configuration and data filtering.
 * Provides standardized parameters for pagination, sorting, field expansion, and
 * response formatting across NAM API endpoints and data retrieval operations.
 * 
 * @interface NAMParams
 * @since NAM v2.0
 * @context API query parameters for data filtering and response configuration
 * 
 * @example
 * ```typescript
 * const params: NAMParams = {
 *   q: 'production',
 *   pageSize: 50,
 *   page: 1,
 *   expand: 1,
 *   sort: 1,
 *   auto: true
 * };
 * ```
 */
export interface NAMParams {
  /**
   * Query string for text-based filtering and search operations
   * @optional
   */
  q?: string;

  /**
   * Number of items per page for pagination control
   * @optional
   * @minimum 1
   */
  pageSize?: number;

  /**
   * Page number for pagination navigation
   * @optional
   * @minimum 1
   */
  page?: number;

  /**
   * Enable field expansion in response data
   * @optional
   * @values 0, 1
   */
  expand?: 0 | 1;

  /**
   * Specific fields to expand in response data
   * @optional
   */
  expand_fields?: string[];

  /**
   * Enable sorting of response data
   * @optional
   * @values 0, 1
   */
  sort?: 0 | 1;

  /**
   * Enable reduced response data format
   * @optional
   * @values 0, 1
   */
  less?: 0 | 1;

  /**
   * Enable list format for response data
   * @optional
   * @values 0, 1
   */
  list?: 0 | 1;

  /**
   * Hierarchical level specification for nested data
   * @optional
   */
  level?: any;

  /**
   * Enable automatic processing and optimization
   * @optional
   */
  auto?: boolean;

  /**
   * Enable CLI-compatible response formatting
   * @optional
   */
  cli?: boolean;
}
