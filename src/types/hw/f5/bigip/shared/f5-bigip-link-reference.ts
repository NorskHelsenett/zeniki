/**
 * Reference link to F5 BIG-IP API resource.
 * @interface
 * @example
 * ```typescript
 * const ref: F5BigIPLinkReference = {
 *   link: 'https://bigip/mgmt/tm/resource'
 * };
 * ```
 */
export interface F5BigIPLinkReference {
  /** API resource link URL */
  link: string;
}
