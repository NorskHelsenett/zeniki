/**
 * @fileoverview Generic paginated response structure for NetBox REST API.
 * 
 * Defines the standard pagination format used across all NetBox API endpoints that return
 * lists of data. NetBox uses cursor-based pagination to handle large datasets efficiently
 * by breaking them into pages with navigation metadata for seamless data retrieval.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/overview/#pagination} NetBox Pagination
 */

/**
 * Generic interface representing a paginated response from NetBox REST API endpoints.
 * 
 * NetBox uses cursor-based pagination to handle large datasets efficiently by breaking them
 * into pages. This interface wraps any array of NetBox entities with pagination metadata
 * including total count and navigation URLs for seamless data retrieval across multiple
 * pages with consistent structure and type safety.
 * 
 * @template T The type of objects contained in the paginated results array
 * @example
 * ```typescript
 * const prefixResponse: NetboxPaginated<NetboxPrefix> = {
 *   count: 150,
 *   next: "https://netbox.example.com/api/ipam/prefixes/?limit=50&offset=50",
 *   previous: null,
 *   results: [{ prefix: "192.168.1.0/24", id: 1 }]
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/overview/#pagination} NetBox Pagination
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
