// IP protocol version type
export type IPVersion = 4 | 6;
export type IPVersionString = "4" | "6";

// Human-readable labels for IP versions
export type IPVersionLabel = "IPv4" | "IPv6";

// IP prefix status enumeration for NetBox
export enum IPPrefixStatusValue {
    Container = "container",
    Active = "active",
    Reserved = "reserved",
    Deprecated = "deprecated"
}

// Human-readable labels for IP prefix status
export enum IPPrefixStatusLabel {
    Container = "Container",
    Active = "Active",
    Reserved = "Reserved",
    Deprecated = "Deprecated"
}
