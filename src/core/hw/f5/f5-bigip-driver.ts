import { HTTPError } from "../../../types";
import { F5BigIPLoginResponse } from "../../../types/hw/f5/bigip/shared/f5-bigip-login-response";
import { F5BigIPItemsResponse } from "../../../types/hw/f5/bigip/shared/f5-bigip-items-response";
import { RequestConfig, ZenikiCoreDriver } from "../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../utils";
import { F5BigIPDevice } from "../../../types/hw/f5/bigip/tm/cm/f5-bigip-device";
import { F5BigIPCMSubDriver } from "./tm/cm/f5-bigip-cm-sub_driver";
import { F5BigIPFirewallSubDriver } from "./security/firewall/f5-bigip-firewall-sub_driver";

/**
 * Driver for F5 BIG-IP API.
 * Handles authentication, session management, and API operations for F5 BIG-IP devices.
 * Supports HA failover state detection for high availability configurations.
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const driver = new F5BigIPDriver({ baseURL: 'https://bigip.example.com' });
 * await driver.login('admin', 'password', true);
 * const data = await driver.getByUrl('/mgmt/tm/ltm/pool');
 * ```
 */
export class F5BigIPDriver extends ZenikiCoreDriver {
  public cluster_management: F5BigIPCMSubDriver;
  public firewall: F5BigIPFirewallSubDriver;
  constructor(config: RequestConfig) {
    super(config);
    this.cluster_management = new F5BigIPCMSubDriver(this.config);
    this.firewall = new F5BigIPFirewallSubDriver(this.config);
  }

  private propagateConfig() {
    this.cluster_management.setInstanceConfig(this.config);
    this.firewall.setInstanceConfig(this.config);
  }

  /**
   * Authenticates with F5 BIG-IP and sets up session with optional HA state check.
   * @param username - F5 username
   * @param password - F5 password
   * @param ha - Check HA state and reject standby devices
   * @returns Login response with token or undefined if standby
   * @throws {HTTPError} When authentication fails
   * @example
   * ```typescript
   * await driver.login('admin', 'password', true);
   * ```
   */
  public async login(username: string, password: string, ha = false) {
    const response = await this.post<F5BigIPLoginResponse>(
      this.config.baseURL + "/mgmt/shared/authn/login",
      {
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

      const cfg: RequestConfig = {
        ...this.config,
        headers: {
          ...this.config.headers,
          "X-F5-Auth-Token": jsonResponse.token.token,
        },
      };
      this.config = cfg;
      this.setInstanceConfig(this.config);
      this.token = jsonResponse.token.token;

      if (ha) {
        const dev_response = await this.get<
          F5BigIPItemsResponse<F5BigIPDevice>
        >(
          this.config.baseURL + "/mgmt/tm/cm/device",
          this.config,
        );
        if (dev_response.ok) {
          const deviceResponse = await dev_response.json();
          const selfDeviceConfig = deviceResponse.items?.find(
            // (yes really, the string 'true' is what we're after here)
            (deviceConfig) => deviceConfig.selfDevice === "true",
          );
          if (selfDeviceConfig?.failoverState !== "active") {
            this.logout();
            throw new HTTPError(
              "HA member is not primary, please login to active HA member.",
              502,
              response,
              "BIGIP_HA_MEMBER",
            );
          }
        }
      }

      this.propagateConfig();
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
   * Logs out from F5 BIG-IP and invalidates session token.
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
    const response = await this.delete<number>(
      this.config.baseURL +
        `/mgmt/shared/authz/tokens/${this.token}`,
      {
        ...this.config,
        method: "DELETE",
      },
    );

    if (response.ok || response.status === 302) {
      // 302 is considered OK in logout, as we do not follow redirect.
      this.resetInstanceConfig();
      this.token = undefined;
      this.propagateConfig();
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
   * Performs authenticated GET request to F5 BIG-IP API endpoint.
   * @template T - Expected response data type
   * @param path - API endpoint path
   * @param params - Optional query parameters
   * @returns Typed data promise
   * @throws {HTTPError} When not authenticated or request fails
   * @example
   * ```typescript
   * const pools = await driver.getByUrl('/mgmt/tm/ltm/pool');
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
