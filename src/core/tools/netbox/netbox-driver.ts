/**
 * @fileoverview NetBox API driver for comprehensive network infrastructure management.
 *
 * Provides type-safe interface for NetBox REST API endpoints across all major applications:
 * IPAM (IP prefixes, VRFs, VLANs), DCIM (sites, devices, infrastructure), Tenancy
 * (tenant management), and Extras (tags, custom fields, extensible data models).
 *
 * Features complete CRUD operations, automated prefix allocation, comprehensive pagination,
 * custom field management, generic endpoint access, split delete methods, flexible type
 * system supporting string literals and enums, immutable API responses with readonly
 * properties, advanced error handling, and validation with comprehensive NetBox integration.
 *
 * Supports enterprise patterns including multi-tenant environments, Security Fabric
 * integration, cloud-native deployments, and infrastructure-as-code workflows with
 * full TypeScript integration for enhanced developer experience and type safety.
 *
 * Uses native fetch API for modern HTTP operations.
 */

import {
  ZenikiCoreDriver,
  RequestConfig,
  ResponseGeneric,
} from "../../base/zeniki-core-driver";
import { NetboxPaginated } from "../../../types/tools/netbox/shared/netbox-paginated";
import { isDevMode, queryBuilderSync } from "../../utils";
import {
  NetboxPrefix,
  NetboxPrefixStatus,
  NetboxPrefixStatuses,
} from "../../../types/tools/netbox/ipam/netbox-prefix";
import { NetboxParams } from "../../../types/tools/netbox/shared/netbox-params";
import { NetboxCustomField } from "../../../types/tools/netbox/extras/netbox-custom-field";
import { NetboxCustomFieldChoiceSet } from "../../../types/tools/netbox/extras/netbox-custom-field-choice-set";
import { NetboxAvailablePrefix } from "../../../types/tools/netbox/shared/netbox-available-prefix";
import {
  HTTPError,
  NetboxDevice,
  NetboxSite,
  NetboxSiteStatus,
  NetboxTag,
  NetboxTenant,
  NetboxVlan,
  NetboxVlanStatus,
  NetboxVrf,
} from "../../../types";
import {
  NetboxOperationalStatus,
  NetboxRackFace,
  NetboxRackAirFlow,
  NetboxSubDeviceRole,
  NetboxWeightUnit,
} from "../../../types/tools/netbox/shared/netbox-value-label";

/**
 * NetBox API driver class providing comprehensive type-safe interface for NetBox REST API.
 * Extends ZenikiCoreDriver with specialized methods for IPAM, DCIM, Tenancy, and Extras applications.
 * Features flexible type system supporting string literals, enums, and immutable value-label pairs,
 * automated prefix allocation, comprehensive pagination, split delete patterns, and generic endpoint access.
 * Handles authentication, request/response processing with readonly API responses for data integrity.
 *
 * @class NetboxDriver
 * @extends ZenikiCoreDriver
 * @copyright Copyright 2025 Norsk Helsenett SF
 * @author Kevin Andre Vatn <kevin.vatn@nhn.no>
 *
 * @example
 * ```typescript
 * // Basic NetBox operations with string literals
 * const netbox = new NetboxDriver({
 *   baseURL: 'https://netbox.example.com/api',
 *   headers: { 'Authorization': 'Token your-api-token' },
 *   timeout: 30000
 * });
 *
 * const newPrefix = await netbox.addPrefix({
 *   prefix: '192.168.100.0/24',
 *   status: 'active',
 *   description: 'Development network',
 *   site: 1,
 *   tenant: 5,
 *   vrf: 10,
 *   custom_fields: { environment: 'dev' }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Advanced operations with type-safe enums
 * const newSite = await netbox.addSite({
 *   name: 'Data Center East',
 *   slug: 'dc-east',
 *   status: NetboxSiteStatus.Active,
 *   region: 2,
 *   tenant: 1,
 *   facility: 'Building A',
 *   asn: 65001,
 *   time_zone: 'America/New_York',
 *   description: 'Primary east coast facility',
 *   physical_address: '123 Main St',
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * });
 * ```
 */
