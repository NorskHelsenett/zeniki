/**
 * VMware NSX identity group information for directory-based group membership.
 *
 * @example
 * ```typescript
 * const identityGroup: VMwareNSXIdentityGroup = { distinguished_name: 'CN=Admins,DC=example,DC=com', domain_base_distinguished_name: 'DC=example,DC=com', sid: 'S-1-5-21-3623811015-3361044348-30300820-1013' };
 * ```
 */
export interface VMwareNSXIdentityGroupInfo {
  /** LDAP distinguished name. */
  distinguished_name: string;
  /** Identity directory domain base distinguished name. */
  domain_base_distinguished_name: string;
  /** Identity directory group SID (security identifier). */
  sid: string;
}
