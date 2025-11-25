/**
 * @fileoverview NAM v2 driver for NHN Network Automation Management system integration.
 * Provides comprehensive API communication with NAM v2 for NetBox integrators, API endpoints,
 * and multi-vendor network automation. Built on ZenikiCoreDriver with MongoDB ObjectId support,
 * type-safe methods, and automated pagination handling for enterprise network management.
 *
 * Features include NetBox IPAM integration, FortiGate firewall synchronization, VMware NSX
 * micro-segmentation, and priority-based scheduling with custom field filtering capabilities.
 * Supports complete CRUD operations for integrator lifecycle management and API endpoint
 * configuration with SSL/TLS security options.
 *
 * Uses native fetch API for modern HTTP operations.
 *
 * @since NAM v2.0
 * @see ZenikiCoreDriver
 * @requires mongodb
 */

import {
  ZenikiCoreDriver,
  RequestConfig,
  ResponseGeneric,
} from "../../../base/zeniki-core-driver";
import { NAMResponse } from "../../../../types/tools/nhn/nam-v2/shared/nam-response";
import {
  HTTPError,
  NAMAPIEndpoint,
  NAMNetboxIntegrator,
  NAMRorIntegrator,
} from "../../../../types";
import { NAMParams } from "../../../../types/tools/nhn/nam-v2/shared/nam-params";
import { ObjectId } from "mongodb";
import { queryBuilderSync } from "../../../utils";

/**
 * NAM v2 driver class extending ZenikiCoreDriver for comprehensive network automation management.
 * Provides type-safe methods for NetBox integrators, API endpoints, and multi-vendor synchronization.
 * Supports MongoDB ObjectId operations, automated pagination, and enterprise-grade network orchestration.
 *
 * @class NAMv2Driver
 * @extends ZenikiCoreDriver
 * @since NAM v2.0
 * @copyright Copyright 2025 Norsk Helsenett SF
 * @author Kevin Andre Vatn <kevin.vatn@nhn.no>
 *
 * @example
 * ```typescript
 * // Basic NAM v2 driver initialization
 * const nam = new NAMv2Driver({
 *   baseURL: 'https://nam.company.com/api/v2',
 *   headers: { 'Authorization': 'Bearer token' },
 *   timeout: 30000
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Advanced configuration with custom settings
 * const nam = new NAMv2Driver({
 *   baseURL: 'https://nam.company.com/api/v2',
 *   headers: {
 *     'Authorization': 'Bearer api-token',
 *     'Content-Type': 'application/json',
 *     'X-Session-ID': 'session-123'
 *   },
 *   timeout: 60000,
 *   maxRedirects: 5,
 *   validateStatus: (status) => status < 400
 * });
 * ```
 */
