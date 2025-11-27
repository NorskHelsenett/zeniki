import {
  HTTPError,
  NetboxCustomField,
  NetboxCustomFieldChoiceSet,
  NetboxPaginated,
  NetboxParams,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";
import { NetboxDriver } from "../netbox-driver";

/**
 * NetBox Custom Fields Sub-Driver for managing Extras Custom Fields.
 * Provides methods to retrieve custom fields and choice sets for extending NetBox objects.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const fields = await netbox.customFields.getCustomFields({ content_types: 'ipam.prefix' });
 * ```
 */
export class NetboxCustomFieldsSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific custom field by its ID from NetBox.
   *
   * @param id - The unique identifier of the custom field to retrieve
   * @param params - Optional query parameters
   * @returns Promise resolving to the custom field data
   *
   * @example
   * ```typescript
   * const field = await netbox.customFields.getCustomField(5);
   * ```
   *
   * @throws {HTTPError} When the custom field is not found (404) or other API errors occur
   */
  async getCustomField(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxCustomField> {
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
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated custom field data
   *
   * @example
   * ```typescript
   * const fields = await netbox.customFields.getCustomFields({ content_types: 'ipam.prefix' });
   * ```
   *
   * @throws {HTTPError} When API errors occur
   */
  async getCustomFields(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxCustomField>> {
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
   *
   * @param id - The unique identifier of the choice set to retrieve
   * @param params - Optional query parameters
   * @returns Promise resolving to the choice set data
   *
   * @example
   * ```typescript
   * const choiceSet = await netbox.customFields.getCustomFieldChoiceSet(2);
   * ```
   *
   * @throws {HTTPError} When the choice set is not found (404) or other API errors occur
   */
  async getCustomFieldChoiceSet(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxCustomFieldChoiceSet> {
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
   * Retrieves a paginated list of custom field choice sets from NetBox.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated choice sets data
   *
   * @example
   * ```typescript
   * const choiceSets = await netbox.customFields.getCustomFieldChoiceSets();
   * ```
   *
   * @throws {HTTPError} When API errors occur
   */
  async getCustomFieldChoiceSets(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxCustomFieldChoiceSet>> {
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
   * Handles automatic pagination for NetBox API responses.
   *
   * @template T - The expected response data type
   * @param path - The API endpoint path
   * @param params - Optional query parameters
   * @returns Promise resolving to response with all paginated results
   *
   * @example
   * ```typescript
   * const all = await this.next('/extras/custom-fields/', {});
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
