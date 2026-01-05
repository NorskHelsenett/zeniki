import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 Domain configuration.
 *
 * @example
 * ```typescript
 * const domain: NAMDomain = {
 *   name: 'production-domain',
 *   environment: 'lab-environment',
 *   infrastructure: 'lab-infrastructure',
 *   os: 'linux',
 *   createdBy: 'admin'
 * };
 * ```
 */
export interface NAMDomain extends NAMDefaultFields {
  /** Domain name. */
  name: string;

  /** Associated environment. */
  environment: string;

  /** Associated infrastructure. */
  infrastructure: string;

  // Asscociated Operating system */
  os: string;

  /** Optional description. */
  description?: string;
}
