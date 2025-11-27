import { createHash } from "crypto";

/**
 * Converts an IP address into a cryptographic hash for use as a shortened identifier.
 * @param address - The IP address to hash (IPv4 or IPv6)
 * @param algorithm - The cryptographic algorithm (default: "md5")
 * @returns Promise resolving to hexadecimal hash string
 * @example
 * ```typescript
 * const hash = await ipToHash("192.168.1.100");
 * const deviceName = `device-${hash}`;
 * ```
 */
export const ipToHash = async (address: string, algorithm: string = "md5"): Promise<string> => {
  // Hash the address using the specified algorithm
  const hash = createHash(algorithm).update(address).digest("hex");
  return hash;
};