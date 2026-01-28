# VMware AVI Driver

Driver for VMware AVI (NSX Advanced Load Balancer) API interactions. Provides
authentication, session management, and resource operations through a clean
interface.

## Features

- Session-based authentication with automatic cookie handling
- CSRF token management
- Paginated API response handling
- Sub-drivers for specialized resource operations (IP Address Groups, DataScript
  Sets)
- Full CRUD operations support
- Type-safe API interactions

## Basic Usage

```typescript
import { VMwareAVIDriver } from "@norskhelsenett/zeniki";

const driver = new VMwareAVIDriver({
  baseURL: "https://avi.example.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Authenticate
await driver.login("admin", "password");

// Fetch resources
const pools = await driver.getByUrl("/pool");

// Logout
await driver.logout();
```

## Advanced Usage

```typescript
import { VMwareAVIDriver, VMwareAVIIpAddrGroup } from "@norskhelsenett/zeniki";

const driver = new VMwareAVIDriver({
  baseURL: "https://avi.example.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

await driver.login("admin", "password");

// Use sub-drivers for specific resources
const ipGroups = await driver.ip_address_groups.getIpAddrGroups({
  name: "production",
});

// Create IP address group
const newGroup = await driver.ip_address_groups.addIpAddrGroup({
  name: "backend-servers",
  prefixes: [
    { ip_addr: { addr: "10.0.0.0", type: "V4" }, mask: 24 },
  ],
});

// Create DataScript set
const scriptSet = await driver.vsdata_script_sets.addVSDataScriptSet({
  name: "request-logger",
  datascript: [
    {
      evt: "VS_DATASCRIPT_EVT_HTTP_REQ",
      script: "avi.http.get_uri()",
    },
  ],
});

// Paginated requests with automatic result aggregation
const allPolicies = await driver.getPaginatedByUrl("/policy", {}, true);

await driver.logout();
```

## Required Headers

The driver uses native fetch API and accepts standard `RequestInit`
configuration:

```typescript
const driver = new VMwareAVIDriver({
  baseURL: "https://avi.example.com/api",
  headers: {
    "Content-Type": "application/json",
    // Authentication headers are set automatically after login
  },
  // Optional fetch configuration
  credentials: "include",
  // Any other fetch RequestInit options
});
```

After successful login, the following headers are automatically set:

- `X-CSRFToken` - CSRF protection token from session
- `X-Avi-Tenant` - Tenant scope (default: 'admin')
- `X-Avi-Version` - API version from login response
- `Cookie` - Session cookies

## Sub-Drivers

### IP Address Groups

```typescript
// Get single group
const group = await driver.ip_address_groups.getIpAddrGroup("uuid-123");

// Get all groups
const groups = await driver.ip_address_groups.getIpAddrGroups();

// Create group
const newGroup = await driver.ip_address_groups.addIpAddrGroup({
  name: "test",
});

// Update group (full)
const updated = await driver.ip_address_groups.updateIpAddrGroup("uuid", {
  name: "updated",
});

// Patch group (partial)
const patched = await driver.ip_address_groups.patchIpAddrGroup("uuid", {
  description: "new desc",
});

// Delete group
await driver.ip_address_groups.deleteIpAddrGroup("uuid");
```

### DataScript Sets

```typescript
// Get single set
const set = await driver.vsdata_script_sets.getVSDataScriptSet('uuid-123');

// Get all sets
const sets = await driver.vsdata_script_sets.getVSDataScriptSets();

// Create set
const newSet = await driver.vsdata_script_sets.addVSDataScriptSet({ name: 'test' });

// Update set (full)
const updated = await driver.vsdata_script_sets.updateVSDataScriptSet('uuid', { name: 'updated' });

// Patch set (partial)
const patched = await driver.vsdata_script_sets.patchVSDataScriptSet('uuid', { datascript: [...] });

// Delete set
await driver.vsdata_script_sets.deleteVSDataScriptSet('uuid');
```

## Types

### VMwareAVIIpAddrGroup

```typescript
interface VMwareAVIIpAddrGroup {
  name: string;
  uuid?: string;
  addrs?: VMwareAVIIpAddr[];
  prefixes?: VMwareAVIIpAddrPrefix[];
  ranges?: VMwareAVIIpAddrRange[];
  ip_ports?: VMwareAVIIpAddrPort[];
  country_codes?: string[];
  marathon_app_name?: string;
  marathon_service_port?: number;
}
```

### VMwareAVIVSDataScriptSet

```typescript
interface VMwareAVIVSDataScriptSet {
  name: string;
  uuid?: string;
  datascript?: VMwareAVIVSDataScript[];
  ipgroup_refs?: string[];
  pool_refs?: string[];
  pool_group_refs?: string[];
  string_group_refs?: string[];
  rate_limiters?: VMwareAVIRateLimiter[];
  ssl_key_certificate_refs?: string[];
  ssl_profile_refs?: string[];
  protocol_parser_refs?: string[];
}
```

### VMwareAVIVSDataScript

```typescript
interface VMwareAVIVSDataScript {
  evt: VMwareAVIVSDataScriptTypes;
  script: string;
}
```

### VMwareAVIParams

```typescript
interface VMwareAVIParams {
  name?: string;
  refers_to?: string;
  referred_by?: string;
  fields?: string;
  include_name?: boolean;
  skip_default?: boolean;
  join_subresources?: string;
}
```

### VMwareAVIResponse<T>

```typescript
interface VMwareAVIResponse<T> {
  count: number;
  results: T[];
  next?: string;
}
```
