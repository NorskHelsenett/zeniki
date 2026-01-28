import { HTTPError } from "../../../../types";
import { VMwareAVILoginResponse } from "../../../../types/hw/vmware/avi/shared/vmware-avi-login-response";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * Driver for VMware AVI (NSX Advanced Load Balancer) API.
 * Handles authentication, session management, and API operations.
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const driver = new VMwareAVIDriver({ baseURL: 'https://avi.example.com/api' });
 * await driver.login('admin', 'password');
 * ```
 */
export class VMwareAVIDriver extends ZenikiCoreDriver {
  /**
   * Creates a new VMware AVI driver instance.
   * @param config - Request configuration
   * @example
   * ```typescript
   * new VMwareAVIDriver({ baseURL: 'https://avi.example.com/api' });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Authenticates with AVI controller and sets up session.
   * @param username - AVI username
   * @param password - AVI password
   * @returns Login response with user info and version
   * @throws {HTTPError} When authentication fails
   * @example
   * ```typescript
   * await driver.login('admin', 'password');
   * ```
   */
  public async login(username: string, password: string) {
    const response = await this.post<VMwareAVILoginResponse>(
      this.config.baseURL.replace("api", "login"),
      {
        credentials: "include",
        ...this.config,
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      },
    );

    if (response.ok) {
      // do config setup here to attach credentials
      const jsonResponse = await response.json();
      const aviVersion = jsonResponse.version?.Version + "";

      await this.setCookies(response.headers, "X-CSRFToken");
      const cfg: RequestConfig = {
        ...this.config,
        headers: {
          ...this.config.headers,
          "X-Avi-Tenant": "admin",
          "X-Avi-Version": aviVersion || "20.1.1",
        },
      };
      this.config = cfg;

      return jsonResponse;
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Logs out from AVI controller and clears session.
   * @returns HTTP status code
   * @throws {HTTPError} When not authenticated or logout fails
   * @example
   * ```typescript
   * await driver.logout();
   * ```
   */
  public async logout() {
    if (!this.is_authenticated) {
      throw new HTTPError(
        "Login required.",
        412,
        undefined,
        "Precondition Failed",
      );
    }
    const response = await this.post<number>(
      this.config.baseURL.replace("api", "logout"),
      {
        ...this.config,
        headers: {
          ...this.config.headers,
          Referer: this.config.baseURL.replace("api", ""),
        },
        credentials: "include",
        redirect: "manual",
        method: "POST",
      },
    );

    if (response.ok || response.status === 302) {
      // 302 is considered OK in logout, as we do not follow redirect.
      this.unsetCookies();
      return response.status;
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Performs authenticated GET request to AVI API endpoint.
   * @template T - Expected response data type
   * @param path - API endpoint path
   * @param params - Optional query parameters
   * @returns Typed data promise
   * @throws {HTTPError} When not authenticated or request fails
   * @example
   * ```typescript
   * const pools = await driver.getByUrl<Pool[]>('/pool');
   * ```
   */
  async getByUrl<T>(
    path: string,
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<T> {
    if (!this.is_authenticated) {
      throw new HTTPError(
        "Login required.",
        412,
        undefined,
        "Precondition Failed",
      );
    }
    const response = await this.get<T>(
      this.config.baseURL + path + queryBuilderSync(params as any),
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
}
