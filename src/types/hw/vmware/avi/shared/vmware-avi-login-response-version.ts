/**
 * Version information from VMware AVI login response.
 * @interface
 * @example
 * ```typescript
 * const version: VMwareAVILoginResponseVersion = {
 *   Date: '2024-01-15',
 *   Product: 'controller',
 *   ProductName: 'Avi Controller',
 *   Tag: 'avi-20.1.1',
 *   Version: '20.1.1',
 *   build: 12345,
 *   min_version: '18.2.1'
 * };
 * ```
 */
export interface VMwareAVILoginResponseVersion {
  /** Build date in ISO format */
  Date: string;
  /** Product identifier */
  Product: string;
  /** Human-readable product name */
  ProductName: string;
  /** Version tag identifier */
  Tag: string;
  /** Software version string */
  Version: string;
  /** Build number */
  build: number;
  /** Minimum compatible version */
  min_version: string;
}
