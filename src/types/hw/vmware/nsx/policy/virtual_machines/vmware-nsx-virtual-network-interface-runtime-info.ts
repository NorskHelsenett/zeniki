import { VMwareNSXUnifiedPacketTraceV2Values } from "../../shared/vmware-nsx-common";

/**
 * Represents runtime information for a VMware NSX virtual network interface.
 * Contains external identification and UPTV2 (Unified Packet Trace Version 2) activation status.
 *
 * @example
 * ```typescript
 * const runtimeInfo: VMwareNSXVirtualNetworkInterfaceRuntimeInfo = {
 *   external_id: "vm-123-vnic-0",
 *   uptv2_active: "true"
 * };
 * ```
 */
export interface VMwareNSXVirtualNetworkInterfaceRuntimeInfo {
  /** Unique external identifier for the virtual network interface */
  external_id: string;
  /** Indicates whether UPTV2 (Unified Packet Trace Version 2) is active on this interface */
  uptv2_active?: VMwareNSXUnifiedPacketTraceV2Values;
}
