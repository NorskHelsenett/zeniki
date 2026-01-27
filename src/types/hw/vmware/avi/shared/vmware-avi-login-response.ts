import { VMwareAVILoginResponseVersion } from "./vmware-avi-login-response-version";

export interface VMwareAVILoginResponse {
  controller: object;
  session_cookie_name: string;
  system_config: object;
  tenants: object[];
  user?: object;
  user_initialized: boolean;
  version?: VMwareAVILoginResponseVersion;
}
