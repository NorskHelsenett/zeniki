import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import {
  NetboxRackAirFlow,
  NetboxRackFace,
  NetboxOperationalStatus,
  NetboxOperationalStatuses,
  NetboxValueLabel,
  NetboxRackAirFlows,
  NetboxRackFaces,
} from "../shared/netbox-value-label";
import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxDeviceRole } from "./netbox-device-role";
import { NetboxDeviceType } from "./netbox-device-type";
import { NetBoxPlatform } from "./netbox-platform";
import { NetboxSite } from "./netbox-site";

/**
 * NetBox physical device for DCIM.
 * Represents network equipment, servers, and infrastructure components
 * within data center sites, racks, and locations.
 *
 * @example
 * ```typescript
 * const device: NetboxDevice = {
 *   name: 'switch-01',
 *   device_type: 42,
 *   role: 1,
 *   site: 3,
 *   rack: 10,
 *   position: 42,
 *   status: 'active',
 *   serial: 'ABC123456'
 * };
 * ```
 */
export interface NetboxDevice extends NetboxPartial {
  /**
   * Device name.
   * @maxLength 64
   */
  name?: string | null;

  /** Device type defining hardware model and specifications. */
  device_type: number | Readonly<NetboxDeviceType>;

  /** Functional role in network infrastructure. */
  role: number | Readonly<NetboxDeviceRole>;

  /**
   * Alias for role field.
   * @readonly
   * @deprecated since version 3.6
   */
  readonly device_role?: number | Partial<NetboxDeviceRole>;

  /** Tenant that owns this device. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;

  /** Software platform. */
  platform?: number | Readonly<Partial<NetBoxPlatform>> | null;

  /**
   * Manufacturer serial number.
   * @maxLength 50
   */
  serial?: string | null;

  /**
   * Internal asset tag.
   * @maxLength 50
   */
  asset_tag?: string | null;

  /** Physical site location. */
  site: number | Readonly<Partial<NetboxSite>>;

  /** Specific location within site. */
  location?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Physical rack. */
  rack?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Rack unit position. */
  position?: number | null;

  /** Mounting orientation in rack. */
  face?: NetboxRackFaces | NetboxRackFace |  Readonly<NetboxValueLabel<NetboxRackFaces, string>>;

  /**
   * Latitude coordinate.
   * @minimum -100
   * @maximum 100
   */
  latitude?: number | null;

  /**
   * Longitude coordinate.
   * @minimum -1000
   * @maximum 1000
   */
  longitude?: number | null;

  /**
   * Parent device for modular equipment.
   * @readonly
   */
  readonly parent_device?: number | Partial<NetboxDevice>;

  /** Operational status. */
  status: NetboxOperationalStatuses | NetboxOperationalStatus | Readonly<NetboxValueLabel<NetboxOperationalStatuses, string>>;

  /** Airflow direction for cooling. */
  airflow?: NetboxRackAirFlows |NetboxRackAirFlow | Readonly<NetboxValueLabel<NetboxRackAirFlows, string>> | null;

  /**
   * Primary IP address for management.
   * @readonly
   */
  readonly primary_ip?: number | Partial<NetboxGeneric> | null;

  /** Primary IPv4 address. */
  primary_ip4?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Primary IPv6 address. */
  primary_ip6?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Out-of-band management IP. */
  oob_ip?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Virtualization cluster. */
  cluster?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Virtual chassis. */
  virtual_chassis?: number | Readonly<Partial<NetboxGeneric>> | null;

  /**
   * Virtual chassis position.
   * @minimum 0
   * @maximum 255
   */
  vc_position?: number | null;

  /**
   * Virtual chassis priority.
   * @minimum 0
   * @maximum 255
   */
  vc_priority?: number | null;

  /** Configuration template. */
  config_template?: number | Readonly<Partial<NetboxGeneric>> | null;

  /**
   * Computed configuration context.
   * @readonly
   */
  readonly config_context?: object | null;

  /** Device-specific configuration context. */
  local_context_data?: object | null;

  /**
   * Console port count.
   * @readonly
   */
  readonly console_port_count?: number;

  /**
   * Console server port count.
   * @readonly
   */
  readonly console_server_port_count?: number;

  /**
   * Power port count.
   * @readonly
   */
  readonly power_port_count?: number;

  /**
   * Power outlet count.
   * @readonly
   */
  readonly power_outlet_count?: number;

  /**
   * Network interface count.
   * @readonly
   */
  readonly interface_count?: number;

  /**
   * Front panel port count.
   * @readonly
   */
  readonly front_port_count?: number;

  /**
   * Rear panel port count.
   * @readonly
   */
  readonly rear_port_count?: number;

  /**
   * Device bay count.
   * @readonly
   */
  readonly device_bay_count?: number;

  /**
   * Module bay count.
   * @readonly
   */
  readonly module_bay_count?: number;

  /**
   * Inventory item count.
   * @readonly
   */
  readonly inventory_item_count?: number;
}
