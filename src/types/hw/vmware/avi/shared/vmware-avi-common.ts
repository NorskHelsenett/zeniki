// IP address type enum for AVI configurations
export enum VMwareAVIIpAddrType {
  IPv4 = "V4",
  IPv6 = "V6",
  DNS = "DNS",
}
// Union type of IP address types
export type VMwareAVIIpAddrTypes = "V4" | "V6" | "DNS";
