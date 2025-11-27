/**
 * NAM v2 query parameters.
 * Standardized parameters for pagination, sorting, field expansion,
 * and response formatting.
 * 
 * @example
 * ```typescript
 * const params: NAMParams = {
 *   q: 'production',
 *   pageSize: 50,
 *   page: 1,
 *   expand: 1
 * };
 * ```
 */
export interface NAMParams {
  /** Query string for filtering. */
  q?: string;

  /**
   * Items per page.
   * @minimum 1
   */
  pageSize?: number;

  /**
   * Page number.
   * @minimum 1
   */
  page?: number;

  /** Enable field expansion. */
  expand?: 0 | 1;

  /** Fields to expand. */
  expand_fields?: string[];

  /** Enable sorting. */
  sort?: 0 | 1;

  /** Enable reduced response format. */
  less?: 0 | 1;

  /** Enable list format. */
  list?: 0 | 1;

  /** Hierarchical level for nested data. */
  level?: any;

  /** Enable automatic processing. */
  auto?: boolean;

  /** Enable CLI-compatible formatting. */
  cli?: boolean;
}