export class NetboxDriver extends ZenikiCoreDriver {
  /**
   * Creates new NetBox driver instance with HTTP client configuration.
   * Initializes HTTP client using native fetch API with authentication and base settings for API communication.
   *
   * @param config - Request configuration including base URL, headers, and authentication
   *
   * @example Basic configuration
   * ```typescript
   * const netbox = new NetboxDriver({
   *   baseURL: 'https://netbox.company.com/api',
   *   headers: { 'Authorization': 'Token abc123def456' }
   * });
   * ```
   *
   * @example Advanced configuration with custom headers
   * ```typescript
   * const netbox = new NetboxDriver({
   *   baseURL: 'https://netbox.company.com/api',
   *   headers: {
   *     'Authorization': 'Token abc123def456',
   *     'Content-Type': 'application/json',
   *     'User-Agent': 'MyApp/1.0'
   *   }
   * });
   * ```
   */
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific IP prefix by its ID from NetBox.
   * Returns immutable response with readonly properties for data integrity.
   *
   * @param id - The unique identifier of the prefix to retrieve
   * @param params - Optional query parameters for filtering or additional data (optional)
   * @returns Promise resolving to the prefix data or undefined if not found
   *
   * @example
   * ```typescript
   * const response = await netbox.getPrefix(42, { brief: true });
   * const prefix = await response.json();
   * console.log(`Prefix: ${prefix.prefix}, Status: ${prefix.status?.label}`);
   * ```
   */
  async getPrefix(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxPrefix | undefined> {
    const response = await this.get<NetboxPrefix>(
      this.config.baseURL +
        `/ipam/prefixes/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a paginated list of IP prefixes from NetBox with comprehensive filtering.
   * Supports filtering, searching, pagination, and automatic result following across pages.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination (optional)
   * @param follow - Whether to follow pagination and return all results across all pages (optional)
   * @returns Promise resolving to paginated prefix data or undefined if request fails
   *
   * @example
   * ```typescript
   * const response = await netbox.getPrefixes({
   *   status: 'active',
   *   family: 4,
   *   within_include: '10.0.0.0/8',
   *   q: 'user networks',
   *   ordering: 'prefix',
   *   limit: 25
   * }, true);
   * ```
   */
  async getPrefixes(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxPrefix> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxPrefix>>(
        `/ipam/prefixes/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxPrefix>>(
      this.config.baseURL + `/ipam/prefixes/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves the next available prefixes within a parent prefix for network planning.
   * Finds available subnet space within an existing prefix for automatic allocation.
   *
   * @param id - The unique identifier of the parent prefix
   * @param params - Optional query parameters for filtering (such as prefix_length) (optional)
   * @returns Promise resolving to an array of available prefix suggestions
   *
   * @example
   * ```typescript
   * const availablePrefixes = await netbox.getNextAvailablePrefix(42, {
   *   prefix_length: 24  // Only show /24 suggestions
   * });
   * console.log(`Found ${availablePrefixes.data.length} available prefixes`);
   * ```
   */
  async getNextAvailablePrefix(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxAvailablePrefix[] | undefined> {
    // Get next available prefix with GET, id and optional params.
    const response = await this.get<NetboxAvailablePrefix[]>(
      this.config.baseURL +
        `/ipam/prefixes/${id}/available-prefixes/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates and allocates a new prefix from available space within a parent prefix.
   * Uses POST to create a prefix with specified parameters, VLAN assignment, and custom fields.
   *
   * @param id - The unique identifier of the parent prefix
   * @param length - The prefix length (subnet mask) for the new prefix
   * @param vlan_id - Optional VLAN ID to associate with the new prefix (optional)
   * @param description - Optional description for the new prefix (optional)
   * @param json_fields - Optional additional fields to set on the new prefix (optional)
   * @param custom_fields - Optional custom field values as key-value pairs (optional)
   * @param params - Optional query parameters for the request (optional)
   * @returns Promise resolving to an array containing the newly created prefix
   *
   * @example
   * ```typescript
   * const newPrefix = await netbox.registerNextAvailablePrefix(
   *   42, 24, 100, "Production network",
   *   { status: "active", role: 5 },
   *   { "domain": "production", "env": "prod" }
   * );
   * console.log(`Created prefix: ${newPrefix.data[0].prefix}`);
   * ```
   */
  async registerNextAvailablePrefix(
    id: number,
    length: number,
    vlan_id: number | null = null,
    description?: string,
    json_fields?: { [key: string]: any },
    custom_fields?: { [key: string]: string },
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxPrefix[] | undefined> {
    const response = await this.post<NetboxPrefix[]>(
      this.config.baseURL +
        `/ipam/prefixes/${id}/available-prefixes/` +
        queryBuilderSync(params as any),
      {
        ...this.config,
        method: "POST",
        body: JSON.stringify({
          prefix_length: length,
          vlan: vlan_id,
          description: description,
          ...json_fields,
          custom_fields: custom_fields,
        }),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new prefix in NetBox with flexible type system support.
   * Supports string literals, enums, and value-label pairs for status and other properties.
   *
   * @param prefix - The prefix object to create with flexible typing support
   * @param id - Optional ID for the prefix (for updates/replacements) (optional)
   * @returns Promise resolving to the created prefix or undefined if creation fails
   *
   * @example
   * ```typescript
   * const prefix = {
   *   prefix: '192.168.100.0/24',
   *   status: NetboxPrefixStatus.Active, // Type-safe enum
   *   site: 1,
   *   tenant: 5,
   *   description: 'Development subnet',
   *   custom_fields: { environment: 'dev' }
   * };
   * const response = await netbox.addPrefix(prefix);
   * const result = await response.json();
   * console.log(`Created prefix: ${result.prefix}`);
   * ```
   */
  async addPrefix(
    prefix: NetboxPrefix,
    id?: number
  ): Promise<NetboxPrefix | undefined> {
    const response = await this.post<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "POST", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a prefix from NetBox using a prefix object with data.
   * This method is used when you need to delete a prefix by providing the prefix object
   * with identification data. For direct deletion by ID, use deletePrefixById instead.
   *
   * @param prefix - The prefix object containing identification data for deletion
   * @returns Promise resolving to the deleted prefix data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a prefix using object data
   * const prefixToDelete = { id: 42 };
   * const response = await netbox.deletePrefix(prefixToDelete);
   *
   * // Delete multiple prefixes using object data
   * const prefixObjects = [{ id: 123 }, { id: 124 }, { id: 125 }];
   * for (const prefixObj of prefixObjects) {
   *   await netbox.deletePrefix(prefixObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const prefixWithCriteria = {
   *   prefix: '192.168.1.0/24',
   *   site: 1
   * };
   * const response = await netbox.deletePrefix(prefixWithCriteria);
   * ```
   *
   * @throws {Error} When the prefix is not found (404) or other API errors occur
   * @see {@link NetboxPrefix} For the prefix type definition
   * @see {@link deletePrefixById} For direct deletion by ID (recommended for single deletions)
   */
  async deletePrefix(
    prefix: Partial<NetboxPrefix>
  ): Promise<NetboxPrefix | undefined> {
    const response = await this.delete<NetboxPrefix>(
      this.config.baseURL + `/ipam/prefixes/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(prefix),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a prefix from NetBox by its ID.
   * This is the preferred method for deleting a single prefix when you know its ID.
   * Provides direct, efficient deletion without requiring object data.
   *
   * @param id - The unique identifier of the prefix to delete
   * @returns Promise resolving to the deleted prefix data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a prefix by ID (recommended for single deletions)
   * const response = await netbox.deletePrefixById(42);
   *
   * // Delete multiple prefixes by ID in a loop
   * const prefixIds = [123, 124, 125];
   * for (const prefixId of prefixIds) {
   *   await netbox.deletePrefixById(prefixId);
   * }
   *
   * // Error handling for prefix deletion
   * try {
   *   await netbox.deletePrefixById(999);
   * } catch (error) {
   *   if (error.response?.status === 404) {
   *     console.log('Prefix not found');
   *   } else {
   *     console.error('Deletion failed:', error.message);
   *   }
   * }
   * ```
   *
   * @throws {Error} When the prefix is not found (404) or other API errors occur
   * @see {@link NetboxPrefix} For the prefix type definition
   * @see {@link deletePrefix} For deletion using prefix object data
   */
  async deletePrefixById(id: number): Promise<NetboxPrefix | undefined> {
    const response = await this.delete<NetboxPrefix>(
      this.config.baseURL + `/ipam/prefixes/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates a prefix in NetBox using PATCH method.
   * Updates only the specified fields, leaving other fields unchanged.
   *
   * @param prefix - Partial prefix object with fields to update
   * @param id - Optional ID of the prefix to update
   * @returns Promise resolving to the updated prefix or undefined if update fails
   *
   * @example
   * ```typescript
   * // Update only the description and status of a prefix
   * const updates = {
   *   description: 'Updated production network',
   *   status: { value: 'active', label: 'Active' }
   * };
   * const response = await netbox.patchPrefix(updates, 42);
   * const result = await response.json();
   * console.log(`Updated prefix: ${result.prefix}`);
   * ```
   *
   * @throws {Error} When the prefix is not found (404) or validation errors occur
   * @see {@link NetboxPrefix} For the prefix type definition
   */
  async patchPrefix(
    prefix: Partial<NetboxPrefix>,
    id?: number
  ): Promise<NetboxPrefix | undefined> {
    const response = await this.patch<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a prefix in NetBox using PUT method.
   * Replaces the entire prefix object with the provided data.
   *
   * @param prefix - Complete prefix object for replacement (optional if ID is provided)
   * @param id - Optional ID of the prefix to update
   * @returns Promise resolving to the updated prefix or undefined if update fails
   *
   * @example
   * ```typescript
   * // Complete replacement of a prefix
   * const prefix = {
   *   prefix: '192.168.200.0/24',
   *   family: { value: 4, label: 'IPv4' },
   *   status: { value: 'active', label: 'Active' },
   *   site: 1,
   *   description: 'Completely updated network'
   * };
   * const response = await netbox.updatePrefix(prefix, 42);
   * const result = await response.json();
   * console.log(`Updated prefix: ${result.prefix}`);
   * ```
   *
   * @throws {Error} When the prefix is not found (404) or validation errors occur
   * @see {@link NetboxPrefix} For the prefix type definition
   */
  async updatePrefix(
    prefix: NetboxPrefix,
    id?: number
  ): Promise<NetboxPrefix | undefined> {
    const response = await this.put<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "PUT", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific custom field by its ID from NetBox.
   * Custom fields allow administrators to extend NetBox objects with additional properties
   * specific to their organization's needs.
   *
   * @param id - The unique identifier of the custom field to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the custom field data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get custom field with basic information
   * const response = await netbox.getCustomField(5);
   * const customField = response.data;
   * console.log(`Custom Field: ${customField.name}, Type: ${customField.type}`);
   *
   * // Get custom field with additional query parameters
   * const response = await netbox.getCustomField(5, {
   *   brief: true // NetBox parameter for condensed response
   * });
   * ```
   *
   * @throws {Error} When the custom field is not found (404) or other API errors occur
   * @see {@link NetboxCustomField} For the custom field type definition
   * @since 0.0.1
   */
  async getCustomField(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxCustomField | undefined> {
    const response = await this.get<NetboxCustomField>(
      this.config.baseURL +
        `/extras/custom-fields/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a paginated list of custom fields from NetBox.
   * Custom fields allow administrators to extend NetBox objects with additional properties
   * specific to their organization's needs.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination
   * @returns Promise resolving to paginated custom field data
   *
   * @example
   * ```typescript
   * // Get all custom fields
   * const response = await netbox.getCustomFields();
   * const customFields = response.json().results;
   * const totalCount = response.json().count;
   *
   * // Get custom fields for specific content types
   * const response = await netbox.getCustomFields({
   *   content_types: 'ipam.prefix',
   *   limit: 50
   * });
   *
   * // Search custom fields by name
   * const response = await netbox.getCustomFields({
   *   q: 'business',
   *   ordering: 'name'
   * });
   *
   * // Get required custom fields only
   * const response = await netbox.getCustomFields({
   *   required: true
   * });
   * ```
   *
   * @throws {Error} When API errors occur (authentication, rate limiting, etc.)
   * @see {@link NetboxCustomField} For custom field type definition
   */
  async getCustomFields(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxCustomField> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxCustomField>>(
        `/extras/custom-fields/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxCustomField>>(
      this.config.baseURL +
        `/extras/custom-fields/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific custom field choice set by its ID from NetBox.
   * Custom field choice sets define predefined values that can be selected for choice-type
   * custom fields, providing controlled vocabularies for data consistency.
   *
   * @param id - The unique identifier of the custom field choice set to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the choice set data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get custom field choice set with basic information
   * const response = await netbox.getCustomFieldChoiceSet(2);
   * const choiceSet = response.data;
   * console.log(`Choice Set: ${choiceSet.name}, Choices: ${choiceSet.extra_choices.length}`);
   *
   * // Get choice set with additional query parameters
   * const response = await netbox.getCustomFieldChoiceSet(2, {
   *   brief: true // NetBox parameter for condensed response
   * });
   * ```
   *
   * @throws {Error} When the choice set is not found (404) or other API errors occur
   * @see {@link NetboxCustomFieldChoiceSet} For the choice set type definition
   * @since 0.0.1
   */
  async getCustomFieldChoiceSet(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxCustomFieldChoiceSet | undefined> {
    const response = await this.get<NetboxCustomFieldChoiceSet>(
      this.config.baseURL +
        `/extras/custom-field-choice-sets/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a paginated list of all custom field choice sets from NetBox.
   * Custom field choice sets define predefined values for choice-type custom fields,
   * enabling consistent data entry and validation across your NetBox instance.
   *
   * @param params - Optional query parameters for filtering, pagination, or ordering
   * @param follow - If true, automatically follows pagination to retrieve all results
   * @returns Promise resolving to paginated response containing array of choice sets
   *
   * @example
   * ```typescript
   * // Get all custom field choice sets (first page)
   * const response = await netbox.getCustomFieldChoiceSets();
   * response.json().results.forEach(choiceSet => {
   *   console.log(`Choice Set: ${choiceSet.name} (${choiceSet.extra_choices.length} choices)`);
   * });
   *
   * // Filter choice sets by name pattern
   * const response = await netbox.getCustomFieldChoiceSets({
   *   name__icontains: 'status',
   *   limit: 10
   * });
   *
   * // Get all choice sets across all pages
   * const response = await netbox.getCustomFieldChoiceSets({
   *   ordering: 'name'
   * }, true);
   *
   * // Get minimal choice set information
   * const response = await netbox.getCustomFieldChoiceSets({
   *   brief: true
   * });
   * ```
   *
   * @throws {Error} When API request fails or authentication issues occur
   * @see {@link NetboxCustomFieldChoiceSet} For individual choice set type definition
   * @see {@link NetboxPaginated} For pagination structure details
   * @since 0.0.1
   */
  async getCustomFieldChoiceSets(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxCustomFieldChoiceSet> | undefined> {
    if (follow) {
      const response = await this.next<
        NetboxPaginated<NetboxCustomFieldChoiceSet>
      >(`/extras/custom-field-choice-sets/`, params);

      return await response.json();
    }

    const response = await this.get<
      NetboxPaginated<NetboxCustomFieldChoiceSet>
    >(
      this.config.baseURL +
        `/extras/custom-field-choice-sets/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific site by its ID from NetBox.
   * Sites represent physical locations or data centers in your infrastructure.
   *
   * @param id - The unique identifier of the site to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the site data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get site with basic information
   * const response = await netbox.getSite(1);
   * const site = response.data;
   * console.log(`Site: ${site.name}, Slug: ${site.slug}`);
   * ```
   *
   * @throws {Error} When the site is not found (404) or other API errors occur
   * @see {@link NetboxSite} For the site type definition
   */
  async getSite(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxSite | undefined> {
    const response = await this.get<NetboxSite>(
      this.config.baseURL +
        `/dcim/sites/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of sites from NetBox DCIM module.
   * Returns site objects representing physical locations or data centers in infrastructure.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination (optional)
   * @returns Promise resolving to paginated site data
   *
   * @example
   * ```typescript
   * const response = await netbox.getSites({ status: 'active', region: 'us-west', limit: 25 });
   * console.log(`Found ${response.json().count} sites`);
   * ```
   */
  async getSites(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxSite> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxSite>>(
        `/dcim/sites/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxSite>>(
      this.config.baseURL + `/dcim/sites/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates new site in NetBox DCIM module.
   * Adds site either at specific ID location or creates new one with provided configuration.
   *
   * @param site - The site object to create
   * @param id - Optional ID for the site (for updates/replacements) (optional)
   * @returns Promise resolving to the created site or undefined if creation fails
   *
   * @example
   * ```typescript
   * const site = { name: 'DC West', slug: 'dc-west', status: 'active', region: 1 };
   * const response = await netbox.addSite(site);
   * const result = await response.json();
   * console.log(`Created site: ${result.name}`);
   * ```
   */
  async addSite(
    site: NetboxSite,
    id?: number
  ): Promise<NetboxSite | undefined> {
    const response = await this.post<NetboxSite>(
      this.config.baseURL + (id ? `/dcim/sites/${id}/` : `/dcim/sites/`),
      { ...this.config, method: "POST", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes site from NetBox using site object with identification data.
   * Used when you need to delete site by providing site object instead of direct ID.
   *
   * @param site - The site object containing identification data for deletion
   * @returns Promise resolving to the deleted site data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * const siteToDelete = { id: 5, name: 'Old Data Center' };
   * const response = await netbox.deleteSite(siteToDelete);
   * ```
   */
  async deleteSite(site: Partial<NetboxSite>): Promise<NetboxSite | undefined> {
    const response = await this.delete<NetboxSite>(
      this.config.baseURL + `/dcim/sites/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(site),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes site from NetBox by its unique ID.
   * Preferred method for deleting single site when you know its ID for direct deletion.
   *
   * @param id - The unique identifier of the site to delete
   * @returns Promise resolving to the deleted site data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * const response = await netbox.deleteSiteById(5);
   * console.log(`Site deleted successfully`);
   * ```
   */
  async deleteSiteById(id: number): Promise<NetboxSite | undefined> {
    const response = await this.delete<NetboxSite>(
      this.config.baseURL + `/dcim/sites/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates site in NetBox using PATCH method.
   * Updates only specified fields while leaving other fields unchanged.
   *
   * @param site - Partial site object with fields to update
   * @param id - Optional ID of the site to update (optional)
   * @returns Promise resolving to the updated site
   *
   * @example
   * ```typescript
   * const updates = { description: 'Updated datacenter', status: 'active' };
   * const response = await netbox.patchSite(updates, 5);
   * const result = await response.json();
   * console.log(`Updated site: ${result.name}`);
   * ```
   */
  async patchSite(
    site: Partial<NetboxSite>,
    id?: number
  ): Promise<NetboxSite | undefined> {
    const response = await this.patch<NetboxSite>(
      this.config.baseURL + (id ? `/dcim/sites/${id}/` : `/dcim/sites/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates site in NetBox using PUT method for full replacement.
   * Replaces entire site object with provided data using complete object replacement.
   *
   * @param site - Complete site object for replacement (optional)
   * @param id - Optional ID of the site to update (optional)
   * @returns Promise resolving to the updated site
   *
   * @example
   * ```typescript
   * const site = {
   *   name: 'DC East Updated',
   *   slug: 'dc-east-new',
   *   status: 'active',
   *   region: 2,
   *   facility: 'Building B'
   * };
   * const response = await netbox.updateSite(site, 5);
   * const result = await response.json();
   * console.log(`Updated site: ${result.name}`);
   * ```
   */
  async updateSite(
    site?: NetboxSite,
    id?: number
  ): Promise<NetboxSite | undefined> {
    const response = await this.put<NetboxSite>(
      this.config.baseURL + (id ? `/dcim/sites/${id}/` : `/dcim/sites/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !site ? undefined : JSON.stringify(site),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves specific tenant by ID from NetBox tenancy module.
   * Returns tenant representing organization or customer that owns/manages resources.
   *
   * @param id - The unique identifier of the tenant to retrieve
   * @param params - Optional query parameters for filtering or additional data (optional)
   * @returns Promise resolving to the tenant data or undefined if not found
   *
   * @example
   * ```typescript
   * const response = await netbox.getTenant(5, { brief: true });
   * console.log(`Tenant: ${response.json().name} (${response.json().slug})`);
   * ```
   */
  async getTenant(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxTenant | undefined> {
    const response = await this.get<NetboxTenant>(
      this.config.baseURL +
        `/tenancy/tenants/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of tenants from NetBox tenancy module.
   * Returns tenant objects representing organizations or customers that own/manage resources.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination (optional)
   * @returns Promise resolving to paginated tenant data
   *
   * @example
   * ```typescript
   * const response = await netbox.getTenants({
   *   group: 'customers',
   *   ordering: 'name',
   *   limit: 50
   * });
   * console.log(`Found ${response.json().count} tenants`);
   * ```
   */
  async getTenants(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxTenant> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxTenant>>(
        `/tenancy/tenants/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxTenant>>(
      this.config.baseURL +
        `/tenancy/tenants/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new tenant in NetBox.
   * Adds a tenant either at a specific ID location or creates a new one.
   *
   * @param tenant - The tenant object to create
   * @param id - Optional ID for the tenant (for updates/replacements)
   * @returns Promise resolving to the created tenant or undefined if creation fails
   *
   * @example
   * ```typescript
   * // Create a new tenant
   * const tenant = {
   *   name: 'Acme Corporation',
   *   slug: 'acme-corp',
   *   group: 1,
   *   description: 'Primary customer for hosting services',
   *   comments: 'VIP customer - priority support'
   * };
   * const response = await netbox.addTenant(tenant);
   * const result = await response.json();
   * console.log(`Created tenant: ${result.name}`);
   * ```
   *
   * @throws {Error} When validation errors occur or API errors
   * @see {@link NetboxTenant} For the tenant type definition
   */
  async addTenant(
    tenant: NetboxTenant,
    id?: number
  ): Promise<NetboxTenant | undefined> {
    const response = await this.post<NetboxTenant>(
      this.config.baseURL +
        (id ? `/tenancy/tenants/${id}/` : `/tenancy/tenants/`),
      { ...this.config, method: "POST", body: JSON.stringify(tenant) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a tenant from NetBox using a tenant object with data.
   * This method is used when you need to delete a tenant by providing the tenant object
   * with identification data. For direct deletion by ID, use deleteTenantById instead.
   *
   * @param tenant - The tenant object containing identification data for deletion
   * @returns Promise resolving to the deleted tenant data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a tenant using object data
   * const tenantToDelete = { id: 5 };
   * const response = await netbox.deleteTenant(tenantToDelete);
   *
   * // Delete multiple tenants using object data
   * const tenantObjects = [{ id: 3 }, { id: 4 }, { id: 5 }];
   * for (const tenantObj of tenantObjects) {
   *   await netbox.deleteTenant(tenantObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const tenantWithCriteria = {
   *   name: 'Inactive Corp',
   *   slug: 'inactive-corp'
   * };
   * const response = await netbox.deleteTenant(tenantWithCriteria);
   * ```
   *
   * @throws {Error} When the tenant is not found (404) or other API errors occur
   * @see {@link NetboxTenant} For the tenant type definition
   * @see {@link deleteTenantById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteTenant(
    tenant: Partial<NetboxTenant>
  ): Promise<NetboxTenant | undefined> {
    const response = await this.delete<NetboxTenant>(
      this.config.baseURL + `/tenancy/tenants/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(tenant),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a tenant from NetBox by its ID.
   * This is the preferred method for deleting a single tenant when you know its ID.
   * Provides direct, efficient deletion without requiring object data.
   *
   * @param id - The unique identifier of the tenant to delete
   * @returns Promise resolving to the deleted tenant data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a tenant by ID (recommended for single deletions)
   * const response = await netbox.deleteTenantById(5);
   *
   * // Delete multiple tenants by ID in a loop
   * const tenantIds = [3, 4, 5];
   * for (const tenantId of tenantIds) {
   *   await netbox.deleteTenantById(tenantId);
   * }
   *
   * // Error handling for tenant deletion
   * try {
   *   await netbox.deleteTenantById(999);
   * } catch (error) {
   *   if (error.response?.status === 404) {
   *     console.log('Tenant not found');
   *   } else {
   *     console.error('Deletion failed:', error.message);
   *   }
   * }
   * ```
   *
   * @throws {Error} When the tenant is not found (404) or other API errors occur
   * @see {@link NetboxTenant} For the tenant type definition
   * @see {@link deleteTenant} For deletion using tenant object data
   */
  async deleteTenantById(id: number): Promise<NetboxTenant | undefined> {
    const response = await this.delete<NetboxTenant>(
      this.config.baseURL + `/tenancy/tenants/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates a tenant in NetBox using PATCH method.
   * Updates only the specified fields, leaving other fields unchanged.
   *
   * @param tenant - Partial tenant object with fields to update
   * @param id - Optional ID of the tenant to update
   * @returns Promise resolving to the updated tenant or undefined if update fails
   *
   * @example
   * ```typescript
   * // Update only the description and comments of a tenant
   * const updates = {
   *   description: 'Updated enterprise customer',
   *   comments: 'Upgraded to premium support tier'
   * };
   * const response = await netbox.patchTenant(updates, 5);
   * const result = await response.json();
   * console.log(`Updated tenant: ${result.name}`);
   * ```
   *
   * @throws {Error} When the tenant is not found (404) or validation errors occur
   * @see {@link NetboxTenant} For the tenant type definition
   */
  async patchTenant(
    tenant: Partial<NetboxTenant>,
    id?: number
  ): Promise<NetboxTenant | undefined> {
    const response = await this.patch<NetboxTenant>(
      this.config.baseURL +
        (id ? `/tenancy/tenants/${id}/` : `/tenancy/tenants/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(tenant) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a tenant in NetBox using PUT method.
   * Replaces the entire tenant object with the provided data.
   *
   * @param tenant - Complete tenant object for replacement (optional if ID is provided)
   * @param id - Optional ID of the tenant to update
   * @returns Promise resolving to the updated tenant
   *
   * @example
   * ```typescript
   * // Complete replacement of a tenant
   * const tenant = {
   *   name: 'Acme Corporation - Updated',
   *   slug: 'acme-corp-new',
   *   group: 2,
   *   description: 'Completely updated tenant configuration',
   *   comments: 'Migrated to new billing system'
   * };
   * const response = await netbox.updateTenant(tenant, 5);
   * const result = await response.json();
   * console.log(`Updated tenant: ${result.name}`);
   * ```
   *
   * @throws {Error} When the tenant is not found (404) or validation errors occur
   * @see {@link NetboxTenant} For the tenant type definition
   */
  async updateTenant(
    tenant?: NetboxTenant,
    id?: number
  ): Promise<NetboxTenant | undefined> {
    const response = await this.put<NetboxTenant>(
      this.config.baseURL +
        (id ? `/tenancy/tenants/${id}/` : `/tenancy/tenants/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !tenant ? undefined : JSON.stringify(tenant),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific tag by its ID from NetBox.
   * Tags are labels that can be applied to various NetBox objects for categorization and filtering.
   *
   * @param id - The unique identifier of the tag to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the tag data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get tag with basic information
   * const response = await netbox.getTag(3);
   * const tag = response.data;
   * console.log(`Tag: ${tag.name}, Color: ${tag.color}`);
   * ```
   *
   * @throws {Error} When the tag is not found (404) or other API errors occur
   * @see {@link NetboxTag} For the tag type definition
   */
  async getTag(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxTag | undefined> {
    const response = await this.get<NetboxTag>(
      this.config.baseURL +
        `/extras/tags/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of tags from NetBox Extras module.
   * Returns tag objects that can be applied to various NetBox objects for categorization and filtering.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination (optional)
   * @param follow - Whether to follow pagination and return all results (optional)
   * @returns Promise resolving to paginated tag data
   *
   * @example
   * ```typescript
   * const response = await netbox.getTags({
   *   name__icontains: 'prod',
   *   ordering: 'name',
   *   limit: 100
   * });
   * console.log(`Found ${response.json().count} tags`);
   * ```
   */
  async getTags(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxTag> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxTag>>(
        `/extras/tags/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxTag>>(
      this.config.baseURL + `/extras/tags/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new tag in NetBox.
   * Adds a tag either at a specific ID location or creates a new one.
   *
   * @param tag - The tag object to create
   * @param id - Optional ID for the tag (for updates/replacements)
   * @returns Promise resolving to the created tag or undefined if creation fails
   *
   * @example
   * ```typescript
   * // Create a new tag
   * const tag = {
   *   name: 'Production',
   *   slug: 'production',
   *   color: '#ff0000'
   * };
   * const response = await netbox.addTag(tag);
   * const result = await response.json();
   * console.log(`Created tag: ${result.name}`);
   * ```
   *
   * @throws {Error} When validation errors occur or API errors
   * @see {@link NetboxTag} For the tag type definition
   */
  async addTag(tag: NetboxTag, id?: number): Promise<NetboxTag | undefined> {
    const response = await this.post<NetboxTag>(
      this.config.baseURL + (id ? `/extras/tags/${id}/` : `/extras/tags/`),
      { ...this.config, method: "POST", body: JSON.stringify(tag) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a tag from NetBox using a tag object with data.
   * This method is used when you need to delete a tag by providing the tag object
   * with identification data. For direct deletion by ID, use deleteTagById instead.
   *
   * @param tag - The tag object containing identification data for deletion
   * @returns Promise resolving to the deleted tag data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a tag using object data
   * const tagToDelete = { id: 3 };
   * const response = await netbox.deleteTag(tagToDelete);
   *
   * // Delete multiple tags using object data
   * const tagObjects = [{ id: 1 }, { id: 2 }, { id: 3 }];
   * for (const tagObj of tagObjects) {
   *   await netbox.deleteTag(tagObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const tagWithCriteria = {
   *   name: 'production',
   *   slug: 'production'
   * };
   * const response = await netbox.deleteTag(tagWithCriteria);
   * ```
   *
   * @throws {Error} When the tag is not found (404) or other API errors occur
   * @see {@link NetboxTag} For the tag type definition
   * @see {@link deleteTagById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteTag(tag: Partial<NetboxTag>): Promise<NetboxTag | undefined> {
    const response = await this.delete<NetboxTag>(
      this.config.baseURL + `/extras/tags/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(tag),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a tag from NetBox by its ID.
   * This is the preferred method for deleting a single tag when you know its ID.
   * Provides direct, efficient deletion without requiring object data.
   *
   * @param id - The unique identifier of the tag to delete
   * @returns Promise resolving to the deleted tag data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a tag by ID (recommended for single deletions)
   * const response = await netbox.deleteTagById(3);
   *
   * // Delete multiple tags by ID in a loop
   * const tagIds = [1, 2, 3];
   * for (const tagId of tagIds) {
   *   await netbox.deleteTagById(tagId);
   * }
   *
   * // Error handling for tag deletion
   * try {
   *   await netbox.deleteTagById(999);
   * } catch (error) {
   *   if (error.response?.status === 404) {
   *     console.log('Tag not found');
   *   } else {
   *     console.error('Deletion failed:', error.message);
   *   }
   * }
   * ```
   *
   * @throws {Error} When the tag is not found (404) or other API errors occur
   * @see {@link NetboxTag} For the tag type definition
   * @see {@link deleteTag} For deletion using tag object data
   */
  async deleteTagById(id: number): Promise<NetboxTag | undefined> {
    const response = await this.delete<NetboxTag>(
      this.config.baseURL + `/extras/tags/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates a tag in NetBox using PATCH method.
   * Updates only the specified fields, leaving other fields unchanged.
   *
   * @param tag - Partial tag object with fields to update
   * @param id - Optional ID of the tag to update
   * @returns Promise resolving to the updated tag or undefined if update fails
   *
   * @example
   * ```typescript
   * // Update only the color and description of a tag
   * const updates = {
   *   color: '#00ff00',
   *   description: 'Updated production tag'
   * };
   * const response = await netbox.patchTag(updates, 3);
   * const result = await response.json();
   * console.log(`Updated tag: ${result.name}`);
   * ```
   *
   * @throws {Error} When the tag is not found (404) or validation errors occur
   * @see {@link NetboxTag} For the tag type definition
   */
  async patchTag(
    tag: Partial<NetboxTag>,
    id?: number
  ): Promise<NetboxTag | undefined> {
    const response = await this.patch<NetboxTag>(
      this.config.baseURL + (id ? `/extras/tags/${id}/` : `/extras/tags/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(tag) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a tag in NetBox using PUT method.
   * Replaces the entire tag object with the provided data.
   *
   * @param tag - Complete tag object for replacement (optional if ID is provided)
   * @param id - Optional ID of the tag to update
   * @returns Promise resolving to the updated tag
   *
   * @example
   * ```typescript
   * // Complete replacement of a tag
   * const tag = {
   *   name: 'Updated Production',
   *   slug: 'updated-production',
   *   color: '#0000ff',
   *   description: 'Completely updated tag'
   * };
   * const response = await netbox.updateTag(tag, 3);
   * const result = await response.json();
   * console.log(`Updated tag: ${result.name}`);
   * ```
   *
   * @throws {Error} When the tag is not found (404) or validation errors occur
   * @see {@link NetboxTag} For the tag type definition
   */
  async updateTag(
    tag?: NetboxTag,
    id?: number
  ): Promise<NetboxTag | undefined> {
    const response = await this.put<NetboxTag>(
      this.config.baseURL + (id ? `/extras/tags/${id}/` : `/extras/tags/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !tag ? undefined : JSON.stringify(tag),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific VRF (Virtual Routing and Forwarding) by its ID from NetBox.
   * VRFs provide network segmentation and routing isolation for multi-tenant environments.
   *
   * @param id - The unique identifier of the VRF to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the VRF data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get VRF with basic information
   * const response = await netbox.getVrf(10);
   * const vrf = response.data;
   * console.log(`VRF: ${vrf.name}, RD: ${vrf.rd}`);
   * ```
   *
   * @throws {Error} When the VRF is not found (404) or other API errors occur
   * @see {@link NetboxVrf} For the VRF type definition
   */
  async getVrf(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxVrf | undefined> {
    const response = await this.get<NetboxVrf>(
      this.config.baseURL +
        `/ipam/vrfs/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of VRFs from NetBox IPAM module.
   * Returns VRF objects providing network segmentation and routing isolation for multi-tenant environments.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination (optional)
   * @param follow - Whether to follow pagination and return all results (optional)
   * @returns Promise resolving to paginated VRF data
   *
   * @example
   * ```typescript
   * const response = await netbox.getVrfs({
   *   tenant: 5,
   *   rd: '65000:100',
   *   limit: 50
   * });
   * console.log(`Found ${response.json().count} VRFs`);
   * ```
   */
  async getVrfs(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxVrf> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxVrf>>(
        `/ipam/vrfs/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxVrf>>(
      this.config.baseURL + `/ipam/vrfs/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new VRF (Virtual Routing and Forwarding) in NetBox.
   * Adds a VRF either at a specific ID location or creates a new one.
   *
   * @param vrf - The VRF object to create
   * @param id - Optional ID for the VRF (for updates/replacements)
   * @returns Promise resolving to the created VRF or undefined if creation fails
   *
   * @example
   * ```typescript
   * // Create a new VRF
   * const vrf = {
   *   name: 'PRODUCTION_VRF',
   *   rd: '65000:100',
   *   tenant: 1,
   *   enforce_unique: true
   * };
   * const response = await netbox.addVrf(vrf);
   * const result = await response.json();
   * console.log(`Created VRF: ${result.name}`);
   * ```
   *
   * @throws {Error} When validation errors occur or API errors
   * @see {@link NetboxVrf} For the VRF type definition
   */
  async addVrf(vrf: NetboxVrf, id?: number): Promise<NetboxVrf | undefined> {
    const response = await this.post<NetboxVrf>(
      this.config.baseURL + (id ? `/ipam/vrfs/${id}/` : `/ipam/vrfs/`),
      { ...this.config, method: "POST", body: JSON.stringify(vrf) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a VRF (Virtual Routing and Forwarding) from NetBox using a VRF object with data.
   * This method is used when you need to delete a VRF by providing the VRF object
   * with identification data. For direct deletion by ID, use deleteVrfById instead.
   *
   * @param vrf - The VRF object containing identification data for deletion
   * @returns Promise resolving to the deleted VRF data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a VRF using object data
   * const vrfToDelete = { id: 10 };
   * const response = await netbox.deleteVrf(vrfToDelete);
   *
   * // Delete multiple VRFs using object data
   * const vrfObjects = [{ id: 8 }, { id: 9 }, { id: 10 }];
   * for (const vrfObj of vrfObjects) {
   *   await netbox.deleteVrf(vrfObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const vrfWithCriteria = {
   *   name: 'PRODUCTION_VRF',
   *   rd: '65000:100'
   * };
   * const response = await netbox.deleteVrf(vrfWithCriteria);
   * ```
   *
   * @throws {Error} When the VRF is not found (404) or other API errors occur
   * @see {@link NetboxVrf} For the VRF type definition
   * @see {@link deleteVrfById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteVrf(vrf: Partial<NetboxVrf>): Promise<NetboxVrf | undefined> {
    const response = await this.delete<NetboxVrf>(
      this.config.baseURL + `/ipam/vrfs/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(vrf),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a VRF (Virtual Routing and Forwarding) from NetBox by its ID.
   * This is the preferred method for deleting a single VRF when you know its ID.
   * Provides direct, efficient deletion without requiring object data.
   *
   * @param id - The unique identifier of the VRF to delete
   * @returns Promise resolving to the deleted VRF data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a VRF by ID (recommended for single deletions)
   * const response = await netbox.deleteVrfById(10);
   *
   * // Delete multiple VRFs by ID in a loop
   * const vrfIds = [8, 9, 10];
   * for (const vrfId of vrfIds) {
   *   await netbox.deleteVrfById(vrfId);
   * }
   *
   * // Error handling for VRF deletion
   * try {
   *   await netbox.deleteVrfById(999);
   * } catch (error) {
   *   if (error.response?.status === 404) {
   *     console.log('VRF not found');
   *   } else {
   *     console.error('Deletion failed:', error.message);
   *   }
   * }
   * ```
   *
   * @throws {Error} When the VRF is not found (404) or other API errors occur
   * @see {@link NetboxVrf} For the VRF type definition
   * @see {@link deleteVrf} For deletion using VRF object data
   */
  async deleteVrfById(id: number): Promise<NetboxVrf | undefined> {
    const response = await this.delete<NetboxVrf>(
      this.config.baseURL + `/ipam/vrfs/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates a VRF (Virtual Routing and Forwarding) in NetBox using PATCH method.
   * Updates only the specified fields, leaving other fields unchanged.
   *
   * @param vrf - Partial VRF object with fields to update
   * @param id - Optional ID of the VRF to update
   * @returns Promise resolving to the updated VRF or undefined if update fails
   *
   * @example
   * ```typescript
   * // Update only the description of a VRF
   * const updates = {
   *   description: 'Updated production VRF'
   * };
   * const response = await netbox.patchVrf(updates, 10);
   * const result = await response.json();
   * console.log(`Updated VRF: ${result.name}`);
   * ```
   *
   * @throws {Error} When the VRF is not found (404) or validation errors occur
   * @see {@link NetboxVrf} For the VRF type definition
   */
  async patchVrf(
    vrf: Partial<NetboxVrf>,
    id?: number
  ): Promise<NetboxVrf | undefined> {
    const response = await this.patch<NetboxVrf>(
      this.config.baseURL + (id ? `/ipam/vrfs/${id}/` : `/ipam/vrfs/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(vrf) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a VRF (Virtual Routing and Forwarding) in NetBox using PUT method.
   * Replaces the entire VRF object with the provided data.
   *
   * @param vrf - Complete VRF object for replacement (optional if ID is provided)
   * @param id - Optional ID of the VRF to update
   * @returns Promise resolving to the updated VRF
   *
   * @example
   * ```typescript
   * // Complete replacement of a VRF
   * const vrf = {
   *   name: 'Updated Production VRF',
   *   rd: '65000:200',
   *   tenant: 1,
   *   enforce_unique: false,
   *   description: 'Completely updated VRF'
   * };
   * const response = await netbox.updateVrf(vrf, 10);
   * const result = await response.json();
   * console.log(`Updated VRF: ${result.name}`);
   * ```
   *
   * @throws {Error} When the VRF is not found (404) or validation errors occur
   * @see {@link NetboxVrf} For the VRF type definition
   */
  async updateVrf(
    vrf?: NetboxVrf,
    id?: number
  ): Promise<NetboxVrf | undefined> {
    const response = await this.put<NetboxVrf>(
      this.config.baseURL + (id ? `/ipam/vrfs/${id}/` : `/ipam/vrfs/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !vrf ? undefined : JSON.stringify(vrf),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new VLAN in NetBox.
   * Adds a VLAN either at a specific ID location or creates a new one.
   *
   * @param vlan - The VLAN object to create
   * @param id - Optional ID for the VLAN (for updates/replacements)
   * @returns Promise resolving to the created VLAN or undefined if creation fails
   *
   * @example
   * ```typescript
   * // Create a new VLAN
   * const vlan = {
   *   name: 'Production',
   *   vid: 100,
   *   site: 1,
   *   status: 'active'
   * };
   * const response = await netbox.addVlan(vlan);
   * const result = await response.json();
   * console.log(`Created VLAN: ${result.name} (${result.vid})`);
   * ```
   *
   * @throws {Error} When validation errors occur or API errors
   * @see {@link NetboxVlan} For the VLAN type definition
   */
  async addVlan(
    vlan: NetboxVlan,
    id?: number
  ): Promise<NetboxVlan | undefined> {
    const response = await this.post<NetboxVlan>(
      this.config.baseURL + (id ? `/ipam/vlans/${id}/` : `/ipam/vlans/`),
      { ...this.config, method: "POST", body: JSON.stringify(vlan) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a VLAN from NetBox using a VLAN object with data.
   * This method is used when you need to delete a VLAN by providing the VLAN object
   * with identification data. For direct deletion by ID, use deleteVlanById instead.
   *
   * @param vlan - The VLAN object containing identification data for deletion
   * @returns Promise resolving to the deleted VLAN data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a VLAN using object data
   * const vlanToDelete = { id: 100 };
   * const response = await netbox.deleteVlan(vlanToDelete);
   *
   * // Delete multiple VLANs using object data
   * const vlanObjects = [{ id: 98 }, { id: 99 }, { id: 100 }];
   * for (const vlanObj of vlanObjects) {
   *   await netbox.deleteVlan(vlanObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const vlanWithCriteria = {
   *   name: 'Production',
   *   vid: 100,
   *   site: 1
   * };
   * const response = await netbox.deleteVlan(vlanWithCriteria);
   * ```
   *
   * @throws {Error} When the VLAN is not found (404) or other API errors occur
   * @see {@link NetboxVlan} For the VLAN type definition
   * @see {@link deleteVlanById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteVlan(vlan: Partial<NetboxVlan>): Promise<NetboxVlan | undefined> {
    const response = await this.delete<NetboxVlan>(
      this.config.baseURL + `/ipam/vlans/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(vlan),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a VLAN from NetBox by its ID.
   * This is the preferred method for deleting a single VLAN when you know its ID.
   * Provides direct, efficient deletion without requiring object data.
   *
   * @param id - The unique identifier of the VLAN to delete
   * @returns Promise resolving to the deleted VLAN data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a VLAN by ID (recommended for single deletions)
   * const response = await netbox.deleteVlanById(100);
   *
   * // Delete multiple VLANs by ID in a loop
   * const vlanIds = [98, 99, 100];
   * for (const vlanId of vlanIds) {
   *   await netbox.deleteVlanById(vlanId);
   * }
   *
   * // Error handling for VLAN deletion
   * try {
   *   await netbox.deleteVlanById(999);
   * } catch (error) {
   *   if (error.response?.status === 404) {
   *     console.log('VLAN not found');
   *   } else {
   *     console.error('Deletion failed:', error.message);
   *   }
   * }
   * ```
   *
   * @throws {Error} When the VLAN is not found (404) or other API errors occur
   * @see {@link NetboxVlan} For the VLAN type definition
   * @see {@link deleteVlan} For deletion using VLAN object data
   */
  async deleteVlanById(id: number): Promise<NetboxVlan | undefined> {
    const response = await this.delete<NetboxVlan>(
      this.config.baseURL + `/ipam/vlans/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific VLAN by its ID from NetBox.
   * VLANs represent Layer 2 network segments within your infrastructure.
   *
   * @param id - The unique identifier of the VLAN to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the VLAN data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get VLAN with basic information
   * const response = await netbox.getVlan(100);
   * const vlan = response.data;
   * console.log(`VLAN: ${vlan.name}, VID: ${vlan.vid}`);
   * ```
   *
   * @throws {Error} When the VLAN is not found (404) or other API errors occur
   * @see {@link NetboxVlan} For the VLAN type definition
   */
  async getVlan(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxVlan | undefined> {
    const response = await this.get<NetboxVlan>(
      this.config.baseURL +
        `/ipam/vlans/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of VLANs from NetBox IPAM module.
   * Returns VLAN objects representing Layer 2 network segments within infrastructure.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination (optional)
   * @param follow - Whether to follow pagination and return all results (optional)
   * @returns Promise resolving to paginated VLAN data
   *
   * @example
   * ```typescript
   * const response = await netbox.getVlans({
   *   site: 1,
   *   status: 'active',
   *   vid: 100,
   *   limit: 50
   * });
   * console.log(`Found ${response.json().count} VLANs`);
   * ```
   */
  async getVlans(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxVlan> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxVlan>>(
        `/ipam/vlans/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxVlan>>(
      this.config.baseURL + `/ipam/vlans/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates a VLAN in NetBox using PATCH method.
   * Updates only the specified fields, leaving other fields unchanged.
   *
   * @param vlan - Partial VLAN object with fields to update
   * @param id - Optional ID of the VLAN to update
   * @returns Promise resolving to the updated VLAN or undefined if update fails
   *
   * @example
   * ```typescript
   * // Update only the description of a VLAN
   * const updates = {
   *   description: 'Updated production network'
   * };
   * const response = await netbox.patchVlan(updates, 100);
   * const result = await response.json();
   * console.log(`Updated VLAN: ${result.name}`);
   * ```
   *
   * @throws {Error} When the VLAN is not found (404) or validation errors occur
   * @see {@link NetboxVlan} For the VLAN type definition
   */
  async patchVlan(
    vlan: Partial<NetboxVlan>,
    id?: number
  ): Promise<NetboxVlan | undefined> {
    const response = await this.patch<NetboxVlan>(
      this.config.baseURL + (id ? `/ipam/vlans/${id}/` : `/ipam/vlans/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(vlan) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a VLAN in NetBox using PUT method.
   * Replaces the entire VLAN object with the provided data.
   *
   * @param vlan - Complete VLAN object for replacement (optional if ID is provided)
   * @param id - Optional ID of the VLAN to update
   * @returns Promise resolving to the updated VLAN
   *
   * @example
   * ```typescript
   * // Complete replacement of a VLAN
   * const vlan = {
   *   name: 'Updated Production',
   *   vid: 101,
   *   site: 1,
   *   status: 'active',
   *   description: 'Completely updated VLAN'
   * };
   * const response = await netbox.updateVlan(vlan, 100);
   * const result = await response.json();
   * console.log(`Updated VLAN: ${result.name}`);
   * ```
   *
   * @throws {Error} When the VLAN is not found (404) or validation errors occur
   * @see {@link NetboxVlan} For the VLAN type definition
   */
  async updateVlan(
    vlan?: NetboxVlan,
    id?: number
  ): Promise<NetboxVlan | undefined> {
    const response = await this.put<NetboxVlan>(
      this.config.baseURL + (id ? `/ipam/vlans/${id}/` : `/ipam/vlans/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !vlan ? undefined : JSON.stringify(vlan),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new device in NetBox.
   * Adds a device either at a specific ID location or creates a new one.
   * Supports flexible type system for status, face, airflow, and nested object properties.
   *
   * @param device - The device object to create. Supports multiple type patterns:
   *   - String literals: `status: 'active'`, `face: 'front'`
   *   - Enums: `status: NetboxOperationalStatus.Active`, `face: NetboxRackFace.Front`
   *   - Value-label pairs: `status: { value: 'active', label: 'Active' }`
   *   - Readonly partial objects: `site: { readonly id: 1, readonly name: 'DC-01' }`
   * @param id - Optional ID for the device (for updates/replacements)
   * @returns Promise resolving to the created device or undefined if creation fails
   *   with readonly properties in all nested objects and value-label pairs
   *
   * @example
   * ```typescript
   * // Using string literals (simple approach)
   * const newDevice = {
   *   name: 'switch-access-01',
   *   device_type: 42,
   *   role: 1,
   *   site: 3,
   *   status: 'active', // NetboxOperationalStatuses string literal
   *   face: 'front', // NetboxRackFaces string literal
   *   serial: 'ABC123456'
   * };
   *
   * // Using enums (type-safe, recommended)
   * const newDeviceEnum = {
   *   name: 'switch-core-01',
   *   device_type: 42,
   *   role: 1,
   *   site: 3,
   *   status: NetboxOperationalStatus.Active, // Enum for type safety
   *   face: NetboxRackFace.Front, // Enum for rack face
   *   airflow: NetboxRackAirFlow["Front to rear"], // Enum for airflow
   *   serial: 'DEF789012'
   * };
   *
   * // Mixed approach with readonly nested objects
   * const newDeviceMixed = {
   *   name: 'router-edge-01',
   *   device_type: { readonly id: 42, readonly model: 'ASR1000' },
   *   role: { readonly id: 1, readonly name: 'Edge Router' },
   *   site: 3,
   *   tenant: { readonly id: 5, readonly name: 'Engineering' },
   *   status: NetboxOperationalStatus.Active,
   *   serial: 'GHI345678'
   * };
   *
   * const response = await netbox.addDevice(newDeviceEnum);
   * // Response contains immutable nested objects:
   * // response.json().status = { readonly value: 'active', readonly label: 'Active' }
   * // response.json().site = { readonly id: 3, readonly name: 'DC-West', ... }
   * ```
   *
   * @throws {Error} When validation errors occur or API errors
   * @see {@link NetboxDevice} For the device type definition and supported properties
   * @see {@link NetboxOperationalStatus} For available status enum values
   * @see {@link NetboxRackFace} For rack face enum values
   * @see {@link NetboxRackAirFlow} For airflow direction enum values
   */
  async addDevice(
    device: NetboxDevice,
    id?: number
  ): Promise<NetboxDevice | undefined> {
    const response = await this.post<NetboxDevice>(
      this.config.baseURL + (id ? `/dcim/devices/${id}/` : `/dcim/devices/`),
      { ...this.config, method: "POST", body: JSON.stringify(device) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a device from NetBox using a device object with data.
   * This method is used when you need to delete a device by providing the device object
   * with identification data. For direct deletion by ID, use deleteDeviceById instead.
   *
   * @param device - The device object containing identification data for deletion
   * @returns Promise resolving to the deleted device data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a device using object data
   * const deviceToDelete = { id: 100 };
   * const response = await netbox.deleteDevice(deviceToDelete);
   *
   * // Delete multiple devices using object data
   * const deviceObjects = [{ id: 98 }, { id: 99 }, { id: 100 }];
   * for (const deviceObj of deviceObjects) {
   *   await netbox.deleteDevice(deviceObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const deviceWithCriteria = {
   *   name: 'switch-core-01',
   *   site: 3,
   *   serial: 'ABC123456'
   * };
   * const response = await netbox.deleteDevice(deviceWithCriteria);
   * ```
   *
   * @throws {Error} When the device is not found (404) or other API errors occur
   * @see {@link NetboxDevice} For the device type definition
   * @see {@link deleteDeviceById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteDevice(
    device: Partial<NetboxDevice>
  ): Promise<NetboxDevice | undefined> {
    const response = await this.delete<NetboxDevice>(
      this.config.baseURL + `/dcim/devices/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(device),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a device from NetBox by its ID.
   * This is the preferred method for deleting a single device when you know its ID.
   * Provides direct, efficient deletion without requiring object data.
   *
   * @param id - The unique identifier of the device to delete
   * @returns Promise resolving to the deleted device data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a device by ID (recommended for single deletions)
   * const response = await netbox.deleteDeviceById(100);
   *
   * // Delete multiple devices by ID in a loop
   * const deviceIds = [98, 99, 100];
   * for (const deviceId of deviceIds) {
   *   await netbox.deleteDeviceById(deviceId);
   * }
   *
   * // Error handling for device deletion
   * try {
   *   await netbox.deleteDeviceById(999);
   * } catch (error) {
   *   if (error.response?.status === 404) {
   *     console.log('Device not found');
   *   } else {
   *     console.error('Deletion failed:', error.message);
   *   }
   * }
   * ```
   *
   * @throws {Error} When the device is not found (404) or other API errors occur
   * @see {@link NetboxDevice} For the device type definition
   * @see {@link deleteDevice} For deletion using device object data
   */
  async deleteDeviceById(id: number): Promise<NetboxDevice | undefined> {
    const response = await this.delete<NetboxDevice>(
      this.config.baseURL + `/dcim/devices/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a specific device by its ID from NetBox.
   * Devices represent physical network equipment, servers, and infrastructure components.
   *
   * @param id - The unique identifier of the device to retrieve
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the device data or undefined if not found
   *
   * @example
   * ```typescript
   * // Get device with basic information
   * const response = await netbox.getDevice(100);
   * const device = response.data;
   * console.log(`Device: ${device.name}, Type: ${device.device_type}`);
   * ```
   *
   * @throws {Error} When the device is not found (404) or other API errors occur
   * @see {@link NetboxDevice} For the device type definition
   */
  async getDevice(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxDevice | undefined> {
    const response = await this.get<NetboxDevice>(
      this.config.baseURL +
        `/dcim/devices/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves a paginated list of devices from NetBox.
   * Devices represent physical network equipment, servers, and infrastructure components.
   *
   * @param params - Optional query parameters for filtering, searching, and pagination
   * @param follow - Whether to follow pagination and return all results
   * @returns Promise resolving to paginated device data
   *
   * @example
   * ```typescript
   * // Get all devices
   * const response = await netbox.getDevices();
   * const devices = response.json().results;
   *
   * // Get devices with filtering
   * const response = await netbox.getDevices({
   *   site: 1,
   *   status: 'active',
   *   role: 'switch',
   *   limit: 50
   * });
   *
   * // Get devices by manufacturer
   * const response = await netbox.getDevices({
   *   manufacturer: 'cisco',
   *   ordering: 'name'
   * });
   *
   * // Get all devices across all pages
   * const response = await netbox.getDevices({}, true);
   * ```
   *
   * @throws {Error} When API errors occur (authentication, rate limiting, etc.)
   * @see {@link NetboxDevice} For the device type definition
   */
  async getDevices(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxDevice> | undefined> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxDevice>>(
        `/dcim/devices/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxDevice>>(
      this.config.baseURL + `/dcim/devices/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates a device in NetBox using PATCH method.
   * Updates only the specified fields, leaving other fields unchanged.
   *
   * @param device - Partial device object with fields to update
   * @param id - Optional ID of the device to update
   * @returns Promise resolving to the updated device or undefined if update fails
   *
   * @example
   * ```typescript
   * // Update only the description and status of a device
   * const updates = {
   *   description: 'Updated core switch',
   *   status: { value: 'active', label: 'Active' }
   * };
   * const response = await netbox.patchDevice(updates, 100);
   * const result = await response.json();
   * console.log(`Updated device: ${result.name}`);
   * ```
   *
   * @throws {Error} When the device is not found (404) or validation errors occur
   * @see {@link NetboxDevice} For the device type definition
   */
  async patchDevice(
    device: Partial<NetboxDevice>,
    id?: number
  ): Promise<NetboxDevice | undefined> {
    const response = await this.patch<NetboxDevice>(
      this.config.baseURL + (id ? `/dcim/devices/${id}/` : `/dcim/devices/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(device) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a device in NetBox using PUT method.
   * Replaces the entire device object with the provided data.
   *
   * @param device - Complete device object for replacement (optional if ID is provided)
   * @param id - Optional ID of the device to update
   * @returns Promise resolving to the updated device
   *
   * @example
   * ```typescript
   * // Complete replacement of a device
   * const device = {
   *   name: 'switch-core-01-updated',
   *   device_type: 42,
   *   role: 1,
   *   site: 3,
   *   status: { value: 'active', label: 'Active' },
   *   serial: 'ABC123456',
   *   asset_tag: 'ASSET-001',
   *   description: 'Completely updated core switch'
   * };
   * const response = await netbox.updateDevice(device, 100);
   * const result = await response.json();
   * console.log(`Updated device: ${result.name}`);
   * ```
   *
   * @throws {Error} When the device is not found (404) or validation errors occur
   * @see {@link NetboxDevice} For the device type definition
   */
  async updateDevice(
    device?: NetboxDevice,
    id?: number
  ): Promise<NetboxDevice | undefined> {
    const response = await this.put<NetboxDevice>(
      this.config.baseURL + (id ? `/dcim/devices/${id}/` : `/dcim/devices/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !device ? undefined : JSON.stringify(device),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves data from any NetBox API endpoint using a full URL.
   * This is a generic method that allows access to any NetBox API endpoint
   * when the full URL is known. Useful for following links from API responses
   * or accessing endpoints not covered by specific methods.
   *
   * @template T - The expected response data type
   * @param url - The full URL to the NetBox API endpoint
   * @param params - Optional query parameters for filtering or additional data
   * @returns Promise resolving to the requested data or undefined if request fails
   *
   * @example
   * ```typescript
   * // Get a specific custom field choice set by URL
   * const choiceSet = await netbox.getByUrl<NetboxCustomFieldChoiceSet>(
   *   'https://netbox.example.com/api/extras/custom-field-choice-sets/2/'
   * );
   *
   * // Follow a link from an API response
   * const prefix = await netbox.getPrefix(123);
   * if (prefix.data.site && typeof prefix.data.site === 'string') {
   *   const site = await netbox.getByUrl<NetboxSite>(prefix.data.site);
   * }
   *
   * // Access any NetBox endpoint with parameters
   * const devices = await netbox.getByUrl<NetboxPaginated<any>>(
   *   'https://netbox.example.com/api/dcim/devices/',
   *   { status: 'active', limit: 100 }
   * );
   *
   * // Get specific object by direct URL
   * const vlan = await netbox.getByUrl<NetboxVlan>(
   *   'https://netbox.example.com/api/ipam/vlans/456/'
   * );
   * ```
   *
   * @throws {Error} When the URL is invalid, not found (404), or other API errors occur
   * @since 0.0.1
   */
  async getByUrl<T>(
    url: string,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<T | undefined> {
    // If URL is already absolute, use it directly; otherwise prepend baseURL
    const fullUrl = url.startsWith("http") ? url : this.config.baseURL + url;
    const response = await this.get<T>(
      fullUrl + queryBuilderSync(params as any),
      {
        ...this.config,
        method: "GET",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated data from any NetBox API endpoint using a full URL with pagination support.
   * This method extends getByUrl with automatic pagination handling, useful for endpoints
   * that return large datasets across multiple pages.
   *
   * @template T - The expected response data type for individual items
   * @param url - The full URL to the NetBox API endpoint
   * @param params - Optional query parameters for filtering, searching, and pagination
   * @param follow - Whether to follow pagination and return all results across all pages
   * @returns Promise resolving to paginated data
   *
   * @example
   * ```typescript
   * // Get paginated devices from full URL
   * const devices = await netbox.getPaginatedByUrl<Device>(
   *   'https://netbox.example.com/api/dcim/devices/',
   *   { status: 'active', limit: 100 }
   * );
   * console.log(`Found ${devices.data.count} total devices`);
   *
   * // Get all results across all pages
   * const allDevices = await netbox.getPaginatedByUrl<Device>(
   *   'https://netbox.example.com/api/dcim/devices/',
   *   { status: 'active' },
   *   true  // Follow pagination
   * );
   *
   * // Follow a paginated link from an API response
   * const prefix = await netbox.getPrefix(123);
   * if (prefix.data.vlan && typeof prefix.data.vlan === 'string') {
   *   const vlans = await netbox.getPaginatedByUrl<NetboxVlan>(
   *     'https://netbox.example.com/api/ipam/vlans/',
   *     { site: prefix.data.site }
   *   );
   * }
   * ```
   *
   * @throws {Error} When the URL is invalid, not found (404), or other API errors occur
   * @see {@link NetboxPaginated} For the paginated response structure
   * @since 0.0.1
   */
  async getPaginatedByUrl<T>(
    url: string,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<T | undefined> {
    if (follow) {
      const response = await this.next<T>(url, params);

      return await response.json();
    }

    // If URL is already absolute, use it directly; otherwise prepend baseURL
    const fullUrl = url.startsWith("http") ? url : this.config.baseURL + url;
    const response = await this.get<T>(
      fullUrl + queryBuilderSync(params as any),
      {
        ...this.config,
        method: "GET",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Protected method that handles automatic pagination for NetBox API responses.
   * Follows pagination links and concatenates results from all pages into single response.
   *
   * @template T - The expected response data type for individual items
   * @param url - The API endpoint URL (can be relative or absolute)
   * @param params - Optional query parameters for the request (optional)
   * @returns Promise resolving to a response containing all results from all pages
   *
   * @example
   * ```typescript
   * // Used internally by methods with follow=true parameter
   * const allPrefixes = await netbox.getPrefixes({}, true);
   * // Internally calls: this.next<NetboxPaginated<NetboxPrefix>>('/ipam/prefixes/', params);
   * ```
   */
  protected async next<T>(
    path: string,
    params?: { [key: string]: any }
  ): Promise<ResponseGeneric<T>> {
    let tmp: any[] = [];
    // If URL is already absolute, use it directly; otherwise prepend baseURL
    let res = await this.get<any>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    tmp = data.results || [];

    while (data.next) {
      res = await this.get<any>(data.next, { ...this.config, method: "GET" });
      data = await res.json();
      if (data.results && data.results.length > 0) {
        tmp = tmp.concat(data.results);
      }
    }

    // Create final aggregated response
    const finalData: any = {
      ...data,
      results: tmp,
      count: tmp.length,
    };

    return {
      ...res,
      json: async () => finalData,
    } as ResponseGeneric<T>;
  }
}
