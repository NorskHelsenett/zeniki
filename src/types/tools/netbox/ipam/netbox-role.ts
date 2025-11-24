/**
 * @fileoverview NetBox Role IPAM Model Type Definitions for Network Resource Classification
 * 
 * Comprehensive role model types for NetBox IP Address Management (IPAM) platform.
 * Provides complete type definitions for network resource roles used to categorize and
 * classify prefixes, VLANs, and other network objects by their purpose and function
 * within enterprise network infrastructure management systems.
 * 
 * Supports enterprise network classification with role-based organization for user
 * networks, infrastructure segments, point-to-point links, management networks, and
 * custom network categorization schemes. Essential for network documentation, planning,
 * and automated network management workflows in data center environments.
 * 
 * @version NetBox 3.7+ compatible
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/role/} NetBox Role Documentation
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/} NetBox IPAM Models
 */

import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a role definition in NetBox for categorizing network prefixes and VLANs.
 * 
 * Roles help classify the purpose or function of network resources such as user networks,
 * infrastructure segments, point-to-point links, and management networks. Essential for
 * network documentation, planning, and automated management workflows. Extends NetboxPartial
 * for common properties including timestamps and custom fields.
 * 
 * @example
 * ```typescript
 * const role: NetboxRole = {
 *   name: 'User Network',
 *   slug: 'user-network',
 *   weight: 100,
 *   description: 'End-user access networks',
 *   prefix_count: 25,
 *   vlan_count: 12
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/role/} NetBox Role Documentation
 */
export interface NetboxRole extends NetboxPartial {
  /**
   * Human-readable name of the role for identification and display purposes.
   * @maxLength 100
   * @required
   */
  name: string;

  /**
   * URL-safe slug identifier for the role, used in API endpoints and URLs.
   * @maxLength 100
   * @format Lowercase alphanumeric with hyphens
   * @required
   */
  slug: string;
  
  /**
   * Weight for ordering roles in lists and selection interfaces.
   * @minimum 0
   * @maximum 32767
   * @default 1000
   * @optional
   */
  weight?: number;
  
  /**
   * Total number of prefixes assigned to this role for capacity tracking.
   * @readonly
   * @minimum 0
   * @optional
   */
  readonly prefix_count?: number;
  
  /**
   * Total number of VLANs assigned to this role for inventory management.
   * @readonly
   * @minimum 0
   * @optional
   */
  readonly vlan_count?: number;
}
