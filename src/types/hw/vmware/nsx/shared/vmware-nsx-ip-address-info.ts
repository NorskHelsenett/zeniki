import { VMwareNSXIPAddressInfoSourceValues } from "./vmware-nsx-common";

export interface VMwareNSXIPAddressInfo {
  /**
   * IP Addresses of the the virtual network interface, as discovered in the source.
   */
  ip_addresses?: string[];

  /**
   * Source of ip address information.
   */
  readonly source?: VMwareNSXIPAddressInfoSourceValues;
}
