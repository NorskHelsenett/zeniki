/**
 * VMware NSX paginated response wrapper.
 *
 * @example
 * ```typescript
 * const response: VMwareNSXResponse<VMwareNSXGroup> = {
 *   result_count: 10,
 *   results: [group1, group2]
 * };
 * ```
 */
export interface VMwareNSXResponse<T> {
  /** Sort results in ascending order. */
  sort_ascending?: boolean;

  /** Field to sort results by. */
  sort_by?: string;

  /** Total number of results. */
  result_count?: number;

  cursor?: number;

  /** Array of result objects. */
  results: T[] | [];
}
