/**
 * @fileoverview Common query parameters interface for NetBox API requests.
 * Defines the standard parameters used across NetBox API endpoints for searching,
 * filtering, pagination, and ordering results.
 */

import { NetboxPartial } from "./netbox-partial";

/**
 * Interface defining common query parameters for NetBox API requests.
 * Extends NetboxPartial to inherit standard entity properties that can be used for filtering.
 * These parameters are commonly used across multiple NetBox API endpoints.
 *
 * @example
 * ```typescript
 * // Basic pagination and search
 * const basicParams: NetboxParams = {
 *   q: 'user network',
 *   limit: 50,
 *   offset: 0
 * };
 *
 * // Filtering with ordering
 * const filterParams: NetboxParams = {
 *   name: 'DMZ',
 *   ordering: '-created',  // Descending by creation date
 *   limit: 25
 * };
 *
 * // Using inherited NetboxPartial properties
 * const advancedParams: NetboxParams = {
 *   description: 'Production network',
 *   created__gte: '2025-01-01',  // Date filtering
 *   tags: ['production', 'critical']
 * };
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/filtering/} NetBox API Filtering
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/overview/#pagination} NetBox API Pagination
 */
export interface NetboxParams extends Partial<NetboxPartial>{
    /** 
     * General search query parameter.
     * Performs text search across multiple fields (name, description, etc.)
     * @example "user network", "DMZ firewall", "192.168"
     */
    q?: string;
    
    /** 
     * Maximum number of results to return per page.
     * Used for pagination control. Default varies by endpoint, typically 50.
     * @example 25, 50, 100
     */
    limit?: number;
    
    /** 
     * Number of results to skip (for pagination).
     * Used with limit to implement pagination. Formula: page_number * limit
     * @example 0, 50, 100
     */
    offset?: number;
    
    /** 
     * Field name to sort results by.
     * Prefix with '-' for descending order. Multiple fields can be comma-separated.
     * @example "name", "-created", "prefix,name", "-last_updated,name"
     */
    ordering?: string;
    
    /** 
     * Filter by exact name match.
     * Case-sensitive exact string matching.
     * @example "User Network", "DMZ-01"
     */
    name?: string;
    
    /** 
     * Filter by exact slug match.
     * URL-safe identifier, typically lowercase with hyphens.
     * @example "user-network", "dmz-01"
     */
    slug?: string;
}