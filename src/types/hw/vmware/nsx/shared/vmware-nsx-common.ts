// VMware NSX realization state enumeration
export enum VmwareRealizationState {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

// String literal union for realization states
export type VmwareRealizationStates = "IN_PROGRESS" | "SUCCESS" | "FAILURE";

// VMware NSX resource type enumeration
export enum VmwareResourceType {}

// String literal union for resource types
export type VmwareResourceTypes =
  | "Group"
  | "NSGroup"
  | "VirtualMachine"
  | "TagBulkOperation"
  | "Rule"
  | "Expression";

// String literal union for group types
export type VmwareGroupTypes = "IPAddress" | "ANTREA";

// String literal union for expression resource types
export type VmwareExpressionResourceTypes =
  | "Condition"
  | "ConjunctionOperator"
  | "NestedExpression"
  | "IPAddressExpression"
  | "MACAddressExpression"
  | "ExternalIDExpression"
  | "PathExpression"
  | "IdentityGroupExpression";

// String literal union for condition expression member types
export type VmwareExpressionMemberTypes =
  | "IPSet"
  | "VirtualMachine"
  | "LogicalPort"
  | "LogicalSwitch"
  | "Segment"
  | "SegmentPort"
  | "Pod"
  | "Service"
  | "Namespace"
  | "TransportNode"
  | "Group"
  | "DVPG"
  | "DVPort"
  | "IPAddress"
  | "VpcSubnet"
  | "KubernetesCluster"
  | "KubernetesNamespace"
  | "AntreaEgress"
  | "AntreaIPPool"
  | "KubernetesIngress"
  | "KubernetesGateway"
  | "KubernetesService"
  | "KubernetesNode"
  | "VpcSubnetPort";
// String literal union for external ID expression types
export type VmwareExternalIDExpressionTypes =
  | "VirtualMachine"
  | "VirtualNetworkInterface"
  | "CloudNativeServiceInstance"
  | "PhysicalServer";

// String literal union for expression operators
export type VmwareExpressionOperatorTypes =
  | "EQUALS"
  | "CONTAINS"
  | "STARTSWITH"
  | "ENDSWITH"
  | "NOTEQUALS"
  | "NOTIN"
  | "MATCHES"
  | "IN";

// String literal union for expression scope operators
export type VmwareExpressionScopeOperatorTypes = "EQUALS" | "NOTEQUALS";

// String literal union for conjunction operators
export type VmwareExpressionConjunctionOperatorTypes = "AND" | "OR";

// String literal union for expression key types
export type VmwareExpressionKeyTypes =
  | "Tag"
  | "Name"
  | "OSName"
  | "ComputerName"
  | "NodeType"
  | "GroupType"
  | "ALL"
  | "IPAddress"
  | "PodCidr";

// String literal union for protection statuses
export type VmwareProtectionStatuses =
  | "PROTECTED"
  | "NOT_PROTECTED"
  | "REQUIRE_OVERRIDE"
  | "UNKNOWN";

// String literal union for virtual machine power state
export type VmwareNSXVirtualMachinePowerStatesx =
  | "VM_RUNNING"
  | "VM_STOPPED"
  | "VM_SUSPENDED"
  | "VM_UNKNOWN";
