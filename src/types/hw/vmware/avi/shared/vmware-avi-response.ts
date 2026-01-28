/**
 * Paginated response structure from AVI API.
 * @interface
 * @template T - Type of objects in results array
 * @example
 * ```typescript
 * const response: VMwareAVIResponse<Pool> = {
 *   count: 100,
 *   results: [{ name: 'pool-1' }],
 *   next: '/api/pool?page=2'
 * };
 * ```
 */
export interface VMwareAVIResponse<T> {
  /** Total count of objects */
  count: number;
  /** Array of result objects */
  results: T[] | [];
  /** URL for next page of results */
  next?: string;
}
