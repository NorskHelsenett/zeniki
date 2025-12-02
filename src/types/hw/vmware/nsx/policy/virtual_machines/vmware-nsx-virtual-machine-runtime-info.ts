import { VMwareNSXVirtualNetworkInterfaceRuntimeInfo } from "./vmware-nsx-virtual-network-interface-runtime-info";

/**
 * Runtime information for a VMware NSX virtual machine.
 *
 * Contains runtime details about the virtual machine's network interfaces and their current state
 * within the NSX environment.
 *
 * @example
 * ```typescript
 * const vmRuntimeInfo: VMwareNSXVirtualMachineRuntimeInfo = {
 *   vif_runtime_info: [
 *     {
 *       vif_id: "vif-1",
 *       state: "up",
 *       // ... other VIF runtime properties
 *     }
 *   ]
 * };
 * ```
 */
export interface VMwareNSXVirtualMachineRuntimeInfo {
  /** Array of runtime information for each virtual network interface attached to the VM */
  vif_runtime_info?: VMwareNSXVirtualNetworkInterfaceRuntimeInfo[];
}
