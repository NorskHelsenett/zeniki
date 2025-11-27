# FortiOS Driver Documentation

## Summary

The FortiOS driver provides type-safe integration with Fortinet FortiGate firewalls (v7.4.x+) for managing addresses, address groups, and VDOMs through a modular sub-driver architecture. Core functionality includes IPv4/IPv6 dual-stack address management, multi-VDOM operations, and Security Fabric integration with EMS tag support and ZTNA configurations.

Key features include comprehensive TypeScript type definitions with enum support, HTTP error handling via `HTTPError` class, automatic pagination for large datasets, and specialized sub-drivers (`address`, `address6`, `addrgrp`, `addrgrp6`, `vdoms`) for organized API access. The driver supports enterprise features like fabric object distribution, dynamic group membership, and compliance automation.

Access patterns follow a consistent sub-driver structure: `fortios.address.*`, `fortios.address6.*`, `fortios.addrgrp.*`, `fortios.addrgrp6.*`, and `fortios.vdoms.*` for specialized operations, plus `getByUrl()` and `getPaginatedByUrl()` for generic API access. Each sub-driver provides standard CRUD operations with consistent method signatures.

Technical implementation uses native fetch API with `RequestConfig` supporting standard `RequestInit` options. Authentication via Bearer tokens or Basic Auth, with VDOM targeting through query parameters. Error handling through `HTTPError` class exposing HTTP status codes and response details.

## Table of Contents

- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Components](#components)
- [Type Definitions](#type-definitions)

## Configuration

### Required Parameters

```typescript
interface RequestConfig {
  baseURL: string;              // FortiGate API base URL (e.g., 'https://fortigate.company.com')
  headers?: HeadersInit;        // HTTP headers including authentication
}
```

### Optional Parameters

Supports standard `RequestInit` options from native fetch API:

- `method` - HTTP method (automatically set by driver methods)
- `body` - Request body (automatically set for POST/PUT/PATCH)
- `headers` - Additional HTTP headers
- `signal` - AbortSignal for request cancellation
- `credentials` - CORS credentials mode
- `cache` - Cache mode
- `redirect` - Redirect mode
- `referrer` - Referrer URL
- `referrerPolicy` - Referrer policy
- `integrity` - Subresource integrity
- `keepalive` - Keep connection alive
- `mode` - Request mode (cors, no-cors, same-origin)

Additional driver-specific options:

- `timeout` - Request timeout in milliseconds
- `params` - Query parameters (e.g., `{ vdom: 'production' }`)
- `auth` - Basic authentication credentials `{ username: string, password: string }`

### Configuration Examples

```typescript
// Bearer token authentication
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: { 'Authorization': 'Bearer your-api-token' }
});

// Basic authentication
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  auth: { username: 'admin', password: 'password' }
});

// VDOM-specific configuration
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: { 'Authorization': 'Bearer token' },
  params: { vdom: 'production' }
});
```

## Basic Usage

```typescript
import { FortiOSDriver } from '@norskhelsenett/zeniki';

const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: { 'Authorization': 'Bearer token' }
});

// IPv4 address operations
const address = await fortios.address.getAddress('web-server');
await fortios.address.addAddress({
  name: 'db-server',
  type: 'ipmask',
  subnet: '192.168.1.100/32',
  comment: 'Database server'
});

// IPv4 address group operations
const group = await fortios.addrgrp.getAddressGroup('web-servers');
await fortios.addrgrp.addAddressGroup({
  name: 'servers',
  type: 'default',
  member: [{ name: 'web-server' }, { name: 'db-server' }]
});

// VDOM operations
const vdom = await fortios.vdoms.getVdom('production');
```

## Advanced Usage

```typescript
import { FortiOSDriver, HTTPError } from '@norskhelsenett/zeniki';

const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: { 'Authorization': 'Bearer token' },
  params: { vdom: 'production' }  // Global VDOM setting
});

// Multi-component operations with error handling
try {
  // IPv4 and IPv6 dual-stack configuration
  await fortios.address.addAddress({
    name: 'web-server',
    type: 'ipmask',
    subnet: '192.168.1.100/32',
    'fabric-object': 'enable',
    comment: 'Web server with fabric sync'
  });

  await fortios.address6.addAddress6({
    name: 'web-server-ipv6',
    type: 'ipprefix',
    ip6: '2001:db8::100/128',
    comment: 'IPv6 web server'
  });

  // Create groups for both address families
  await fortios.addrgrp.addAddressGroup({
    name: 'web-tier',
    type: 'default',
    member: [{ name: 'web-server' }],
    'fabric-object': 'enable'
  });

  await fortios.addrgrp6.addAddressGroup6({
    name: 'web-tier-ipv6',
    type: 'default',
    member: [{ name: 'web-server-ipv6' }]
  });

  // VDOM management
  const vdoms = await fortios.vdoms.getVdoms();
  console.log(`Total VDOMs: ${vdoms.count}`);

  // Pagination for large datasets
  const allAddresses = await fortios.getPaginatedByUrl(
    '/cmdb/firewall/address',
    { page_size: 100 },
    true  // Follow pagination
  );

} catch (error) {
  if (error instanceof HTTPError) {
    console.error(`API Error ${error.code}: ${error.message}`);
    if (error.code === 424) console.log('Object already exists');
    if (error.code === 403) console.log('Insufficient permissions');
  }
}
```

## Components

### Sub-Drivers

**`address`** - FortiOSAddressSubDriver
- `getAddress(name, params?)` - Retrieve IPv4 address by name
- `getAddresses(params?)` - List all IPv4 addresses with filtering
- `addAddress(address, params?)` - Create new IPv4 address
- `updateAddress(name, address, params?)` - Update IPv4 address
- `deleteAddress(name, params?)` - Delete IPv4 address

**`address6`** - FortiOSAddress6SubDriver
- `getAddress6(name, params?)` - Retrieve IPv6 address by name
- `getAddresses6(params?)` - List all IPv6 addresses with filtering
- `addAddress6(address, params?)` - Create new IPv6 address
- `updateAddress6(name, address, params?)` - Update IPv6 address
- `deleteAddress6(name, params?)` - Delete IPv6 address

**`addrgrp`** - FortiOSAddrgrpSubDriver
- `getAddressGroup(name, params?)` - Retrieve IPv4 address group by name
- `getAddressGroups(params?)` - List all IPv4 address groups
- `addAddressGroup(group, params?)` - Create new IPv4 address group
- `updateAddressGroup(name, group, params?)` - Update IPv4 address group
- `deleteAddressGroup(name, params?)` - Delete IPv4 address group

**`addrgrp6`** - FortiOSAddrgrp6SubDriver
- `getAddressGroup6(name, params?)` - Retrieve IPv6 address group by name
- `getAddressGroups6(params?)` - List all IPv6 address groups
- `addAddressGroup6(group, params?)` - Create new IPv6 address group
- `updateAddressGroup6(name, group, params?)` - Update IPv6 address group
- `deleteAddressGroup6(name, params?)` - Delete IPv6 address group

**`vdoms`** - FortiOSVdomsSubDriver
- `getVdom(name, params?)` - Retrieve VDOM by name
- `getVdoms(params?)` - List all VDOMs
- `addVdom(vdom, params?)` - Create new VDOM
- `updateVdom(name, vdom, params?)` - Update VDOM configuration
- `deleteVdom(name, params?)` - Delete VDOM

### Generic Methods

- `getByUrl<T>(url, params?)` - Access any FortiOS API endpoint
- `getPaginatedByUrl<T>(url, params?, follow?)` - Paginated endpoint access with auto-follow

## Type Definitions

### Core Interfaces

**FortiOSFirewallAddress** - IPv4 address object
```typescript
interface FortiOSFirewallAddress {
  name: string;                    // Unique address name
  type: string;                    // 'ipmask' | 'iprange' | 'fqdn' | 'geography' | 'wildcard' | 'dynamic'
  subnet?: string;                 // CIDR notation (e.g., '192.168.1.0/24')
  'start-ip'?: string;            // Range start IP
  'end-ip'?: string;              // Range end IP
  fqdn?: string;                  // Fully qualified domain name
  country?: string;               // ISO country code
  comment?: string;               // Description
  'fabric-object'?: string;       // 'enable' | 'disable'
  'allow-routing'?: string;       // 'enable' | 'disable'
  'tag-detection'?: string;       // 'enable' | 'disable'
  'tag-type'?: string;           // 'ems' | 'dynamic'
}
```

**FortiOSFirewallAddress6** - IPv6 address object
```typescript
interface FortiOSFirewallAddress6 {
  name: string;                    // Unique address name
  type: string;                    // 'ipprefix' | 'iprange' | 'fqdn' | 'dynamic' | 'template'
  ip6?: string;                   // IPv6 prefix (e.g., '2001:db8::/64')
  'start-ip'?: string;            // Range start IPv6
  'end-ip'?: string;              // Range end IPv6
  fqdn?: string;                  // FQDN
  comment?: string;               // Description
  'fabric-object'?: string;       // 'enable' | 'disable'
}
```

**FortiOSFirewallAddrGrp** - IPv4 address group
```typescript
interface FortiOSFirewallAddrGrp {
  name: string;                    // Unique group name
  type: string;                    // 'default' | 'folder'
  member: Array<{ name: string }>; // Address members (max 600)
  comment?: string;               // Description
  'fabric-object'?: string;       // 'enable' | 'disable'
  exclude?: string;               // 'enable' | 'disable'
  'exclude-member'?: Array<{ name: string }>; // Excluded members
}
```

**FortiOSFirewallAddrGrp6** - IPv6 address group
```typescript
interface FortiOSFirewallAddrGrp6 {
  name: string;                    // Unique group name
  type: string;                    // 'default' | 'folder'
  member: Array<{ name: string }>; // IPv6 address members
  comment?: string;               // Description
  'fabric-object'?: string;       // 'enable' | 'disable'
}
```

**FortiOSSystemVDOM** - Virtual Domain configuration
```typescript
interface FortiOSSystemVDOM {
  name: string;                    // VDOM name
  'short-name'?: string;          // Short identifier
  vcluster?: number;              // Virtual cluster ID
  comment?: string;               // Description
}
```

### Request/Response Types

**FortiOSParams** - Query parameters
```typescript
interface FortiOSParams {
  vdom?: string;                  // Target VDOM
  filter?: string;                // Filter expression (e.g., 'name=@web-*')
  count?: number;                 // Max results
  start?: number;                 // Pagination offset
  sortby?: string;                // Sort field
  with_meta?: boolean;            // Include metadata
}
```

**FortiOSResponse<T>** - API response wrapper
```typescript
interface FortiOSResponse<T> {
  http_method: string;            // HTTP method
  results: T[];                   // Result objects
  vdom: string;                   // VDOM name
  path: string;                   // API path
  name: string;                   // Object name
  status: string;                 // 'success' | 'error'
  http_status: number;            // HTTP status code
  serial: string;                 // Device serial
  version: string;                // FortiOS version
  build: number;                  // Build number
  count?: number;                 // Total count
}
```

**FortiOSRevisionResponse** - Modification response
```typescript
interface FortiOSRevisionResponse {
  status: number;                 // HTTP status code
  statusText: string;             // Status message
  data?: string;                  // Response data
}
```

### Enums

**FortiOSFirewallAddressType**
```typescript
enum FortiOSFirewallAddressType {
  IP_Mask = 'ipmask',
  IP_Range = 'iprange',
  FQDN = 'fqdn',
  Geography = 'geography',
  Wildcard = 'wildcard',
  Dynamic = 'dynamic'
}
```

**CommonEnableDisable**
```typescript
enum CommonEnableDisable {
  Enable = 'enable',
  Disable = 'disable'
}
```

### Error Types

**HTTPError** - HTTP error class
```typescript
class HTTPError extends Error {
  code: number;                   // HTTP status code
  response: Response;             // Fetch Response object
  constructor(message: string, code: number, response: Response);
}
```

## See Also

- [FortiOS 7.4.x REST API Reference](https://docs.fortinet.com/document/fortigate/7.4.0/rest-api-reference)
- [Main Zeniki Documentation](../../../../README.md)