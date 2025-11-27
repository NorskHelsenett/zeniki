/**
 * VMware NSX tag for resource metadata and filtering.
 * 
 * @example
 * ```typescript
 * const tag: VMWareNSXTag = {
 *   scope: 'environment',
 *   tag: 'production'
 * };
 * ```
 */
export interface VMWareNSXTag {
  /**
   * Tag scope for categorization.
   * @maxLength 128
   */
  scope?: string;
  
  /**
   * Tag value.
   * @maxLength 256
   */
  tag?: string;
}
