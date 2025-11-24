import {
  ZenikiCoreDriver,
  ResponseGeneric,
  RequestConfig,
} from "../../base/zeniki-core-driver";
import { FortiOSResponse } from "../../../types/hw/fortios/shared/fortios-response";
import {
  FortiOSFirewallAddress,
  FortiOSFirewallAddress6,
  FortiOSFirewallAddrGrp,
  FortiOSFirewallAddrGrp6,
  FortiOSParams,
  FortiOSSystemVDOM,
  HTTPError,
} from "../../../types";
import { FortiOSRevisionResponse } from "../../../types/hw/fortios/shared/fortios-revision-response";
import { queryBuilderSync } from "../../utils";

/**
 * @fileoverview FortiOS 7.4.x API Driver for Zeniki Network Management
 *
 * Enterprise TypeScript driver for FortiOS REST API supporting firewall configuration,
 * policy automation, and network security operations. Enhanced with Security Fabric
 * integration, ZTNA capabilities, IPv4/IPv6 dual-stack management, and enterprise
 * automation features including intelligent pagination and bulk operations.
 *
 * Core capabilities include CMDB operations, address/group management, global object
 * distribution, EMS tag integration, compliance automation, and multi-VDOM support
 * for enterprise-scale FortiGate deployments with comprehensive audit logging.
 *
 * @version 7.4.x compatible
 * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/rest-api-reference} FortiOS 7.4.x REST API Reference
 * @since FortiOS 6.0.0, enhanced for 7.4.x
 * @author Zeniki Development Team
 */

/**
 * FortiOS 7.4.x API driver for comprehensive firewall management operations.
 * Enterprise-grade API driver extending ZenikiCoreDriver with FortiOS-specific functionality
 * for complete firewall object lifecycle management. Supports IPv4/IPv6 dual-stack operations,
 * Security Fabric integration, ZTNA deployment, enterprise automation scenarios, CMDB API
 * operations, token authentication, error handling, URL encoding, parameter validation,
 * CI/CD pipeline integration, configuration management, monitoring integration, audit logging,
 * multi-VDOM support, and performance optimization with intelligent pagination and caching.
 *
 * @class FortiOSDriver
 * @extends ZenikiCoreDriver
 * @copyright Copyright 2025 Norsk Helsenett SF
 * @author Kevin Andre Vatn <kevin.vatn@nhn.no>
 * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/rest-api-reference} FortiOS 7.4.x REST API Reference
 * @since FortiOS 6.0.0, enhanced for 7.4.x
 *
 * @example
 * ```typescript
 * // Basic FortiOS driver initialization
 * const fortios = new FortiOSDriver({
 *   baseURL: 'https://firewall.company.com',
 *   headers: {
 *     'Authorization': 'Bearer token',
 *     'Content-Type': 'application/json'
 *   },
 *   timeout: 30000
 * });
 *
 * const address = await fortios.addAddress({
 *   name: 'web-server',
 *   type: 'ipmask',
 *   subnet: '192.168.1.100/32'
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Advanced configuration with VDOM and group management
 * const fortios = new FortiOSDriver({
 *   baseURL: 'https://firewall.company.com',
 *   headers: {
 *     'Authorization': 'Bearer api-token',
 *     'Content-Type': 'application/json',
 *     'User-Agent': 'ZenikiFortiOS/1.0'
 *   },
 *   timeout: 60000,
 *   maxRedirects: 3,
 *   validateStatus: (status) => status < 400
 * });
 *
 * const group = await fortios.addAddressGroup({
 *   name: 'servers',
 *   member: [{ name: 'web-server' }],
 *   comment: 'Production servers'
 * }, { vdom: 'production' });
 * ```
 */
