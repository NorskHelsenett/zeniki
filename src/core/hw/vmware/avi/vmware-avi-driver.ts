import { HTTPError } from "../../../../types";
import { VMwareAVILoginResponse } from "../../../../types/hw/vmware/avi/shared/vmware-avi-login-response";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

export class VMwareAVIDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

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
