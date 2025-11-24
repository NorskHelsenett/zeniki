/**
 * @fileoverview Core Zeniki library class for package metadata and version management.
 * 
 * Provides access to library information including version, name, and user agent string
 * for HTTP client identification in API requests across all Zeniki drivers.
 */

import packageInfo from "../../package.json";

/**
 * Main Zeniki library class providing package metadata and version information.
 * Used to retrieve library details for logging, debugging, and HTTP user agent headers.
 * 
 * @class Zeniki
 * @since 0.0.1
 * 
 * @example
 * ```typescript
 * import { Zeniki } from '@norskhelsenett/zeniki';
 * 
 * const zeniki = new Zeniki();
 * console.log(zeniki.version()); // "1.0.0"
 * console.log(zeniki.name()); // "zeniki"
 * console.log(zeniki.userAgent()); // "Zeniki/1.0.0"
 * ```
 */
export class Zeniki {
  constructor() {

  }

  /**
   * Returns the current version of the Zeniki library from package.json.
   * 
   * @returns {string} Semantic version string (e.g., "1.0.0")
   * 
   * @example
   * ```typescript
   * const zeniki = new Zeniki();
   * const version = zeniki.version(); // "1.0.0"
   * ```
   */
  public version(): string {
    return packageInfo.version;
  }

  /**
   * Returns the library name without the npm scope prefix.
   * Extracts "zeniki" from "@norskhelsenett/zeniki".
   * 
   * @returns {string} Library name without scope
   * 
   * @example
   * ```typescript
   * const zeniki = new Zeniki();
   * const name = zeniki.name(); // "zeniki"
   * ```
   */
  public name(): string {
    return packageInfo.name.split("/")[1];
  }

  /**
   * Generates a user agent string for HTTP client identification.
   * Formats as "LibraryName/Version" following HTTP user agent conventions.
   * 
   * @returns {string} Formatted user agent string
   * 
   * @example
   * ```typescript
   * const zeniki = new Zeniki();
   * const ua = zeniki.userAgent(); // "Zeniki/1.0.0"
   * 
   * // Use in HTTP headers
   * const driver = new NetboxDriver({
   *   baseURL: 'https://netbox.example.com/api',
   *   headers: {
   *     'User-Agent': new Zeniki().userAgent()
   *   }
   * });
   * ```
   */
  public userAgent = (): string => {
    let name = packageInfo.name.split("/")[1];
    return `${name.charAt(0).toUpperCase() + name.slice(1)}/${
      packageInfo.version
    }`;
  };
}
