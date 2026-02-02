import { F5BigIPAddressListItem } from "./f5-bigip-address-list-item";

export interface F5BigIPAddressList {
  kind: string;
  selfLink: string;
  items: F5BigIPAddressListItem[];
}
