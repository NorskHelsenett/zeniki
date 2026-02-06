/**
 * Base interface for F5 BIG-IP resources with common properties.
 * @interface
 * @example
 * ```typescript
 * const resource: F5BigIPPartial = {
 *   kind: 'tm:ltm:pool',
 *   name: 'my-pool',
 *   partition: 'Common',
 *   fullPath: '/Common/my-pool',
 *   generation: 1,
 *   selfLink: 'https://bigip/mgmt/tm/ltm/pool/~Common~my-pool'
 * };
 * ```
 */
export interface F5BigIPPartial {
  /** Resource kind identifier */
  kind: string;
  /** Resource name */
  name: string;
  /** Configuration partition */
  partition: string;
  /** Full path to resource */
  fullPath: string;
  /** Configuration generation number */
  generation: number;
  /** Self-reference link */
  selfLink: string;
  /** Optional resource description */
  description?: string;
}
