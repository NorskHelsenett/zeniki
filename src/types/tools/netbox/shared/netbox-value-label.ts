/**
 * Value-label pair for NetBox API responses.
 * Combines machine-readable values with human-readable labels.
 *
 * @example
 * ```typescript
 * const status: NetboxValueLabel<string, string> = {
 *   value: "active",
 *   label: "Active"
 * };
 * ```
 */
export type NetboxValueLabel<V, L> = {
  /**
   * Machine-readable value.
   * @readonly
   */
  readonly value: V;

  /**
   * Human-readable label.
   * @readonly
   */
  readonly label: L;
};

// Rack mounting face enumeration
export enum NetboxRackFace {
  Front = "front",
  Back = "back",
}

// String literal union for rack face values
export type NetboxRackFaces = "front" | "back";

// Device operational status enumeration
export enum NetboxOperationalStatus {
  Offline = "offline",
  Active = "active",
  Planned = "planned",
  Staged = "staged",
  Failed = "failed",
  Inventory = "inventory",
  Decommissioning = "decommissioning",
}

// String literal union for operational status values
export type NetboxOperationalStatuses =
  | "offline"
  | "active"
  | "planned"
  | "staged"
  | "failed"
  | "inventory"
  | "decommissioning";

// Airflow direction enumeration
export enum NetboxRackAirFlow {
  "Front to rear" = "front-to-rear",
  "Rear to front" = "rear-to-front",
  "Left to right" = "left-to-right",
  "Right to left" = "right-to-left",
  "Side to rear" = "side-to-rear",
  Passive = "passive",
  Mixed = "mixed",
}

// String literal union for airflow values
export type NetboxRackAirFlows =
  | "front-to-rear"
  | "rear-to-front"
  | "left-to-right"
  | "right-to-left"
  | "side-to-rear"
  | "passive"
  | "mixed";

// Sub-device role enumeration
export enum NetboxSubDeviceRole {
  Parent = "parent",
  Child = "child",
}

// String literal union for sub-device role values
export type NetboxSubDeviceRoles = "parent" | "child";

// Weight unit enumeration
export enum NetboxWeightUnit {
  Kilograms = "kg",
  Grams = "g",
  Pounds = "lb",
  Ounces = "oz",
}

// String literal union for weight unit values
export type NetboxWightUnits = "kg" | "g" | "lb" | "oz";


