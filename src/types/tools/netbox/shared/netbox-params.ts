import { NetboxPartial } from "./netbox-partial";

/**
 * NetBox API query parameters.
 * Standard parameters for searching, filtering, pagination, and ordering.
 *
 * @example
 * ```typescript
 * const params: NetboxParams = {
 *   q: 'user network',
 *   limit: 50,
 *   offset: 0,
 *   ordering: '-created'
 * };
 * ```
 */
export interface NetboxParams extends Partial<NetboxPartial>{
    /** General search query. */
    q?: string;
    
    /** Maximum results per page. */
    limit?: number;
    
    /** Pagination offset. */
    offset?: number;
    
    /** Sort field (prefix with '-' for descending). */
    ordering?: string;
    
    /** Filter by exact name match. */
    name?: string;
    
    /** Filter by exact slug match. */
    slug?: string;
}