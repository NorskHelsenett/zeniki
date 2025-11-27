/**
 * NAM v2 API response wrapper.
 * Standard paginated response format.
 *
 * @example
 * ```typescript
 * const response: NAMResponse<Device> = {
 *   count: 100,
 *   results: [device1, device2]
 * };
 * ```
 */
export interface NAMResponse<T> {
    /**
     * Total result count.
     * @readonly
     */
    readonly count: number;
    
    /** Result items. */
    results: T[] | [];
}