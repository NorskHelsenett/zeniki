/**
 * FortiOS firewall address metadata for internal object management.
 * 
 * @example
 * ```typescript
 * const meta: FortiOSFirewallAddrMeta = {
 *   q_mkey_type: 'string',
 *   q_class: 'address'
 * };
 * ```
 */
export interface FortiOSFirewallAddrMeta {
  /** Reference count for object usage. */
  q_ref?: number;
  
  /** Indicates if object is static. */
  q_static?: boolean;
  
  /** Prevents object renaming. */
  q_no_rename?: boolean;
  
  /** Indicates global scope entry. */
  q_global_entry?: boolean;
  
  /** Object type identifier. */
  q_type?: number;
  
  /** Object path in configuration tree. */
  q_path?: string;
  
  /** Object name identifier. */
  q_name?: string;
  
  /** Primary key type. */
  q_mkey_type: string;
  
  /** Prevents object editing. */
  q_no_edit?: boolean;
  
  /** Object class identifier. */
  q_class: string;
}
