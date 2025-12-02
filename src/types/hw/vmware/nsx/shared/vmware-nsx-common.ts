// VMware NSX realization state enumeration
export enum VMwareRealizationState {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

// String literal union for realization states
export type VMwareRealizationStates = "IN_PROGRESS" | "SUCCESS" | "FAILURE";

// VMware NSX resource type enumeration
export enum VMwareResourceType {}

// String literal union for resource types
export type VMwareResourceTypes =
  | "Group"
  | "NSGroup"
  | "VirtualMachine"
  | "TagBulkOperation"
  | "Rule"
  | "Expression";

// String literal union for group types
export type VMwareGroupTypes = "IPAddress" | "ANTREA";

// String literal union for expression resource types
// HEAD
export type VMwareExpressionResourceTypes =
  | "Condition"
  | "ConjunctionOperator"
  | "NestedExpression"
  | "IPAddressExpression"
  | "MACAddressExpression"
  | "ExternalIDExpression"
  | "PathExpression"
  | "IdentityGroupExpression"
  | "GroupScopeExpression";

// String literal union for condition expression member types
export type VMwareExpressionMemberTypes =
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
export type VMwareExternalIDExpressionTypes =
  | "VirtualMachine"
  | "VirtualNetworkInterface"
  | "CloudNativeServiceInstance"
  | "PhysicalServer";

// String literal union for expression operators
export type VMwareExpressionOperatorTypes =
  | "EQUALS"
  | "CONTAINS"
  | "STARTSWITH"
  | "ENDSWITH"
  | "NOTEQUALS"
  | "NOTIN"
  | "MATCHES"
  | "IN";

// String literal union for expression scope operators
export type VMwareExpressionScopeOperatorTypes = "EQUALS" | "NOTEQUALS";

// String literal union for conjunction operators
export type VMwareExpressionConjunctionOperatorTypes = "AND" | "OR";

// String literal union for expression key types
export type VMwareExpressionKeyTypes =
  | "Tag"
  | "Name"
  | "OSName"
  | "ComputerName"
  | "NodeType"
  | "GroupType"
  | "ALL"
  | "IPAddress"
  | "PodCidr";

export type VMwareProtectionStatuses =
  | "PROTECTED"
  | "NOT_PROTECTED"
  | "REQUIRE_OVERRIDE"
  | "UNKNOWN";

// String literal union for virtual machine power state
export type VMwareNSXVirtualMachinePowerStates =
  | "VM_RUNNING"
  | "VM_STOPPED"
  | "VM_SUSPENDED"
  | "VM_UNKNOWN";

// String literal union for scope types
export type VMwareNSXScopeTypes = "CONTAINER_CLUSTER" | "VPC" | "PROJECT";

// String literal union for virtual machine types
export type VMwareNSXVirtualMachineTypes =
  | "EDGE"
  | "SERVICE"
  | "REGULAR"
  | "MP"
  | "INTELLIGENCE"
  | "VC_SYSTEM"
  | "UNKNOWN";

// String literal union for Unified Packet Trace V2 enabled values
export type VMwareNSXUnifiedPacketTraceV2Values = "NONE" | "true" | "false";
