# F5 BIG-IP Driver

Driver for F5 BIG-IP load balancer API operations.

## Features

- Token-based authentication with automatic session management
- HA failover state detection for high availability configurations
- Cluster management operations via sub-driver
- Security firewall address list management via sub-driver
- Native fetch API with RequestConfig support
- Type-safe responses with TypeScript interfaces

## Basic Usage

```typescript
import { F5BigIPDriver } from "@norskhelsenett/zeniki";

const driver = new F5BigIPDriver({
  baseURL: "https://bigip.example.com",
  headers: { "Content-Type": "application/json" },
});

await driver.login("admin", "password");
const pools = await driver.getByUrl("/mgmt/tm/ltm/pool");
await driver.logout();
```

## Advanced Usage

```typescript
import { F5BigIPDriver } from "@norskhelsenett/zeniki";

const driver = new F5BigIPDriver({
  baseURL: "https://bigip.example.com",
  headers: { "Content-Type": "application/json" },
});

// Login with HA state check (rejects standby devices)
await driver.login("admin", "password", true);

// Get device configuration
const device = await driver.cluster_management.getDevice("bigip-01");

// Manage firewall address lists
const addressList = await driver.firewall.getAddressList("trusted-hosts");
await driver.firewall.patchAddressList("trusted-hosts", {
  addresses: [{ name: "192.168.1.10" }, { name: "192.168.1.20" }],
});

await driver.logout();
```

## Required Headers

The driver uses native fetch with `RequestConfig` (extends `RequestInit`):

```typescript
const config: RequestConfig = {
  baseURL: "https://bigip.example.com",
  headers: {
    "Content-Type": "application/json",
  },
};
```

After authentication, the `X-F5-Auth-Token` header is automatically added to all
requests.

## Sub-Drivers

### Cluster Management (`cluster_management`)

- `getDevice(name, partition?, params?)` - Get device configuration and state

### Security Firewall (`firewall`)

- `getAddressList(name, partition?, params?)` - Get firewall address list
- `getAddressLists(params?)` - Get all firewall address lists
- `addAddressList(data, params?)` - Create firewall address list
- `patchAddressList(name, data, partition?, params?)` - Partially update address
  list
- `updateAddressList(name, data, partition?, params?)` - Fully replace address
  list
- `deleteAddressList(name, partition?, params?)` - Delete address list

## Types

### Core Types

- `F5BigIPLoginResponse` - Authentication response with token
- `F5BigIPLoginToken` - Token details with expiration
- `F5BigIPItemsResponse<T>` - Collection response wrapper
- `F5BigIPPartial` - Base interface for BIG-IP resources

### Device Types

- `F5BigIPDevice` - Device configuration and HA state
- `F5BigIPLinkReference` - API resource reference
- `F5BigIPUnicastAddress` - Unicast address configuration

### Firewall Types

- `F5BigIPFirewallAddressList` - Firewall address list configuration
- `F5BigIPFirewallAddress` - Individual firewall address

## Error Handling

All methods throw `HTTPError` with status code and response details:

```typescript
try {
  await driver.login("admin", "wrong-password");
} catch (error) {
  if (error instanceof HTTPError) {
    console.error(`Error ${error.status}: ${error.message}`);
  }
}
```
