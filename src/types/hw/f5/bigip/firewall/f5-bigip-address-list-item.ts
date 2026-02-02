import { F5BigIPItems } from "../shared/f5-bigip-items";
import { F5BigIPAddress } from "./f5-bigip-address";

export interface F5BigIPAddressListItem extends F5BigIPItems {
  addresses?: F5BigIPAddress[];
}
