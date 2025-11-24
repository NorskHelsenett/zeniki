/**
 * @fileoverview IP address and prefix-related type definitions for network management.
 * 
 * Contains types and enums for IP version handling and prefix status management in NetBox
 * integrations. Provides standardized IP protocol version types and NetBox prefix status
 * enumerations for consistent network infrastructure management across enterprise deployments.
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * Represents the IP protocol version (IPv4 or IPv6).
 */
export type IPVersion = 4 | 6;
export type IPVersionString = "4" | "6";

/**
 * Human-readable labels for IP protocol versions.
 */
export type IPVersionLabel = "IPv4" | "IPv6";

/**
 * Enumeration of possible status values for IP prefixes in NetBox.
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/prefix/#status} NetBox Prefix Status Documentation
 */
export enum IPPrefixStatusValue {
    /** Prefix serves as a container for subdividing into smaller prefixes */
    Container = "container",
    
    /** Prefix is actively in use and available for IP address allocation */
    Active = "active",
    
    /** Prefix is reserved for future use but not currently active */
    Reserved = "reserved",
    
    /** Prefix is deprecated and should not be used for new allocations */
    Deprecated = "deprecated"
}

/**
 * Human-readable labels corresponding to IP prefix status values.
 */
export enum IPPrefixStatusLabel {
    /** Display label for container prefix status */
    Container = "Container",
    
    /** Display label for active prefix status */
    Active = "Active",
    
    /** Display label for reserved prefix status */
    Reserved = "Reserved",
    
    /** Display label for deprecated prefix status */
    Deprecated = "Deprecated"
}
