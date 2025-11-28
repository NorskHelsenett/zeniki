import {
  HTTPError,
  NetboxPaginated,
  NetboxParams,
  NetboxTag,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox tags sub-driver for managing tag resources in the Extras application.
 * Provides CRUD operations for tags that can be applied to various NetBox objects.
 *
 * @class NetboxTagsSubDriver
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const tag = await netbox.tags.addTag({
 *   name: 'Production',
 *   slug: 'production',
 *   color: '#ff0000',
 *   description: 'Production environment'
 * });
 * ```
 */
export class NetboxTagsSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific tag by ID.
   *
   * @param id - Tag ID
   * @param params - Optional query parameters
   * @returns Promise resolving to tag data
   * @throws {HTTPError} When tag is not found or API errors occur
   *
   * @example
   * ```typescript
   * const tag = await netbox.tags.getTag(3);
   * ```
   */
  async getTag(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxTag> {
    const response = await this.get<NetboxTag>(
      this.config.baseURL +
        `/extras/tags/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of tags.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated tags
   *
   * @example
   * ```typescript
   * const tags = await netbox.tags.getTags({ name__icontains: 'prod' });
   * ```
   */
  async getTags(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxTag>> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Creates a new tag.
   *
   * @param tag - Tag object to create
   * @param id - Optional ID for the tag
   * @returns Promise resolving to created tag
   * @throws {HTTPError} When validation or API errors occur
   *
   * @example
   * ```typescript
   * const tag = await netbox.tags.addTag({
   *   name: 'Production',
   *   slug: 'production',
   *   color: '#ff0000'
   * });
   * ```
   */
  async addTag(tag: NetboxTag, id?: number): Promise<NetboxTag> {
    const response = await this.post<NetboxTag>(
      this.config.baseURL + (id ? `/extras/tags/${id}/` : `/extras/tags/`),
      { ...this.config, method: "POST", body: JSON.stringify(tag) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a tag using object data.
   *
   * @param tag - Tag object with identification data
   * @returns Promise resolving to deleted tag
   * @throws {HTTPError} When tag is not found or API errors occur
   *
   * @example
   * ```typescript
   * await netbox.tags.deleteTag({ id: 3 });
   * ```
   */
  async deleteTag(tag: Partial<NetboxTag>): Promise<NetboxTag> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a tag by ID.
   *
   * @param id - Tag ID to delete
   * @returns Promise resolving to deleted tag
   * @throws {HTTPError} When tag is not found or API errors occur
   *
   * @example
   * ```typescript
   * await netbox.tags.deleteTagById(3);
   * ```
   */
  async deleteTagById(id: number): Promise<NetboxTag> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Partially updates a tag using PATCH.
   *
   * @param tag - Partial tag object with fields to update
   * @param id - Optional tag ID
   * @returns Promise resolving to updated tag
   * @throws {HTTPError} When tag is not found or validation errors occur
   *
   * @example
   * ```typescript
   * const tag = await netbox.tags.patchTag({ color: '#00ff00' }, 3);
   * ```
   */
  async patchTag(
    tag: Partial<NetboxTag>,
    id?: number
  ): Promise<NetboxTag> {
    const response = await this.patch<NetboxTag>(
      this.config.baseURL + (id ? `/extras/tags/${id}/` : `/extras/tags/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(tag) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Completely updates a tag using PUT.
   *
   * @param tag - Complete tag object for replacement
   * @param id - Optional tag ID
   * @returns Promise resolving to updated tag
   * @throws {HTTPError} When tag is not found or validation errors occur
   *
   * @example
   * ```typescript
   * const tag = await netbox.tags.updateTag({
   *   name: 'Production',
   *   slug: 'production',
   *   color: '#0000ff'
   * }, 3);
   * ```
   */
  async updateTag(
    tag?: NetboxTag,
    id?: number
  ): Promise<NetboxTag> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Handles automatic pagination for API responses.
   *
   * @template T - Expected response data type
   * @param path - API endpoint path
   * @param params - Optional query parameters
   * @returns Promise resolving to response with all results
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
