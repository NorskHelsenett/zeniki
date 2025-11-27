import { ObjectId } from "mongodb";
import { HTTPError, NAMNetboxIntegrator, NAMParams, NAMResponse } from "../../../../../types";
import { RequestConfig, ResponseGeneric, ZenikiCoreDriver } from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

export class NAMNetboxIntegratorsSubDriver extends ZenikiCoreDriver {
      constructor(public config: RequestConfig) {
        super(config);
      }

      /**
         * Retrieve a specific NetBox integrator by MongoDB ObjectId.
         * @param id - MongoDB ObjectId or string identifier
         * @param params - Optional query parameters
         * @returns Promise resolving to NAMNetboxIntegrator
         * @example
         * ```typescript
         * const integrator = await nam.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
         * ```
         */
        async getNetboxIntegrator(
          id: string | ObjectId,
          params?: { [key: string]: any } | NAMParams | URLSearchParams
        ): Promise<NAMNetboxIntegrator> {
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
         * Retrieve paginated list of NetBox integrators.
         * @param params - Optional query parameters for filtering and pagination
         * @returns Promise resolving to paginated NAMNetboxIntegrator collection
         * @example
         * ```typescript
         * const integrators = await nam.getNetboxIntegrators({ enabled: true });
         * ```
         */
        async getNetboxIntegrators(
          params?: { [key: string]: any } | NAMParams | URLSearchParams
        ): Promise<NAMResponse<NAMNetboxIntegrator>> {
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
         * Create a new NetBox integrator configuration.
         * @param integrator - NAMNetboxIntegrator configuration object
         * @param params - Optional query parameters
         * @returns Promise resolving to created NAMNetboxIntegrator
         * @example
         * ```typescript
         * const integrator = await nam.addNetboxIntegrator({
         *   name: 'production-sync',
         *   enabled: true
         * });
         * ```
         */
        async addNetboxIntegrator(
          integrator: NAMNetboxIntegrator,
          params?: { [key: string]: any } | NAMParams | URLSearchParams
        ): Promise<NAMNetboxIntegrator> {
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
         * Update existing NetBox integrator with partial changes.
         * @param id - MongoDB ObjectId or string identifier
         * @param integrator - Partial NAMNetboxIntegrator object
         * @param params - Optional query parameters
         * @returns Promise resolving to updated NAMNetboxIntegrator
         * @example
         * ```typescript
         * const updated = await nam.patchNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
         * ```
         */
        async patchNetboxIntegrator(
          id: string | ObjectId,
          integrator: Partial<NAMNetboxIntegrator>,
          params?: { [key: string]: any } | NAMParams | URLSearchParams
        ): Promise<NAMNetboxIntegrator> {
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
         * Replace existing NetBox integrator with complete configuration.
         * @param id - MongoDB ObjectId or string identifier
         * @param integrator - Complete NAMNetboxIntegrator configuration
         * @param params - Optional query parameters
         * @returns Promise resolving to updated NAMNetboxIntegrator
         * @example
         * ```typescript
         * const integrator = await nam.updateNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { name: 'updated' });
         * ```
         */
        async updateNetboxIntegrator(
          id: string | ObjectId,
          integrator: NAMNetboxIntegrator,
          params?: { [key: string]: any } | NAMParams | URLSearchParams
        ): Promise<NAMNetboxIntegrator> {
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
         * Delete NetBox integrator configuration.
         * @param id - MongoDB ObjectId or string identifier
         * @param params - Optional query parameters
         * @returns Promise resolving to deleted NAMNetboxIntegrator
         * @example
         * ```typescript
         * await nam.deleteNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
         * ```
         */
        async deleteNetboxIntegrator(
          id: string | ObjectId,
          params?: { [key: string]: any } | NAMParams | URLSearchParams
        ): Promise<NAMNetboxIntegrator> {
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
           * Internal method for automatic pagination handling.
           * @protected
           * @template T - Expected response data type
           * @param url - API endpoint URL
           * @param params - Optional query parameters with count and skip
           * @returns Promise resolving to complete paginated response
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