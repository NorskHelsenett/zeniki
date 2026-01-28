/**
 * Label matching configuration for AVI role filters.
 * @interface
 * @example
 * ```typescript
 * const label: VMwareAVIRoleFilterMatchLabel = {
 *   key: 'environment',
 *   values: ['prod', 'staging']
 * };
 * ```
 */
export interface VMwareAVIRoleFilterMatchLabel {
  /** Label key */
  key: string;
  /** Array of label values to match */
  values: string[];
}
