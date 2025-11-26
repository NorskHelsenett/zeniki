# NetBox Driver Documentation

## Summary

NetBox driver provides type-safe integration with NetBox IPAM systems for comprehensive network management. Supports CRUD operations across IPAM (prefixes, VRFs, VLANs), DCIM (devices, sites), Tenancy (tenants), and Extras (tags, custom fields) modules.

Features flexible type system accepting both string literals and type-safe enums, automatic pagination, immutable API responses with readonly properties, automatic CSRF token handling, and dual deletion patterns (object-based or ID-based).

All sub-drivers accessible via consistent interface: `netbox.prefixes.*`, `netbox.devices.*`, `netbox.vlans.*`, `netbox.vrfs.*`, `netbox.sites.*`, `netbox.tenants.*`, `netbox.tags.*`, `netbox.customFields.*`.

Includes NHN-specific enums for organizational filtering (environment, domain, infrastructure, purpose). Built on native fetch API with HTTPError exception handling.

## Table of Contents

- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Sub-Drivers](#sub-drivers)
- [Type Definitions](#type-definitions)

## Configuration

### Required Headers

```typescript
import { NetboxDriver } from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',  // NetBox API base URL
  headers: {
    'Authorization': 'Token your-api-token',   // Required: API authentication token
    'Content-Type': 'application/json'         // Required: JSON content type
  }
});
```

### Optional Configuration

```typescript
const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: {
    'Authorization': 'Token your-token',
    'Content-Type': 'application/json',
    'Accept': 'application/json'           // Optional: Response format
  },
  // Native fetch RequestInit options
  signal: AbortSignal.timeout(5000),       // Optional: Request timeout/cancellation
  keepalive: true,                         // Optional: Keep connection alive
  cache: 'no-cache',                       // Optional: Cache control
  redirect: 'follow'                       // Optional: Redirect handling
});
```

## Basic Usage

```typescript
import { NetboxDriver } from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: { 'Authorization': 'Token your-token' }
});

// Basic CRUD operations with string literals
const prefix = await netbox.prefixes.getPrefix(123);
const prefixes = await netbox.prefixes.getPrefixes({ status: 'active', family: 4 });
const newPrefix = await netbox.prefixes.addPrefix({ 
  prefix: '192.168.100.0/24', 
  status: 'active' 
});
await netbox.prefixes.patchPrefix({ description: 'Updated' }, 123);
await netbox.prefixes.deletePrefixById(123);
```

### Advanced Usage

```typescript
import { 
  NetboxDriver, 
  NetboxPrefixStatus,
  NHN_CommonNetboxExtraChoicesEnvironment 
} from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: { 'Authorization': 'Token your-token' }
});

// Automated prefix allocation with type-safe enums
const allocated = await netbox.prefixes.registerNextAvailablePrefix(
  42,      // Parent prefix ID
  26,      // Prefix length
  100,     // VLAN ID
  'Production network',
  { status: NetboxPrefixStatus.Active },
  { env: NHN_CommonNetboxExtraChoicesEnvironment.prod }
);

// Access all sub-drivers with consistent patterns
const devices = await netbox.devices.getDevices({ site: 1 });
const vlans = await netbox.vlans.getVlans({ status: 'active' }, true); // Auto-pagination
const tags = await netbox.tags.getTags({ slug: 'critical' });

// Generic URL access for any endpoint
const customData = await netbox.getByUrl('https://netbox.example.com/api/dcim/devices/');
```

## Sub-Drivers

All NetBox resources are accessed through specialized sub-drivers with consistent CRUD patterns:

### Available Sub-Drivers

- **`netbox.prefixes`** - IP prefix management (IPAM)
- **`netbox.vrfs`** - Virtual Routing and Forwarding instances (IPAM)
- **`netbox.vlans`** - VLAN management (IPAM)
- **`netbox.devices`** - Device inventory (DCIM)
- **`netbox.sites`** - Physical location management (DCIM)
- **`netbox.tenants`** - Multi-tenancy organization (Tenancy)
- **`netbox.tags`** - Flexible object labeling (Extras)
- **`netbox.customFields`** - Custom field definitions (Extras)

### Common Methods

Each sub-driver implements consistent CRUD operations:

```typescript
// Read operations
await netbox.prefixes.getPrefix(id, params?)           // Get single resource by ID
await netbox.prefixes.getPrefixes(params?, follow?)    // Get paginated list

// Create operations
await netbox.prefixes.addPrefix(data, id?)             // Create new resource

// Update operations
await netbox.prefixes.patchPrefix(updates, id)         // Partial update
await netbox.prefixes.updatePrefix(data, id)           // Complete replacement

// Delete operations
await netbox.prefixes.deletePrefix(data)               // Delete by object data
await netbox.prefixes.deletePrefixById(id)             // Delete by ID
```

## Type Definitions

The NetBox driver provides comprehensive TypeScript type definitions with enhanced type safety through enums and immutable data structures. All API responses use readonly properties to prevent accidental modifications, while input parameters support both string literals and type-safe enums for maximum flexibility.

### Key Type Features

- **Flexible Input Types**: Accept both string literals (`'active'`) and enums (`NetboxPrefixStatus.Active`)
- **Immutable Responses**: All API response properties are readonly for data integrity
- **Enhanced Enums**: Type-safe enums with full IDE autocompletion support
- **Value-Label Pairs**: Structured data with both machine-readable values and human-readable labels

### NetboxPrefix

```typescript
interface NetboxPrefix {
  id?: number;
  prefix: string | null;
  family: NetboxValueLabel<IPVersion, IPVersionLabel>;
  site?: number | Partial<NetboxSite> | null;
  vrf?: number | Partial<NetboxVrf> | null;
  tenant?: number | Partial<NetboxTenant> | null;
  status?: NetboxValueLabel<IPPrefixStatusValue, IPPrefixStatusLabel>;
  role?: number | Partial<NetboxRole> | null;
  description?: string;
  // ... and many more properties
}
```

### NetboxAvailablePrefix

```typescript
interface NetboxAvailablePrefix {
  family?: number;
  prefix?: string;
  vrf?: Partial<NetboxVrf>;
}
```

### NetboxCustomField

```typescript
interface NetboxCustomField {
  content_types: string[];
  type: NetboxValueLabel<string, string>;
  name: string;
  label?: string;
  group_name?: string;
  required?: boolean;
  default?: object | null;
  choice_set: number | Partial<NetboxCustomFieldChoiceSet> | null;
  // ... and many more properties
}
```

### NetboxCustomFieldChoiceSet

```typescript
interface NetboxCustomFieldChoiceSet {
  name: string;
  base_choices?: NetboxValueLabel<string, string>;
  extra_choices: [[string, string]];
  order_alphabetically?: boolean;
  readonly choices_count?: number;
  // ... and inherited properties
}
```

### NetboxVrf

```typescript
interface NetboxVrf {
  id?: number;
  name: string;
  rd?: string | null;
  tenant?: number | Partial<NetboxTenant> | null;
  enforce_unique?: boolean;
  description?: string;
  // ... and many more properties
}
```

### NetboxVlan

```typescript
interface NetboxVlan {
  id?: number;
  name: string;
  vid: number;
  site?: number | Partial<NetboxSite> | null;
  group?: number | Partial<NetboxVlanGroup> | null;
  tenant?: number | Partial<NetboxTenant> | null;
  status?: NetboxValueLabel<string, string>;
  // ... and many more properties
}
```

### NetboxSite

```typescript
interface NetboxSite {
  id?: number;
  name: string;
  slug: string;
  status?: NetboxValueLabel<string, string>;
  region?: number | Partial<NetboxRegion> | null;
  tenant?: number | Partial<NetboxTenant> | null;
  description?: string;
  // ... and many more properties
}
```

### NetboxTenant

```typescript
interface NetboxTenant {
  id?: number;
  name: string;
  slug: string;
  group?: number | Partial<NetboxTenantGroup> | null;
  description?: string;
  comments?: string;
  // ... and many more properties
}
```

### NetboxTag

```typescript
interface NetboxTag {
  id?: number;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  // ... and many more properties
}
```

### NetboxDevice

```typescript
interface NetboxDevice {
  id?: number;
  name: string;
  device_type: number | Partial<NetboxDeviceType>;
  role: number | Partial<NetboxDeviceRole>;
  site: number | Partial<NetboxSite>;
  tenant?: number | Partial<NetboxTenant> | null;
  status?: NetboxValueLabel<string, string>;
  serial?: string;
  // ... and many more properties
}
```

### NetboxParams

```typescript
interface NetboxParams {
  q?: string;          // General search
  limit?: number;      // Results per page
  offset?: number;     // Pagination offset
  ordering?: string;   // Field to sort by
  name?: string;       // Exact name match
  slug?: string;       // URL-safe identifier
  // ... extends NetboxPartial for additional filtering
}
```

### NHN Custom Field Types

NHN-specific NetBox custom field choices for organizational filtering and network categorization:

```typescript
// Environment classifications
enum NHN_CommonNetboxExtraChoicesEnvironment {
  na = "na",
  dev = "dev", 
  qa = "qa",
  test = "test",
  prod = "prod",
  mgmt = "mgmt",
  lab = "lab"
}

// Domain and DNS zone selections (44+ values)
enum NHN_CommonNetboxExtraChoicesDomain {
  na = "na",
  "nhn.local" = "nhn.local",
  "prod.drift.nhn.no" = "prod.drift.nhn.no",
  "mgmt.ld.nhn.no" = "mgmt.ld.nhn.no",
  // ... additional NHN organizational domains
}

// Infrastructure service classifications
enum NHN_CommonNetboxExtraChoicesInfrastructure {
  na = "na",
  bck = "bck",
  cert = "cert", 
  mgmt = "mgmt",
  prod = "prod",
  test = "test"
}

// Network segment purposes
enum NHN_CommonNetboxExtraChoicesPurpose {
  na = "na",
  datacenter = "datacenter",
  service = "service",
  mgmt = "mgmt",
  ops = "ops",
  // ... additional purpose classifications
}
```

**Usage in Custom Fields:**

```typescript
// Using NHN types for custom field values
const prefix = await netbox.addPrefix({
  prefix: '10.0.0.0/24',
  custom_fields: {
    env: NHN_CommonNetboxExtraChoicesEnvironment.prod,
    domain: NHN_CommonNetboxExtraChoicesDomain["nhn.local"],
    infra: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
    purpose: NHN_CommonNetboxExtraChoicesPurpose.datacenter
  }
});
```

## See Also

- [NetBox REST API Documentation](https://netbox.readthedocs.io/en/stable/rest-api/)
- [NetBox IPAM Models](https://netbox.readthedocs.io/en/stable/models/ipam/)
- [Main Zeniki Documentation](../../../../README.md)
