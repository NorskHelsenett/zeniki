export enum VmwareRealizationState {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export type VmwareRealizationStates = "IN_PROGRESS" | "SUCCESS" | "FAILURE";


export enum VmwareResourceType {

}

export type VmwareResourceTypes = "Group" | "NSGroup" | "VirtualMachine" | "TagBulkOperation" | "Rule" | "Expression";

export type VmwareGroupTypes = "IPAddress" | "ANTREA";

// default is "Condition", all after that are subtypes
export type VmwareExpressionResourceTypes = "Condition" | "ConjunctionOperator" | "NestedExpression" | "IPAddressExpression" | "MACAddressExpression" | "ExternalIDExpression" | "PathExpression" | "IdentityGroupExpression";

// Member types for Condition expressions
export type VmwareExpressionMemberTypes = "IPSet" | "VirtualMachine" | "LogicalPort" | "LogicalSwitch" | "Segment" | "SegmentPort" | "Pod" | "Service" | "Namespace" | "TransportNode" | "Group" | "DVPG" | "DVPort" | "IPAddress" | "VpcSubnet" | "KubernetesCluster" | "KubernetesNamespace" | "AntreaEgress" | "AntreaIPPool" | "KubernetesIngress" | "KubernetesGateway" | "KubernetesService" | "KubernetesNode" | "VpcSubnetPort";
// Member types for ExternalIDExpression
export type VmwareExternalIDExpressionTypes = "VirtualMachine" | "VirtualNetworkInterface" | "CloudNativeServiceInstance" | "PhysicalServer";

export type VmwareExpressionOperatorTypes = "EQUALS" |  "CONTAINS" | "STARTSWITH" | "ENDSWITH" | "NOTEQUALS" | "NOTIN" | "MATCHES" | "IN";

export type VmwareExpressionScopeOperatorTypes = "EQUALS" | "NOTEQUALS";

export type VmwareExpressionConjunctionOperatorTypes = "AND" | "OR";

export type VmwareExpressionKeyTypes = "Tag" | "Name" | "OSName" | "ComputerName" | "NodeType" | "GroupType" | "ALL" | "IPAddress" | "PodCidr";

export type VmwareProtectionStatuses = "PROTECTED" | "NOT_PROTECTED" | "REQUIRE_OVERRIDE" | "UNKNOWN";