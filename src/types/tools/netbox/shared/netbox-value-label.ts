/**
 * @fileoverview Generic value-label pair type for NetBox API responses.
 * 
 * Provides standardized structure for representing data with both machine-readable values
 * and human-readable labels, commonly used throughout NetBox REST API responses. Includes
 * comprehensive enumerations for operational status, rack mounting configurations, airflow
 * patterns, device relationships, and measurement units supporting enterprise data center
 * infrastructure management and standardized DCIM operations.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/} NetBox REST API Documentation
 */

/**
 * Generic type representing an immutable value-label pair structure used throughout NetBox API responses.
 * 
 * Standard pattern providing both machine-readable values for API operations and human-readable
 * labels for user interface display. Both properties are readonly to ensure data immutability
 * and prevent accidental modifications to API response data. Used extensively across NetBox
 * interfaces for consistent data representation with type safety, API consistency, and UI
 * integration capabilities.
 * 
 * @template V The type of the machine-readable value (e.g., string, number, enum)
 * @template L The type of the human-readable label (typically string)
 * @example
 * ```typescript
 * const ipVersion: NetboxValueLabel<IPVersion, IPVersionLabel> = {
 *   value: 4,
 *   label: "IPv4"
 * };
 * 
 * const status: NetboxValueLabel<NetboxPrefixStatus, string> = {
 *   value: NetboxPrefixStatus.Active,
 *   label: "Active"
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/} NetBox REST API Documentation
 */
export type NetboxValueLabel<V, L> = {
  /**
   * The machine-readable value used for API operations and data processing.
   * @readonly
   */
  readonly value: V;

  /**
   * The human-readable label for display in user interfaces.
   * @readonly
   */
  readonly label: L;
};

/**
 * Physical mounting face options for rack-mounted devices.
 */
export enum NetboxRackFace {
  /** Device mounts facing the front of the rack (standard configuration) */
  Front = "front",
  /** Device mounts facing the rear of the rack (reverse mounting) */
  Back = "back",
}

/**
 * String literal type alias for rack mounting face values.
 */
export type NetboxRackFaces = "front" | "back";

/**
 * Operational status values for devices and infrastructure components.
 */
export enum NetboxOperationalStatus {
  /** Device is offline and not operational */
  Offline = "offline",
  /** Device is active and operational */
  Active = "active",
  /** Device is planned for future deployment */
  Planned = "planned",
  /** Device is staged and ready for deployment */
  Staged = "staged",
  /** Device has failed and requires attention */
  Failed = "failed",
  /** Device is in inventory but not deployed */
  Inventory = "inventory",
  /** Device is being decommissioned */
  Decommissioning = "decommissioning",
}

/**
 * String literal type alias for operational status values.
 */
export type NetboxOperationalStatuses =
  | "offline"
  | "active"
  | "planned"
  | "staged"
  | "failed"
  | "inventory"
  | "decommissioning";

/**
 * Airflow direction patterns for data center thermal management.
 */
export enum NetboxRackAirFlow {
  /** Hot aisle/cold aisle: air flows from front intake to rear exhaust */
  "Front to rear" = "front-to-rear",
  /** Reverse airflow: air flows from rear to front */
  "Rear to front" = "rear-to-front",
  /** Side-to-side airflow from left to right */
  "Left to right" = "left-to-right",
  /** Side-to-side airflow from right to left */
  "Right to left" = "right-to-left",
  /** Air enters from sides and exits at rear */
  "Side to rear" = "side-to-rear",
  /** No active airflow (passive cooling) */
  Passive = "passive",
  /** Multiple airflow patterns within the device */
  Mixed = "mixed",
}

/**
 * String literal type alias for airflow direction values.
 */
export type NetboxRackAirFlows =
  | "front-to-rear"
  | "rear-to-front"
  | "left-to-right"
  | "right-to-left"
  | "side-to-rear"
  | "passive"
  | "mixed";

/**
 * Sub-device role for modular and chassis-based systems.
 */
export enum NetboxSubDeviceRole {
  /** Parent chassis that houses child modules */
  Parent = "parent",
  /** Child module that installs in parent chassis */
  Child = "child",
}

/**
 * String literal type alias for sub-device role values.
 */
export type NetboxSubDeviceRoles = "parent" | "child";

/**
 * Weight measurement units for device specifications.
 */
export enum NetboxWeightUnit {
  /** Kilograms (metric system) */
  Kilograms = "kg",
  /** Grams (metric system) */
  Grams = "g",
  /** Pounds (imperial system) */
  Pounds = "lb",
  /** Ounces (imperial system) */
  Ounces = "oz",
}

/**
 * String literal type alias for weight unit values.
 */
export type NetboxWightUnits = "kg" | "g" | "lb" | "oz";


