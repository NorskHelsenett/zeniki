/**
 * VMware NSX query parameters interface for API request configuration and result filtering.
 * Provides standardized parameters for pagination, sorting, field selection, and object
 * inclusion control across NSX Policy API endpoints and search operations.
 * 
 * @interface VMwareNSXParams
 * @since NSX 3.0+
 * @context VMware NSX Policy API query parameters and result filtering
 * 
 * @example
 * ```typescript
 * const params: VMwareNSXParams = {
 *   cursor: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
 *   page_size: 100,
 *   include_mark_for_delete_objects: false,
 *   included_fields: 'id,display_name,resource_type',
 *   sort_by: 'display_name',
 *   sort_ascending: true
 * };
 * ```
 */
export interface VMwareNSXParams {
  /**
   * Opaque cursor for pagination to next page of records
   * @optional
   */
  cursor?: string;

  /**
   * Include resources marked for deletion in results
   * @optional
   * @default false
   */
  include_mark_for_delete_objects?: boolean;

  /**
   * Comma-separated list of fields to include in query result
   * @optional
   */
  included_fields?: string;

  /**
   * Maximum number of results per page
   * @optional
   * @minimum 0
   * @maximum 1000
   * @default 1000
   */
  page_size?: number;

  /**
   * Sort order direction for results
   * @optional
   */
  sort_ascending?: boolean;

  /**
   * Field name for sorting records
   * @optional
   */
  sort_by?: string;
}
