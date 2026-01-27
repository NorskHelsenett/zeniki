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
      this.pre_login = true;
      // do config setup here to attach credentials

      const cookies = response.headers.getSetCookie();
      const csrfTokenCookie = cookies.find((c) => c.includes("csrftoken="));
      const csrfToken = csrfTokenCookie?.match(/csrftoken=([^;]+)/)?.[1] || "";
      const jsonResponse = await response.json();
      const aviVersion = jsonResponse.version?.Version + "";

      this.setCookies(response.headers, "X-CSRFToken");
      const cfg: RequestConfig = {
        ...this.config,
        headers: {
          ...this.config.headers,
          "X-Avi-Tenant": "admin",
          "X-Avi-Version": aviVersion || "20.1.1",
          "X-CSRFToken": csrfToken,
          Cookie: cookies.join("; "),
        },
        credentials: "include",
      };
      this.config = cfg;
      this.setInstanceConfig(this.config);

      return jsonResponse;
    } else {
      this.pre_login = false;
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  public async logout() {
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
      this.pre_login = false;
      // 302 is considered OK in logout, as we do not follow redirect.
      return response.status;
    } else {
      this.pre_login = false;
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
