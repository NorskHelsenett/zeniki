import {
  VmwareResourceTypes,
  VmwareNSXVirtualMachinePowerStatesx,
} from "../../shared/vmware-nsx-common";
import { VMWareNSXGuestInfo } from "./vmware-nsx-guest-info";
import { VMWareNSXTag } from "../../shared/vmware-nsx-tag";

export interface VMwareNSXVirtualMachine {
  /**
   * List of external compute ids of the virtual machine in the format 'id-type-key:value
   */
  compute_ids: string[];

  /**
   * Description of the virtual machine.
   * @maximum 1024
   */
  description?: string;

  /**
   * Display name of the virtual machine.
   * @maximum 255
   */
  display_name: string;

  /**
   * External identifier for the virtual machine.
   */
  external_id?: string;

  /**
   * Expression list defining group membership criteria.
   */
  readonly guest_info?: VMWareNSXGuestInfo;

  /**
   * Host system identifier.
   */
  host_id: string;

  /**
   * Local ID on host system.
   */
  local_id_on_host: string;

  /**
   * Power state of the virtual machine.
   */
  power_state: VmwareNSXVirtualMachinePowerStatesx;

  /**
   * Resource type identifier.
   */
  resource_type?: VmwareResourceTypes;

  /**
   * Tag collection for metadata and filtering.
   */
  tags?: VMWareNSXTag[] | [];
}
