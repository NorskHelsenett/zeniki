/**
 * VMware NSX API modify operation response for create, update, and delete operations.
 *
 * @example
 * ```typescript
 * const response: VMwareNsxModifyResponse = { statusText: 'OK', status: 200, data: '{"id": "group-123"}' };
 * ```
 */
export interface VMwareNsxModifyResponse {
    /** HTTP status text description */
    statusText?: string;
    /** HTTP status code or status string */
    status?: string | number;
    /** Response payload data */
    data?: string;
}