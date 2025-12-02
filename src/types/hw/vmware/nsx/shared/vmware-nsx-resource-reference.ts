/**
 * Reference to an NSX resource with validation and identification information.
 *
 * Used to maintain relationships between NSX objects while tracking their validity
 * and providing display information for user interfaces.
 *
 * @example
 * ```typescript
 * const resourceRef: VMwareNSXResourceReference = {
 *   is_valid: true,
 *   target_display_name: "Production Firewall",
 *   target_id: "fw-prod-001",
 *   target_type: "Firewall"
 * };
 * ```
 */
export interface VMwareNSXResourceReference {
  /**
   * Will be set to false if the referenced NSX resource has been deleted.
   */
  readonly is_valid?: boolean;

  /**
   * Display name of the NSX resource.
   */
  readonly target_display_name?: string;

  /**
   * Identifier of the NSX resource.
   */
  target_id?: string;

  /**
   * Type of the NSX resource.
   */
  target_type?: string;
}
