import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 Credential configuration.
 * Stores authentication credentials for device access.
 * 
 * @example
 * ```typescript
 * const credential: NAMCredential = {
 *   name: 'admin-creds',
 *   user: 'admin',
 *   email: 'admin@example.com',
 *   password: 'securePassword123',
 *   description: 'Administrator credentials'
 * };
 * ```
 */
export interface NAMCredential extends NAMDefaultFields {
  /** Credential name. */
  name: string;

  /** Username. */
  user: string;

  /** Email address. */
  email: string;

  /** Password. */
  password: string;

  /** Credential description. */
  description?: string;
}
