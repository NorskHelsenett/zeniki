import {
  VMwareResourceTypes,
  VmwareNSXVirtualMachinePowerStates,
  VMwareNSXVirtualMachineTypes,
  VMwareNSXUnifiedPacketTraceV2Values,
} from "../../shared/vmware-nsx-common";
import { VMwareNSXGuestInfo } from "./vmware-nsx-guest-info";
import { VMwareNSXTag } from "../../shared/vmware-nsx-tag";
import { VMwareNSXDiscoveredResource } from "../../shared/vmware-nsx-discovered-resource";
import { VMwareNSXResourceReference } from "../../shared/vmware-nsx-resource-reference";
import { VMwareNSXVirtualMachineRuntimeInfo } from "./vmware-nsx-virtual-machine-runtime-info";
import { VMwareNSXVirtualMachineMeta } from "./vmware-nsx-virtual-machine-meta";

/**
 * Virtual machine resource in NSX inventory with compute and runtime information.
 *
 * @example
 * ```typescript
 * const vm: VMwareNSXVirtualMachine = { display_name: 'web-server-01', external_id: 'vm-123', compute_ids: ['uuid:xxxx-xxxx-xxxx-xxxx'], local_id_on_host: 'moref-11', power_state: 'VM_RUNNING', resource_type: 'VirtualMachine', type: 'REGULAR' };
 * ```
 */
export interface VMwareNSXVirtualMachine
  extends Partial<VMwareNSXDiscoveredResource> {
  /** Metadata information for the virtual machine.
   * @readonly
   */
  readonly _meta?: VMwareNSXVirtualMachineMeta;

  /** External compute IDs in format 'id-type-key:value'. */
  compute_ids: string[];

  /** Current external ID in the system. */
  external_id: string;

  /** Guest VM details including OS name and computer name.
   * @readonly
   */
  readonly guest_info?: VMwareNSXGuestInfo;

  /** Host system ID where VM exists. */
  host_id?: string;

  /** VM ID unique within the host. */
  local_id_on_host: string;

  /** Current power state of the VM. */
  power_state: VmwareNSXVirtualMachinePowerStates;

  /** Runtime details of the VM.
   * @readonly
   */
  readonly runtime_info?: VMwareNSXVirtualMachineRuntimeInfo;

  /** Reference to Host or Public Cloud Gateway that reported the VM. */
  source?: VMwareNSXResourceReference;

  /** VM type (Edge, Service, Regular, etc.).
   * @readonly
   */
  readonly type: VMwareNSXVirtualMachineTypes;

  /** Indicates if UPT is enabled on any virtual network interface.
   * @readonly
   */
  readonly uptv2_enabled?: boolean;
}
