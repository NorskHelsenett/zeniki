import { VMwareNSXDiscoveredResource } from "../../shared/vmware-nsx-discovered-resource";
import { VMwareNSXIPAddressInfo } from "../../shared/vmware-nsx-ip-address-info";

/**
 * Represents a virtual network interface in VMware NSX inventory.
 *
 * @extends DiscoveredResource
 * @remarks
 * Describes a virtual network interface with its configuration, IP addresses,
 * MAC address, and relationship to host and VM resources.
 *
 * @example
 * ```typescript
 * const vif: VirtualNetworkInterface = {
 *   resource_type: "VirtualNetworkInterface",
 *   device_key: "4000",
 *   device_name: "Network adapter 1",
 *   external_id: "vmx-0:4000",
 *   host_id: "host-123",
 *   mac_address: "00:50:56:a1:b2:c3",
 *   owner_vm_id: "vm-456",
 *   owner_vm_type: "REGULAR",
 *   vm_local_id_on_host: "1",
 *   ip_address_info: [{ ip_address: "192.168.1.10" }],
 *   lport_attachment_id: "lport-789",
 *   uptv2_enabled: false
 * };
 * ```
 */
export interface VMwareNSXVirtualNetworkInterface
  extends Partial<VMwareNSXDiscoveredResource> {
  /** Device key of the virtual network interface */
  device_key: string;

  /** Device name of the virtual network interface */
  device_name?: string;

  /** External Id of the virtual network interface */
  external_id: string;

  /** Id of the host on which the vm exists */
  host_id: string;

  /** IP Addresses of the virtual network interface, from various sources */
  ip_address_info?: VMwareNSXIPAddressInfo[];

  /** LPort Attachment Id of the virtual network interface */
  lport_attachment_id?: string;

  /** MAC address of the virtual network interface */
  mac_address: string;

  /** Id of the vm to which this virtual network interface belongs */
  owner_vm_id: string;

  /** @readonly Owner virtual machine type; Edge, Service VM or other */
  owner_vm_type?: "EDGE" | "SERVICE" | "REGULAR";

  /** @readonly Flag to indicate if UPT is enabled */
  uptv2_enabled?: boolean;

  /** Id of the vm unique within the host */
  vm_local_id_on_host: string;
}
