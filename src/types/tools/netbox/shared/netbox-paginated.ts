/**
 * NetBox paginated response wrapper.
 * Uses cursor-based pagination with navigation URLs.
 * 
 * @example
 * ```typescript
 * const response: NetboxPaginated<NetboxPrefix> = {
 *   count: 150,
 *   next: "https://netbox.example.com/api/ipam/prefixes/?offset=50",
 *   previous: null,
 *   results: [{ prefix: "192.168.1.0/24", id: 1 }]
 * };
 * ```
 */
export interface NetboxPaginated<T> {
  /** Total number of objects across all pages. */
  count: number;
  
  /** URL to fetch the next page of results. */
  next?: string | null;
  
  /** URL to fetch the previous page of results. */
  previous?: string | null;
  
  /** Array containing the actual data objects for the current page. */
  results: T[];
}
