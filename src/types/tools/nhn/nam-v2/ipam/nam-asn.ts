import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 ASN (Autonomous System Number) configuration.
 * Defines autonomous system numbers for BGP routing configurations.
 * 
 * @example
 * ```typescript
 * const asn: NAMAsn = {
 *   id: '64512',
 *   type: 'private',
 *   description: 'Private ASN for internal routing'
 * };
 * ```
 */
export interface NAMAsn extends NAMDefaultFields {
  /** ASN identifier. */
  id: string;

  /** ASN type (e.g., public, private). */
  type: string;

  /** ASN description. */
  description: string;
}
