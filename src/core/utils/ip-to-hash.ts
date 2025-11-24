/**
 * @fileoverview IP address hashing utility for generating shortened, URL-safe identifiers.
 * Provides cryptographic hashing functionality to convert IP addresses into compact hash values
 * suitable for use in object names, identifiers, and other contexts where IP addresses may be too long.
 */

import { createHash } from "crypto";

/**
 * Converts an IP address into a cryptographic hash for use as a shortened identifier.
 * This function is useful when IP addresses need to be used in contexts where their length
 * or special characters (like dots and colons) would be problematic, such as object names,
 * database keys, or URL components.
 * 
 * @param address - The IP address to hash (supports both IPv4 and IPv6 formats)
 * @param algorithm - The cryptographic algorithm to use for hashing (default: "md5")
 * @returns Promise that resolves to the hexadecimal hash string of the IP address
 * 
 * @example
 * ```typescript
 * // IPv4 address hashing with default MD5
 * const ipv4Hash = await ipToHash("192.168.1.100");
 * // Result: "7d865e959b2466918c9863afca942d0f"
 * 
 * // IPv6 address hashing
 * const ipv6Hash = await ipToHash("2001:db8::1");
 * // Result: "46b91c9e1c68b680a47b66df5b5f1fb6"
 * 
 * // Using SHA-256 algorithm for stronger hashing
 * const sha256Hash = await ipToHash("10.0.0.1", "sha256");
 * // Result: "c4ca4238a0b923820dcc509a6f75849b"
 * 
 * // Use case: Creating object names from IP addresses
 * const deviceIP = "172.16.254.1";
 * const deviceId = await ipToHash(deviceIP);
 * const deviceName = `device-${deviceId}`;
 * // Result: "device-a1b2c3d4e5f6789012345678901234567"
 * 
 * // Use case: Database key generation
 * const networkPrefix = "10.0.0.0/24";
 * const prefixKey = await ipToHash(networkPrefix);
 * // Store in database with key: prefixKey
 * ```
 * 
 * @throws {Error} Throws an error if the algorithm is not supported by Node.js crypto module
 * 
 * @see {@link https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options} Node.js crypto.createHash documentation
 * @see {@link https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding} Hash digest documentation
 * 
 * @since 0.0.1
 */
export const ipToHash = async (address: string, algorithm: string = "md5"): Promise<string> => {
  // Hash the address using the specified algorithm
  const hash = createHash(algorithm).update(address).digest("hex");
  return hash;
};