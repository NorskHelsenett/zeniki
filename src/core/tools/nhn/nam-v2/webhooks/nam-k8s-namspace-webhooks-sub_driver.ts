import { ObjectId } from "mongodb";
import {
  HTTPError,
//   NAMK8sNamespaceWebhook,
  NAMParams,
  NAMResponse,
} from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";
import { NAMK8sNamespaceWebhook } from "../../../../../types/tools/nhn/nam-v2/webhooks/nam-k8s-namespace-webhook";

/**
 * NAM Vitistack Network Policies Sub-Driver for managing Vitistack Network Policy configurations.
 * Provides methods to retrieve, create, update, and delete Vitistack Network Policies.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const policies = await nam.viti_networkpolicies.getK8sNamespaceWebhooks({ enabled: true });
 * ```
 */
export class NAMK8sNamespaceWebhooksSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific Vitistack Network Policy by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMK8sNamespaceWebhook
   * @example
   * ```typescript
   * const policy = await nam.viti_networkpolicies.getK8sNamespaceWebhook('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getK8sNamespaceWebhook(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMK8sNamespaceWebhook> {
    const response = await this.get<NAMK8sNamespaceWebhook>(
      this.config.baseURL +
        `/vitistack/network-policies/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Retrieve paginated list of K8s Namespace Webhooks.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMK8sNamespaceWebhook collection
   * @example
   * ```typescript
   * const namespaceWebhooks = await nam.viti_networkpolicies.getK8sNamespaceWebhooks({ enabled: true });
   * ```
   */
  async getK8sNamespaceWebhooks(
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMResponse<NAMK8sNamespaceWebhook>> {
    const response = await this.get<NAMResponse<NAMK8sNamespaceWebhook>>(
      this.config.baseURL +
        `/v2/webhooks/k8s/namespaces` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Create a new K8s Namespace Webhook configuration.
   * @param policy - NAMK8sNamespaceWebhook configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMK8sNamespaceWebhook
   * @example
   * ```typescript
   * const policy = await nam.k8s_namespace_webhooks.addK8sNamespaceWebhook({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
    // async addK8sNamespaceWebhook(
    //     policy: NAMK8sNamespaceWebhook,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams,
    // ): Promise<NAMK8sNamespaceWebhook> {
    //     const response = await this.post<NAMK8sNamespaceWebhook>(
    //     this.config.baseURL +
    //         `/v2/webhooks/k8s/namespaces` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "POST", body: JSON.stringify(policy) },
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response,
    //     );
    //     }
    // }

  /**
   * Update existing K8s Namespace Webhook with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param policy - Partial NAMK8sNamespaceWebhook object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMK8sNamespaceWebhook
   * @example
   * ```typescript
   * const updated = await nam.k8s_namespace_webhooks.patchK8sNamespaceWebhook('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
    // async patchK8sNamespaceWebhook(
    //     id: string | ObjectId,
    //     policy: Partial<NAMK8sNamespaceWebhook>,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams,
    // ): Promise<NAMK8sNamespaceWebhook> {
    //     const response = await this.patch<NAMK8sNamespaceWebhook>(
    //     this.config.baseURL +
    //         `/v2/webhooks/k8s/namespaces/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "PATCH", body: JSON.stringify(policy) },
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response,
    //     );
    //     }
    // }

  /**
   * Replace existing K8s Namespace Webhook with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param policy - Complete NAMK8sNamespaceWebhook configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMK8sNamespaceWebhook
   * @example
   * ```typescript
   * const policy = await nam.k8s_namespace_webhooks.updateK8sNamespaceWebhook('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   enabled: true
   * });
   * ```
   */
    // async updateK8sNamespaceWebhook(
    //     id: string | ObjectId,
    //     policy: NAMK8sNamespaceWebhook,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams,
    // ): Promise<NAMK8sNamespaceWebhook> {
    //     const response = await this.put<NAMK8sNamespaceWebhook>(
    //     this.config.baseURL +
    //         `/v2/webhooks/k8s/namespaces/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "PUT", body: JSON.stringify(policy) },
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response,
    //     );
    //     }
    // }

  /**
   * Delete K8s Namespace Webhook configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMK8sNamespaceWebhook
   * @example
   * ```typescript
   * await nam.viti_networkpolicies.deleteK8sNamespaceWebhook('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
    // async deleteK8sNamespaceWebhook(
    //     id: string | ObjectId,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams,
    // ): Promise<NAMK8sNamespaceWebhook> {
    //     const response = await this.delete<NAMK8sNamespaceWebhook>(
    //     this.config.baseURL +
    //         `/v2/webhooks/k8s/namespaces/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "DELETE" },
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response,
    //     );
    //     }
    // }

  /**
   * Internal method for automatic pagination handling.
   * @protected
   * @template T - Expected response data type
   * @param url - API endpoint URL
   * @param params - Optional query parameters with count and skip
   * @returns Promise resolving to complete paginated response
   */
  protected async next<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
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
      { ...this.config, method: "GET" },
    );
    let data = await res.json();
    const size = data.count || 0;
    let index = params.count;
    tmp = data.results || [];
    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" },
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
