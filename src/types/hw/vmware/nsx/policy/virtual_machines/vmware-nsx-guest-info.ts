/**
 * VMware NSX guest info for Virtual Machines.
 *
 * @example
 * ```typescript
 * const tag: VMWareNSXTag = {
 *   scope: 'environment',
 *   tag: 'production'
 * };
 * ```
 */
export interface VMwareNSXGuestInfo {
  /**
   * Computer name.
   */
  readonly computer_name?: string;

  /**
   * Operating system name.
   */
  readonly os_name?: string;
}