export class NAMv2Driver extends ZenikiCoreDriver {
  /**
   * Initialize NAM v2 driver with request configuration for API communication.
   * Inherits HTTP methods and security features from ZenikiCoreDriver base class.
   *
   * @param config Request configuration including base URL and authentication headers
   *
   * @example
   * ```typescript
   * // Simple initialization
   * const nam = new NAMv2Driver({
   *   baseURL: 'https://nam.company.com/api/v2',
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Advanced configuration
   * const nam = new NAMv2Driver({
   *   baseURL: 'https://nam.company.com/api/v2',
   *   headers: {
   *     'Authorization': 'Bearer api-token',
   *     'Content-Type': 'application/json',
   *     'X-Session-ID': 'session-123'
   *   }
   * });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific NetBox integrator by MongoDB ObjectId or string identifier.
   * Returns complete integrator configuration including endpoints, VDOMs, and custom field settings.
   *
   * @param id MongoDB ObjectId or string identifier of the NetBox integrator
   * @param params optional query parameters for filtering and pagination
   * @returns Promise resolving to NAMNetboxIntegrator response
   *
   * @example
   * ```typescript
   * const response = await nam.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * const integrator = await response.json();
   * console.log(`Integrator: ${integrator.name}, Priority: ${integrator.sync_priority}`);
   * ```
   */
  async getNetboxIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNetboxIntegrator | undefined> {
    const response = await this.get<NAMNetboxIntegrator>(
      this.config.baseURL +
        `/vendors/netbox/netbox-integrators/${id}/` +
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
   * Retrieve paginated list of NetBox integrators with optional filtering capabilities.
   * Supports filtering by enabled state, priority level, and custom field values.
   *
   * @param params optional query parameters for filtering, pagination, and ordering
   * @returns Promise resolving to paginated NAMNetboxIntegrator collection
   *
   * @example
   * ```typescript
   * const integrators = await nam.getNetboxIntegrators({
   *   enabled: true,
   *   sync_priority: 'high',
   *   limit: 50
   * });
   * ```
   */
  async getNetboxIntegrators(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMNetboxIntegrator> | undefined> {
    const response = await this.get<NAMResponse<NAMNetboxIntegrator>>(
      this.config.baseURL +
        `/vendors/netbox/netbox-integrators/` +
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
   * Create a new NetBox integrator configuration with multi-vendor endpoint associations.
   * Supports FortiGate VDOM mappings, VMware NSX endpoints, and custom field filtering.
   *
   * @param integrator NAMNetboxIntegrator configuration object with required and optional properties
   * @param params optional query parameters for creation context
   * @returns Promise resolving to created NAMNetboxIntegrator response
   *
   * @example
   * ```typescript
   * const integrator = {
   *   name: 'production-sync',
   *   sync_priority: 'high',
   *   enabled: true,
   *   netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f',
   *   fortigate_endpoints: [{ endpoint: '674d7b2c8f1e4a1b2c3d4e60', vdoms: [] }]
   * };
   * const response = await nam.addNetboxIntegrator(integrator);
   * const result = await response.json();
   * console.log(`Created integrator: ${result.name}`);
   * ```
   */
  async addNetboxIntegrator(
    integrator: NAMNetboxIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNetboxIntegrator | undefined> {
    const response = await this.post<NAMNetboxIntegrator>(
      this.config.baseURL +
        `/vendors/netbox/netbox-integrators/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update existing NetBox integrator with partial configuration changes.
   * Allows modification of priority, endpoints, custom fields, and synchronization settings.
   *
   * @param id MongoDB ObjectId or string identifier of the integrator to update
   * @param integrator Partial NAMNetboxIntegrator object with properties to modify
   * @param params optional query parameters for update context
   * @returns Promise resolving to updated NAMNetboxIntegrator response
   *
   * @example
   * ```typescript
   * const updates = {
   *   sync_priority: 'critical',
   *   enabled: false
   * };
   * const response = await nam.patchNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', updates);
   * const result = await response.json();
   * console.log(`Updated integrator: ${result.name}`);
   * ```
   */
  async patchNetboxIntegrator(
    id: string | ObjectId,
    integrator: Partial<NAMNetboxIntegrator>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNetboxIntegrator | undefined> {
    const response = await this.patch<NAMNetboxIntegrator>(
      this.config.baseURL +
        `/vendors/netbox/netbox-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Replace existing NetBox integrator with complete new configuration.
   * Performs full replacement of integrator settings including all endpoints and custom fields.
   *
   * @param id MongoDB ObjectId or string identifier of the integrator to replace
   * @param integrator Complete NAMNetboxIntegrator configuration object
   * @param params optional query parameters for replacement context
   * @returns Promise resolving to updated NAMNetboxIntegrator response
   *
   * @example
   * ```typescript
   * const integrator = {
   *   name: 'updated-integrator',
   *   sync_priority: 'medium',
   *   enabled: true,
   *   netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f'
   * };
   * const response = await nam.updateNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', integrator);
   * const result = await response.json();
   * console.log(`Replaced integrator: ${result.name}`);
   * ```
   */
  async updateNetboxIntegrator(
    id: string | ObjectId,
    integrator: NAMNetboxIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNetboxIntegrator | undefined> {
    const response = await this.put<NAMNetboxIntegrator>(
      this.config.baseURL +
        `/vendors/netbox/netbox-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete NetBox integrator configuration and remove all associated synchronization schedules.
   * Permanently removes integrator from NAM v2 system with cascade cleanup of related data.
   *
   * @param id MongoDB ObjectId or string identifier of the integrator to delete
   * @param params optional query parameters for deletion context
   * @returns Promise resolving to deleted NAMNetboxIntegrator response
   *
   * @example
   * ```typescript
   * await nam.deleteNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * console.log('Integrator deleted successfully');
   * ```
   */
  async deleteNetboxIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNetboxIntegrator | undefined> {
    const response = await this.delete<NAMNetboxIntegrator>(
      this.config.baseURL +
        `/vendors/netbox/netbox-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve a specific ROR integrator by MongoDB ObjectId or string identifier.
   * Returns complete integrator configuration including associated endpoints and synchronization settings.
   *
   * @param id MongoDB ObjectId or string identifier of the ROR integrator
   * @param params optional query parameters for filtering and pagination
   * @returns Promise resolving to NAMRorIntegrator response
   *
   * @example
   * ```typescript
   * const response = await nam.getRorIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * const integrator = await response.json();
   * console.log(`Integrator: ${integrator.name}, Priority: ${integrator.sync_priority}`);
   * ```
   */
  async getRorIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMRorIntegrator | undefined> {
    const response = await this.get<NAMRorIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/ror-integrators/${id}/` +
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
   * Retrieve paginated list of ROR integrators with optional filtering capabilities.
   * Supports filtering by enabled state, priority level, and custom field values.
   *
   * @param params optional query parameters for filtering, pagination, and ordering
   * @returns Promise resolving to paginated NAMRorIntegrator collection
   *
   * @example
   * ```typescript
   * const integrators = await nam.getRorIntegrators({
   *   enabled: true,
   *   sync_priority: 'high',
   *   limit: 50
   * });
   * ```
   */
  async getRorIntegrators(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMRorIntegrator> | undefined> {
    const response = await this.get<NAMResponse<NAMRorIntegrator>>(
      this.config.baseURL +
        `/vendors/nhn/ror-integrators/` +
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
   * Create a new ROR integrator configuration with multi-vendor endpoint associations.
   *
   * @param integrator NAMRorIntegrator configuration object with required and optional properties
   * @param params optional query parameters for creation context
   * @returns Promise resolving to created NAMRorIntegrator response
   *
   * @example
   * ```typescript
   * const integrator = {
   *   name: 'production-sync',
   *   sync_priority: 'high',
   *   enabled: true,
   *   netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f',
   *   fortigate_endpoints: [{ endpoint: '674d7b2c8f1e4a1b2c3d4e60' }]
   * };
   * const response = await nam.addRorIntegrator(integrator);
   * const result = await response.json();
   * console.log(`Created integrator: ${result.name}`);
   * ```
   */
  async addRorIntegrator(
    integrator: NAMRorIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMRorIntegrator | undefined> {
    const response = await this.post<NAMRorIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/ror-integrators/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update existing ROR integrator with partial configuration changes.
   * Allows modification of priority, endpoints, custom fields, and synchronization settings.
   *
   * @param id MongoDB ObjectId or string identifier of the integrator to update
   * @param integrator Partial NAMRorIntegrator object with properties to modify
   * @param params optional query parameters for update context
   * @returns Promise resolving to updated NAMRorIntegrator response
   *
   * @example
   * ```typescript
   * const updates = {
   *   sync_priority: 'critical',
   *   enabled: false
   * };
   * const response = await nam.patchRorIntegrator('674d7b2c8f1e4a1b2c3d4e5f', updates);
   * const result = await response.json();
   * console.log(`Updated integrator: ${result.name}`);
   * ```
   */
  async patchRorIntegrator(
    id: string | ObjectId,
    integrator: Partial<NAMRorIntegrator>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMRorIntegrator | undefined> {
    const response = await this.patch<NAMRorIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/ror-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Replace existing ROR integrator with complete new configuration.
   * Performs full replacement of integrator settings including all endpoints and custom fields.
   *
   * @param id MongoDB ObjectId or string identifier of the integrator to replace
   * @param integrator Complete NAMRorIntegrator configuration object
   * @param params optional query parameters for replacement context
   * @returns Promise resolving to updated NAMRorIntegrator response
   *
   * @example
   * ```typescript
   * const integrator = {
   *   name: 'updated-integrator',
   *   sync_priority: 'medium',
   *   enabled: true,
   *   netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f'
   * };
   * const response = await nam.updateRorIntegrator('674d7b2c8f1e4a1b2c3d4e5f', integrator);
   * const result = await response.json();
   * console.log(`Replaced integrator: ${result.name}`);
   * ```
   */
  async updateRorIntegrator(
    id: string | ObjectId,
    integrator: NAMRorIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMRorIntegrator | undefined> {
    const response = await this.put<NAMRorIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/ror-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete ROR integrator configuration and remove all associated synchronization schedules.
   * Permanently removes integrator from NAM v2 system with cascade cleanup of related data.
   *
   * @param id MongoDB ObjectId or string identifier of the integrator to delete
   * @param params optional query parameters for deletion context
   * @returns Promise resolving to deleted NAMRorIntegrator response
   *
   * @example
   * ```typescript
   * await nam.deleteRorIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * console.log('Integrator deleted successfully');
   * ```
   */
  async deleteRorIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMRorIntegrator | undefined> {
    const response = await this.delete<NAMRorIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/ror-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve specific API endpoint configuration by MongoDB ObjectId or string identifier.
   * Returns complete endpoint details including authentication, SSL settings, and vendor type.
   *
   * @param id MongoDB ObjectId or string identifier of the API endpoint
   * @param params optional query parameters for filtering and context
   * @returns Promise resolving to NAMAPIEndpoint response
   *
   * @example
   * ```typescript
   * const response = await nam.getApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f');
   * const endpoint = await response.json();
   * console.log(`Endpoint: ${endpoint.name}, Type: ${endpoint.vendor_type}`);
   * ```
   */
  async getApiEndpoint(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint | undefined> {
    const response = await this.get<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
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
   * Retrieve paginated list of API endpoints with filtering by vendor type and enabled state.
   * Supports querying NetBox, FortiGate, VMware NSX, and other vendor endpoint configurations.
   *
   * @param params optional query parameters for filtering, pagination, and ordering
   * @returns Promise resolving to paginated NAMAPIEndpoint collection
   *
   * @example
   * ```typescript
   * const endpoints = await nam.getApiEndpoints({
   *   vendor_type: 'netbox',
   *   enabled: true,
   *   limit: 25
   * });
   * ```
   */
  async getApiEndpoints(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMAPIEndpoint> | undefined> {
    const response = await this.get<NAMResponse<NAMAPIEndpoint>>(
      this.config.baseURL +
        `/settings/api-endpoints/` +
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
   * Create new API endpoint configuration for vendor system integration.
   * Supports NetBox, FortiGate, VMware NSX endpoints with authentication and SSL options.
   *
   * @param endpoint NAMAPIEndpoint configuration object with vendor and connection details
   * @param params optional query parameters for creation context
   * @returns Promise resolving to created NAMAPIEndpoint response
   *
   * @example
   * ```typescript
   * const endpoint = {
   *   name: 'production-netbox',
   *   vendor_type: 'netbox',
   *   base_url: 'https://netbox.company.com',
   *   token: 'api-token-here',
   *   enabled: true
   * };
   * const response = await nam.addApiEndpoint(endpoint);
   * const result = await response.json();
   * console.log(`Created endpoint: ${result.name}`);
   * ```
   */
  async addApiEndpoint(
    endpoint: NAMAPIEndpoint,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint | undefined> {
    const response = await this.post<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(endpoint) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update existing API endpoint with partial configuration changes.
   * Allows modification of credentials, SSL settings, and connection parameters.
   *
   * @param id MongoDB ObjectId or string identifier of the endpoint to update
   * @param endpoint Partial NAMAPIEndpoint object with properties to modify
   * @param params optional query parameters for update context
   * @returns Promise resolving to updated NAMAPIEndpoint response
   *
   * @example
   * ```typescript
   * const updates = {
   *   token: 'new-api-token',
   *   enabled: false
   * };
   * const response = await nam.patchApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f', updates);
   * const result = await response.json();
   * console.log(`Updated endpoint: ${result.name}`);
   * ```
   */
  async patchApiEndpoint(
    id: string | ObjectId,
    endpoint: Partial<NAMAPIEndpoint>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint | undefined> {
    const response = await this.patch<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(endpoint) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Replace existing API endpoint with complete new configuration.
   * Performs full replacement of endpoint settings including authentication and SSL options.
   *
   * @param id MongoDB ObjectId or string identifier of the endpoint to replace
   * @param endpoint Complete NAMAPIEndpoint configuration object
   * @param params optional query parameters for replacement context
   * @returns Promise resolving to updated NAMAPIEndpoint response
   *
   * @example
   * ```typescript
   * const endpoint = {
   *   name: 'updated-endpoint',
   *   vendor_type: 'fortigate',
   *   base_url: 'https://fortigate.company.com',
   *   enabled: true
   * };
   * const response = await nam.updateApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f', endpoint);
   * const result = await response.json();
   * console.log(`Replaced endpoint: ${result.name}`);
   * ```
   */
  async updateApiEndpoint(
    id: string | ObjectId,
    endpoint: NAMAPIEndpoint,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint | undefined> {
    const response = await this.put<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(endpoint) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete API endpoint configuration and remove from all associated integrators.
   * Permanently removes endpoint from NAM v2 system with validation of dependencies.
   *
   * @param id MongoDB ObjectId or string identifier of the endpoint to delete
   * @param params optional query parameters for deletion context
   * @returns Promise resolving to deleted NAMAPIEndpoint response
   *
   * @example
   * ```typescript
   * await nam.deleteApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f');
   * console.log('API endpoint deleted successfully');
   * ```
   */
  async deleteApiEndpoint(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint | undefined> {
    const response = await this.delete<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve data from custom NAM v2 API URL with type-safe response handling.
   * Provides direct access to any NAM v2 endpoint with automatic response wrapping.
   *
   * @param url Custom API endpoint URL relative to NAM v2 base URL or full URL
   * @param params optional query parameters for custom endpoint
   * @returns Promise resolving to paginated NAMResponse with specified type
   *
   * @example
   * ```typescript
   * const customData = await nam.getByUrl<CustomType>('/custom/endpoint', {
   *   filter: 'active',
   *   sort: 'name'
   * });
   * ```
   */
  async getByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any }
  ): Promise<T | undefined> {
    const fullUrl =
      typeof url === "string" && !url.startsWith("http")
        ? this.config.baseURL + url + queryBuilderSync(params as any)
        : url;
    const response = await this.get<T>(fullUrl, {
      ...this.config,
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve paginated data from custom URL with optional automatic pagination following.
   * Supports manual pagination control or automatic collection of all pages.
   *
   * @param url Custom API endpoint URL for paginated data retrieval
   * @param params optional query parameters for pagination and filtering
   * @param follow optional boolean to automatically follow all pagination pages
   * @returns Promise resolving to paginated NAMResponse with specified type
   *
   * @example
   * ```typescript
   * const allData = await nam.getPaginatedByUrl<DataType>('/api/data', {
   *   limit: 100
   * }, true);
   * ```
   */
  async getPaginatedByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
    follow = false
  ): Promise<T | undefined> {
    if (follow) {
      const response = await this.next<T>(url as string, params);
      if (response.ok) {
        return await response.json();
      } else {
        throw new HTTPError(response.statusText, response.status, response);
      }
    }
    const fullUrl =
      typeof url === "string" && !url.startsWith("http")
        ? this.config.baseURL + url + queryBuilderSync(params as any)
        : url;
    const response = await this.get<T>(fullUrl, {
      ...this.config,
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Internal method for automatic pagination handling with configurable page size and skip logic.
   * Recursively fetches all pages and concatenates results for complete data collection.
   *
   * @protected
   * @param url API endpoint URL for paginated data retrieval
   * @param params optional query parameters with count and skip configuration
   * @returns Promise resolving to complete NAMResponse with all paginated results
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
    const size = data.count || 0;
    let index = params.count;
    tmp = data.results || [];
    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" }
      );
      data = await response.json();
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
