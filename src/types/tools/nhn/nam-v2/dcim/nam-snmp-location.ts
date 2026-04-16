import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 SNMP Location configuration.
 * Defines physical location information for SNMP-enabled devices.
 * 
 * @example
 * ```typescript
 * const snmpLocation: NAMSnmpLocation = {
 *   name: 1,
 *   address: 'Building A, Floor 3, Rack 12'
 * };
 * ```
 */
export interface NAMSnmpLocation extends NAMDefaultFields {
  /** Location name/identifier. */
  name: number;

  /** Physical address or location description. */
  address: string;
}
