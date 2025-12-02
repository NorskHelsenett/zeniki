/**
 * A link to a related resource
 *
 * @example
 * ```typescript
 * const resourceLink: VMwareNSXResourceLink = {
 *   href: "/api/v1/logical-ports/port-123",
 *   rel: "self"
 * };
 * ```
 */
export interface VMwareNSXResourceLink {
  /** Optional action */
  readonly action?: string;

  /** Link to resource */
  readonly href: string;

  /** Custom relation type (follows RFC 5988 where appropriate definitions exist) */
  readonly rel: string;
}