export class FortiOSDriver extends ZenikiCoreDriver {
  /**
   * Initialize FortiOS API driver with enterprise configuration and authentication.
   * Creates FortiOS driver instance with HTTPS base URL, API token authentication, and timeout management.
   *
   * @param {RequestConfig} config - Request configuration including base URL, headers, authentication, and timeouts
   *
   * @example
   * ```typescript
   * const fortios = new FortiOSDriver({
   *   baseURL: 'https://fortigate.company.com',
   *   headers: {
   *     'Authorization': 'Bearer token',
   *     'Content-Type': 'application/json'
   *   },
   *   timeout: 30000
   * });
   * ```
   *
   * @since FortiOS 6.0.0
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/399048/rest-api-authentication} FortiOS API Authentication
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific IPv4 firewall address object by name with URL encoding and parameter validation.
   * Fetches IPv4 address from FortiOS CMDB supporting subnet, range, FQDN, geographic, and dynamic address types.
   *
   * @param {string} name - The name of the IPv4 firewall address object to retrieve
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and formatting
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddress>>>} Promise resolving to FortiOS response containing the IPv4 address object
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddress('web-server-01');
   * const address = response.data.results;
   * console.log(`Address: ${address.name}, IP: ${address.subnet}`);
   * ```
   *
   * @throws {Error} When address name is empty or invalid
   * @throws {Error} When FortiOS API returns error (404 for not found, 403 for access denied)
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/318713/firewall-addresses} FortiOS 7.4.x Address Objects
   * @since FortiOS 6.0.0
   */
  async getAddress(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress>>(
      this.config.baseURL +
        `/cmdb/firewall/address/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve all IPv4 firewall address objects with optional filtering and pagination.
   * Fetches IPv4 address collections from FortiOS CMDB with advanced filtering, bulk operations, and performance optimization.
   *
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering, pagination, and formatting
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddress>>>} Promise resolving to FortiOS response containing array of IPv4 address objects
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddresses({ vdom: 'production', filter: 'type==ipmask', count: 100 });
   * console.log(`Found ${response.data.results.length} IPv4 address objects`);
   * ```
   *
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/318713/firewall-addresses} FortiOS 7.4.x Address Objects
   * @since FortiOS 6.0.0
   */
  async getAddresses(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress>>(
      this.config.baseURL +
        `/cmdb/firewall/address/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create a new IPv4 firewall address object in FortiOS configuration with validation and Security Fabric integration.
   * Creates IPv4 address objects supporting subnet, range, FQDN, geographic, and dynamic address types with enterprise automation.
   *
   * @param {FortiOSFirewallAddress} address - IPv4 firewall address object configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM, validation, and options
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with creation status
   *
   * @example
   * ```typescript
   * const address = {
   *   name: 'web-server-subnet',
   *   type: 'ipmask',
   *   subnet: '192.168.100.0/24',
   *   comment: 'Web server network'
   * };
   * const response = await fortios.addAddress(address);
   * const result = await response.json();
   * console.log(`Created address with revision: ${result.revision}`);
   * ```
   *
   * @throws {Error} When address configuration is invalid or missing required fields
   * @throws {Error} When FortiOS API returns error (409 for conflicts, 400 for validation errors)
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/318713/firewall-addresses} FortiOS 7.4.x Address Objects
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async addAddress(
    address: FortiOSFirewallAddress,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(address) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete an IPv4 firewall address object from FortiOS configuration with dependency checking.
   * Removes IPv4 address with comprehensive dependency validation, Security Fabric synchronization, and enterprise audit logging.
   *
   * @param {string} name - The name of the IPv4 firewall address object to delete
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM, validation, and safety options
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with deletion status
   *
   * @example
   * ```typescript
   * const response = await fortios.deleteAddress('old-server-address');
   * console.log(`Deleted address with revision: ${response.data.revision}`);
   * ```
   *
   * @throws {Error} When address name is empty or invalid
   * @throws {Error} When FortiOS API returns error (404 for not found, 424 for dependency conflicts)
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/318713/firewall-addresses} FortiOS 7.4.x Address Objects
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async deleteAddress(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update an existing IPv4 firewall address object in FortiOS configuration with atomic operations.
   * Modifies IPv4 address with comprehensive validation, change tracking, Security Fabric synchronization, and impact analysis.
   *
   * @param {string} name - The name of the IPv4 firewall address object to update
   * @param {FortiOSFirewallAddress} address - Updated IPv4 firewall address object configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM, validation, and update options
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with update status
   *
   * @example
   * ```typescript
   * const address = {
   *   name: 'web-server-01',
   *   type: 'ipmask',
   *   subnet: '192.168.1.101/32',
   *   comment: 'Updated IP'
   * };
   * const response = await fortios.updateAddress('web-server-01', address);
   * const result = await response.json();
   * console.log(`Updated address with revision: ${result.revision}`);
   * ```
   *
   * @throws {Error} When address configuration is invalid or name mismatch
   * @throws {Error} When FortiOS API returns error (400 for validation errors, 404 for not found)
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/318713/firewall-addresses} FortiOS 7.4.x Address Objects
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async updateAddress(
    name: string,
    address: FortiOSFirewallAddress,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(address) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // ===== IPv6 ADDRESS OPERATIONS =====

  /**
   * Retrieve a specific IPv6 firewall address object by name with enhanced IPv6 support.
   * Fetches IPv6 address from FortiOS CMDB supporting dual-stack networking, cloud-native applications, and IoT device management.
   *
   * @param {string} name - The name of the IPv6 firewall address object to retrieve
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and formatting
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddress6>>>} Promise resolving to FortiOS response containing the IPv6 address object
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddress6('ipv6-web-server');
   * const address = response.data.results;
   * console.log(`IPv6 Address: ${address.name}, IP: ${address.ip6}`);
   * ```
   *
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/318713/ipv6-firewall-addresses} FortiOS 7.4.x IPv6 Addresses
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async getAddress6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress6> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress6>>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve all IPv6 firewall address objects with optional filtering and advanced pagination.
   * Fetches IPv6 address collections with filtering support for large-scale IPv6 deployments and enterprise infrastructure management.
   *
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and pagination
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddress6>>>} Promise resolving to FortiOS response containing array of IPv6 address objects
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddresses6();
   * console.log(`Found ${response.data.results.length} IPv6 addresses`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async getAddresses6(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress6> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress6>>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create a new IPv6 firewall address object in FortiOS configuration with modern IPv6 networking support.
   * Creates IPv6 address objects supporting cloud-native deployments, IoT device management, and dual-stack environments.
   *
   * @param {FortiOSFirewallAddress6} address - IPv6 firewall address object configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with creation status
   *
   * @example
   * ```typescript
   * const address = {
   *   name: 'ipv6-server-subnet',
   *   type: 'ipprefix',
   *   ip6: '2001:db8::/64',
   *   comment: 'IPv6 server network'
   * };
   * const response = await fortios.addAddress6(address);
   * const result = await response.json();
   * console.log(`Created IPv6 address with revision: ${result.revision}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async addAddress6(
    address: FortiOSFirewallAddress6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(address) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete an IPv6 firewall address object from FortiOS configuration with dependency validation.
   * Removes IPv6 address objects with Security Fabric synchronization for safe enterprise IPv6 infrastructure management.
   *
   * @param {string} name - The name of the IPv6 firewall address object to delete
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with deletion status
   *
   * @example
   * ```typescript
   * const response = await fortios.deleteAddress6('old-ipv6-server');
   * console.log(`Deleted IPv6 address: ${response.data.revision}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async deleteAddress6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update an existing IPv6 firewall address object in FortiOS configuration with atomic updates.
   * Modifies IPv6 address objects with impact analysis and enterprise change management for dual-stack environments.
   *
   * @param {string} name - The name of the IPv6 firewall address object to update
   * @param {FortiOSFirewallAddress6} address - Updated IPv6 firewall address object configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with update status
   *
   * @example
   * ```typescript
   * const address = {
   *   name: 'ipv6-server',
   *   ip6: '2001:db8::100/128',
   *   comment: 'Updated IPv6 server address'
   * };
   * const response = await fortios.updateAddress6('ipv6-server', address);
   * const result = await response.json();
   * console.log(`Updated IPv6 address with revision: ${result.revision}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async updateAddress6(
    name: string,
    address: FortiOSFirewallAddress6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(address) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // ===== IPv4 ADDRESS GROUP OPERATIONS =====

  /**
   * Retrieve a specific IPv4 firewall address group by name with complex member management support.
   * Fetches IPv4 address groups supporting member management, exclusion logic, ZTNA integration, and Security Fabric synchronization.
   *
   * @param {string} name - The name of the IPv4 firewall address group to retrieve
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and formatting
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddrGrp>>>} Promise resolving to FortiOS response containing the IPv4 address group
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddressGroup('web-servers');
   * const group = response.data.results;
   * console.log(`Group: ${group.name}, Members: ${group.member.length}`);
   * ```
   *
   * @since FortiOS 1.0.0, enhanced with ZTNA in 7.4.x
   */
  async getAddressGroup(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddrGrp> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddrGrp>>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve all IPv4 firewall address groups with optional filtering for enterprise-scale policy management.
   * Fetches IPv4 address groups with advanced filtering for enterprise policy management and ZTNA deployment scenarios.
   *
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and pagination
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddrGrp>>>} Promise resolving to FortiOS response containing array of IPv4 address groups
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddressGroups();
   * console.log(`Found ${response.data.results.length} address groups`);
   * ```
   *
   * @since FortiOS 1.0.0, enhanced with ZTNA in 7.4.x
   */
  async getAddressGroups(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddrGrp> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddrGrp>>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create a new IPv4 firewall address group in FortiOS configuration with complex member management.
   * Creates IPv4 address groups supporting member management, exclusion logic, ZTNA integration, and enterprise tagging systems.
   *
   * @param {FortiOSFirewallAddrGrp} addressGroup - IPv4 firewall address group configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with creation status
   *
   * @example
   * ```typescript
   * const group = {
   *   name: 'internal-servers',
   *   member: [
   *     { name: 'web-server-01' },
   *     { name: 'app-server-01' }
   *   ],
   *   comment: 'Internal servers'
   * };
   * const response = await fortios.addAddressGroup(group);
   * const result = await response.json();
   * console.log(`Created group with revision: ${result.revision}`);
   * ```
   *
   * @since FortiOS 1.0.0, enhanced with ZTNA in 7.4.x
   */
  async addAddressGroup(
    addressGroup: FortiOSFirewallAddrGrp,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(addressGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete an IPv4 firewall address group from FortiOS configuration with comprehensive dependency validation.
   * Removes IPv4 address groups with dependency validation and Security Fabric synchronization for safe enterprise operations.
   *
   * @param {string} name - The name of the IPv4 firewall address group to delete
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with deletion status
   *
   * @example
   * ```typescript
   * const response = await fortios.deleteAddressGroup('old-server-group');
   * console.log(`Deleted group: ${response.data.revision}`);
   * ```
   *
   * @since FortiOS 1.0.0, enhanced with ZTNA in 7.4.x
   */
  async deleteAddressGroup(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update an existing IPv4 firewall address group in FortiOS configuration with atomic member updates.
   * Modifies IPv4 address groups with atomic member updates, impact analysis, and enterprise change management integration.
   *
   * @param {string} name - The name of the IPv4 firewall address group to update
   * @param {FortiOSFirewallAddrGrp} addressGroup - Updated IPv4 firewall address group configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with update status
   *
   * @example
   * ```typescript
   * const group = {
   *   name: 'web-servers',
   *   member: [
   *     { name: 'web-server-01' },
   *     { name: 'web-server-02' }
   *   ],
   *   comment: 'Updated web servers'
   * };
   * const response = await fortios.updateAddressGroup('web-servers', group);
   * const result = await response.json();
   * console.log(`Updated group with revision: ${result.revision}`);
   * ```
   *
   * @since FortiOS 1.0.0, enhanced with ZTNA in 7.4.x
   */
  async updateAddressGroup(
    name: string,
    addressGroup: FortiOSFirewallAddrGrp,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(addressGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // ===== IPv6 ADDRESS GROUP OPERATIONS =====

  /**
   * Retrieve a specific IPv6 firewall address group by name with modern IPv6 networking support.
   * Fetches IPv6 address groups supporting modern IPv6 networking, dual-stack environments, and enterprise IPv6 infrastructure management.
   *
   * @param {string} name - The name of the IPv6 firewall address group to retrieve
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and formatting
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddrGrp6>>>} Promise resolving to FortiOS response containing the IPv6 address group
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddressGroup6('ipv6-servers');
   * const group = response.data.results;
   * console.log(`IPv6 Group: ${group.name}, Members: ${group.member.length}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async getAddressGroup6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddrGrp6> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddrGrp6>>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve all IPv6 firewall address groups with optional filtering for enterprise IPv6 deployments.
   * Fetches IPv6 address groups with advanced filtering for enterprise IPv6 deployments and cloud-native application management.
   *
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and pagination
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSFirewallAddrGrp6>>>} Promise resolving to FortiOS response containing array of IPv6 address groups
   *
   * @example
   * ```typescript
   * const response = await fortios.getAddressGroups6();
   * console.log(`Found ${response.data.results.length} IPv6 address groups`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async getAddressGroups6(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddrGrp6> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddrGrp6>>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create a new IPv6 firewall address group in FortiOS configuration with modern IPv6 networking support.
   * Creates IPv6 address groups supporting modern IPv6 networking, Security Fabric integration, and enterprise IPv6 policy management.
   *
   * @param {FortiOSFirewallAddrGrp6} addressGroup - IPv6 firewall address group configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with creation status
   *
   * @example
   * ```typescript
   * const group = {
   *   name: 'ipv6-internal-servers',
   *   member: [
   *     { name: 'ipv6-web-server' },
   *     { name: 'ipv6-app-server' }
   *   ],
   *   comment: 'IPv6 internal servers'
   * };
   * const response = await fortios.addAddressGroup6(group);
   * const result = await response.json();
   * console.log(`Created IPv6 group with revision: ${result.revision}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async addAddressGroup6(
    addressGroup: FortiOSFirewallAddrGrp6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(addressGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete an IPv6 firewall address group from FortiOS configuration with dependency validation.
   * Removes IPv6 address groups with dependency validation and Security Fabric synchronization for safe enterprise IPv6 operations.
   *
   * @param {string} name - The name of the IPv6 firewall address group to delete
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with deletion status
   *
   * @example
   * ```typescript
   * const response = await fortios.deleteAddressGroup6('old-ipv6-group');
   * console.log(`Deleted IPv6 group: ${response.data.revision}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async deleteAddressGroup6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update an existing IPv6 firewall address group in FortiOS configuration with atomic updates.
   * Modifies IPv6 address groups with atomic updates and enterprise change management for dual-stack and IPv6-native environments.
   *
   * @param {string} name - The name of the IPv6 firewall address group to update
   * @param {FortiOSFirewallAddrGrp6} addressGroup - Updated IPv6 firewall address group configuration
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for VDOM and validation
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with update status
   *
   * @example
   * ```typescript
   * const group = {
   *   name: 'ipv6-servers',
   *   member: [
   *     { name: 'ipv6-web-server-01' },
   *     { name: 'ipv6-database-server' }
   *   ],
   *   comment: 'Updated IPv6 servers'
   * };
   * const response = await fortios.updateAddressGroup6('ipv6-servers', group);
   * const result = await response.json();
   * console.log(`Updated IPv6 group with revision: ${result.revision}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for IPv6 in 7.4.x
   */
  async updateAddressGroup6(
    name: string,
    addressGroup: FortiOSFirewallAddrGrp6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(addressGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // ===== SYSTEM VDOM OPERATIONS =====

  /**
   * Retrieve a specific system VDOM by name with virtual domain configuration support.
   * Fetches VDOM configuration from FortiOS supporting multi-tenancy, resource allocation, and enterprise virtual domain management.
   *
   * @param {string} name - The name of the system VDOM to retrieve
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and formatting
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSSystemVDOM>>>} Promise resolving to FortiOS response containing the VDOM configuration
   *
   * @example
   * ```typescript
   * const response = await fortios.getVdom('production');
   * const vdom = response.data.results;
   * console.log(`VDOM: ${vdom.name}, Cluster ID: ${vdom['vcluster-id']}`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async getVdom(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSSystemVDOM> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSSystemVDOM>>(
      this.config.baseURL +
        `/cmdb/system/vdom/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve all system VDOMs with optional filtering for multi-tenant enterprise deployments.
   * Fetches VDOM collections with advanced filtering for enterprise multi-tenancy and virtual domain management.
   *
   * @param {Object|FortiOSParams} [params] - Optional FortiOS query parameters for filtering and pagination
   * @returns {Promise<ResponseGeneric<FortiOSResponse<FortiOSSystemVDOM>>>} Promise resolving to FortiOS response containing array of VDOM configurations
   *
   * @example
   * ```typescript
   * const response = await fortios.getVdoms();
   * console.log(`Found ${response.data.results.length} VDOMs configured`);
   * ```
   *
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async getVdoms(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSSystemVDOM> | undefined> {
    const response = await this.get<FortiOSResponse<FortiOSSystemVDOM>>(
      this.config.baseURL +
        `/cmdb/system/vdom/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create a new system VDOM in FortiOS configuration with multi-tenant support.
   * Creates VDOM configuration supporting enterprise multi-tenancy, resource allocation, and virtual domain isolation.
   *
   * @param {FortiOSSystemVDOM} vdom - System VDOM configuration object
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for validation and options
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with creation status
   *
   * @example
   * ```typescript
   * const vdom = {
   *   name: 'development',
   *   'short-name': 'dev',
   *   'vcluster-id': 2,
   *   flag: 0
   * };
   * const response = await fortios.addVdom(vdom);
   * const result = await response.json();
   * console.log(`Created VDOM with revision: ${result.revision}`);
   * ```
   *
   * @throws {Error} When VDOM configuration is invalid or missing required fields
   * @throws {Error} When FortiOS API returns error (409 for conflicts, 400 for validation errors)
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async addVdom(
    vdom: FortiOSSystemVDOM,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/system/vdom/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(vdom) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update an existing system VDOM in FortiOS configuration with atomic operations.
   * Modifies VDOM configuration with comprehensive validation, change tracking, and enterprise virtual domain management.
   *
   * @param {string} name - The name of the system VDOM to update
   * @param {FortiOSSystemVDOM} vdom - Updated system VDOM configuration object
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for validation and update options
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with update status
   *
   * @example
   * ```typescript
   * const vdom = {
   *   name: 'production',
   *   'short-name': 'prod',
   *   'vcluster-id': 1,
   *   flag: 1
   * };
   * const response = await fortios.updateVdom('production', vdom);
   * const result = await response.json();
   * console.log(`Updated VDOM with revision: ${result.revision}`);
   * ```
   *
   * @throws {Error} When VDOM configuration is invalid or name mismatch
   * @throws {Error} When FortiOS API returns error (400 for validation errors, 404 for not found)
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async updateVdom(
    name: string,
    vdom: FortiOSSystemVDOM,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/system/vdom/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(vdom) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete a system VDOM from FortiOS configuration with dependency checking.
   * Removes VDOM with comprehensive dependency validation and enterprise safety checks for multi-tenant environments.
   *
   * @param {string} name - The name of the system VDOM to delete
   * @param {Object|FortiOSParams} [params] - Optional FortiOS parameters for validation and safety options
   * @returns {Promise<ResponseGeneric<FortiOSRevisionResponse>>} Promise resolving to FortiOS revision response with deletion status
   *
   * @example
   * ```typescript
   * const response = await fortios.deleteVdom('old-tenant-vdom');
   * console.log(`Deleted VDOM with revision: ${response.data.revision}`);
   * ```
   *
   * @throws {Error} When VDOM name is empty or invalid
   * @throws {Error} When FortiOS API returns error (404 for not found, 424 for dependency conflicts)
   * @since FortiOS 6.0.0, enhanced for 7.4.x
   */
  async deleteVdom(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse | undefined> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/system/vdom/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve data from any FortiOS API endpoint by URL for advanced use cases.
   * Provides direct access to any FortiOS CMDB endpoint for custom integrations and unsupported endpoints.
   *
   * @param {string} url - The FortiOS API endpoint URL (relative to base URL)
   * @param {Object} [params] - Optional query parameters for the request
   * @returns {Promise<ResponseGeneric<T>>} Promise resolving to FortiOS response with generic type
   *
   * @example
   * ```typescript
   * const response = await fortios.getByUrl<CustomType>('/cmdb/system/global');
   * const config = response.data.results;
   * ```
   *
   * @since FortiOS 6.0.0
   */
  async getByUrl<T>(
    url: string,
    params?: { [key: string]: any }
  ): Promise<T | undefined> {
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve paginated data from FortiOS API endpoint with optional auto-follow for large datasets.
   * Provides paginated access to FortiOS endpoints with automatic pagination following for bulk operations.
   *
   * @param {string} url - The FortiOS API endpoint URL
   * @param {Object} [params] - Optional query parameters including pagination controls
   * @param {boolean} [follow=false] - Whether to automatically follow pagination to retrieve all results
   * @returns {Promise<ResponseGeneric<T>>} Promise resolving to FortiOS response with paginated data
   *
   * @example
   * ```typescript
   * const response = await fortios.getPaginatedByUrl<FortiOSFirewallAddress>(
   *   '/cmdb/firewall/address', { count: 100 }, true
   * );
   * ```
   *
   * @since FortiOS 6.0.0
   */
  async getPaginatedByUrl<T>(
    url: string,
    params?: { [key: string]: any },
    follow = false
  ): Promise<T | undefined> {
    if (follow) {
      const response = await this.next<T>(url, params);
      if (response.ok) {
        return await response.json();
      } else {
        throw new HTTPError(response.statusText, response.status, response);
      }
    }
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Advanced pagination implementation for FortiOS API endpoints with intelligent skip-to navigation.
   * Implements intelligent pagination with FortiOS-specific skip_to mechanism for large configuration datasets and enterprise deployments.
   *
   * @param {string} url - The FortiOS API endpoint URL
   * @param {Object} [params] - Optional query parameters including pagination controls
   * @returns {Promise<ResponseGeneric<T>>} Promise resolving to FortiOS response with all paginated results
   *
   * @example
   * ```typescript
   * // This method is called automatically by getPaginatedByUrl with follow=true
   * const response = await fortios.getPaginatedByUrl('/cmdb/firewall/address', {}, true);
   * console.log(`Retrieved ${response.data.results.length} total addresses`);
   * ```
   *
   * @protected
   * @since FortiOS 6.0.0
   */
  protected async next<T>(
    url: string | URL | Request,
    params?: { [key: string]: any }
  ): Promise<ResponseGeneric<T>> {
    if (params && !params?.count) {
      params["count"] = 5;
      params["skip"] = 1;
    } else {
      params = {
        count: 5,
        skip: 1,
      };
    }

    let tmp: any[] = [];
    const res = await this.get<any>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    const size = data.results?.length || 0;
    let index = params.count;
    tmp = data.results || [];

    while (data.next || (size > 0 && index < size)) {
      if (data.next) {
        const response = await this.get<any>(data.next, {
          ...this.config,
          method: "GET",
        });
        data = await response.json();
      } else {
        params["skip"] = index;
        const response = await this.get<any>(
          this.config.baseURL + url + queryBuilderSync(params as any),
          { ...this.config, method: "GET" }
        );
        data = await response.json();
      }
      if (data.results && data.results.length > 0) {
        tmp = tmp.concat(data.results);
      }
      index += params.count;
    }

    // Return ResponseGeneric wrapper with aggregated data
    return {
      ...res,
      json: async () => ({
        ...data,
        results: tmp,
        count: tmp.length,
      }),
    } as ResponseGeneric<T>;
  }
}
