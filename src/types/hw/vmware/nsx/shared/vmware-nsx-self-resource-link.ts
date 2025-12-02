/**
 * Link to this resource.
 * The server will populate this field when returning the resource. Ignored on PUT and POST.
 *
 * @example
 * ```typescript
 * const selfLink: VMwareNSXSelfResourceLink = {
 *   href: "/api/v1/resources/12345",
 *   rel: "self"
 * };
 * ```
 */
export interface VMwareNSXSelfResourceLink {
  /** Optional action */
  readonly action?: string;

  /** Link to resource */
  readonly href: string;

  /** Custom relation type (follows RFC 5988 where appropriate definitions exist) */
  readonly rel: string;
}
