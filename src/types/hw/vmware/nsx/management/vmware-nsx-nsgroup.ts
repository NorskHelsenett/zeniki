import { VMwareNSXManagedResource } from "../shared/vmware-nsx-managed-resource";

export interface VMwareNSXNSGroup extends Partial<VMwareNSXManagedResource> {
  readonly member_count?: number; // Count of the members added to this NSGroup
  members?: []; // "Reference to the direct/static members of the NSGroup. Can be ID based expressions only. VirtualMachine cannot be added as a static member.",
  membership_criteria?: []; // "List of tag or name based expressions which define the dynamic membership criteria for this NSGroup. An object must satisfy atleast one of these expressions to qualify as a member of this group. It is not recommended to use ID based expressions in this section. ID based expression should be used in \"members\" section",
}
