/**
 * Metadata for a VMware NSX virtual machine, containing identification and configuration details.
 *
 * @remarks
 * This interface defines the metadata structure for virtual machines managed by VMware NSX-T Policy API.
 * It includes various identifiers, location information, and network interface details.
 *
 * @example
 * ```typescript
 * const vmMeta: VMwareNSXVirtualMachineMeta = {
 *   moIdOnHost: "vm-123",
 *   identifier: "vm-identifier-456",
 *   hostLocalId: "host-789",
 *   stream_tag: "production",
 *   locationId: "dc-01",
 *   scope: ["/infra/domains/default"],
 *   instanceUuid: "502e71b8-8d4f-8d4f-8d4f-8d4f8d4f8d4f",
 *   externalId: "ext-vm-001",
 *   vif_ids: ["vif-001", "vif-002"],
 *   biosUuid: "422e71b8-8d4f-8d4f-8d4f-8d4f8d4f8d4f"
 * };
 * ```
 */
export interface VMwareNSXVirtualMachineMeta {
  /**
   * Managed object identifier on the host system
   */
  moIdOnHost?: string;

  /**
   * Unique identifier for the virtual machine
   */
  identifier?: string;

  /**
   * Local identifier of the host where the VM resides
   */
  hostLocalId?: string;

  /**
   * Tag indicating the stream or environment of the VM
   */
  stream_tag?: string;

  /**
   * Location identifier where the VM is deployed
   */
  locationId?: string;

  /**
   * Array of scope paths defining the VM's context
   */
  scope?: string[];

  /**
   * Instance UUID assigned by vCenter
   */
  instanceUuid?: string;

  /**
   * External system identifier for the VM
   */

  externalId?: string;
  /**
   * Array of virtual interface identifiers
   */
  vif_ids?: string[];

  /**
   * BIOS UUID of the virtual machine
   */
  biosUuid?: string;
}
