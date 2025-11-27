# NAM v2 Driver Documentation

## Summary

NAM (Network Architecture Management) v2 driver provides enterprise-grade integration with NHN's network infrastructure orchestration system. Manages centralized automation for NetBox IPAM synchronization, multi-vendor firewall configurations (FortiGate), and VMware NSX security groups with MongoDB-backed persistence.

Features comprehensive CRUD operations through specialized sub-drivers: `netbox_integrators` for NetBox integration management, `ror_integrators` for ROR synchronization, and `api_endpoints` for vendor API configuration. Supports priority-based scheduling, multi-tenant isolation, NHN-specific custom field filtering (environment, domain, infrastructure, purpose), VDOM-aware FortiGate operations, and NSX micro-segmentation.

Sub-driver architecture enables modular resource management with consistent CRUD patterns. Access via `nam.netbox_integrators.*`, `nam.ror_integrators.*`, and `nam.api_endpoints.*` methods. Generic endpoint access through `nam.getByUrl()` and `nam.getPaginatedByUrl()` for custom operations.

Built on native fetch API with HTTPError exception handling, type-safe TypeScript interfaces, and automatic pagination support. Implements MongoDB ObjectId references for document relationships, SSL/TLS configuration management, and API key expiration tracking.

## Table of Contents

- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [API Methods](#api-methods)
- [Type Definitions](#type-definitions)

## Configuration

### Constructor

```typescript
new NAMv2Driver(config: RequestConfig)
```

### Required Parameters

- **`baseURL`** - Base URL of NAM v2 API endpoint (e.g., `https://nam.company.com/api/v2`)
- **`headers.Authorization`** - API authentication token (`Bearer your-api-token`)
- **`headers['Content-Type']`** - Content type header (typically `application/json`)

### Optional Parameters (Native Fetch RequestInit)

- **`signal`** - AbortSignal for request cancellation
- **`keepalive`** - Keep connection alive for multiple requests
- **`cache`** - Cache mode (`default`, `no-cache`, `reload`, `force-cache`, `only-if-cached`)
- **`redirect`** - Redirect handling (`follow`, `error`, `manual`)

### Configuration Examples

```typescript
import { NAMv2Driver } from '@norskhelsenett/zeniki';

// Basic configuration with API token
const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  }
});

// Configuration with abort signal
const controller = new AbortController();
const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  signal: controller.signal
});
```

## Basic Usage

```typescript
import { NAMv2Driver } from '@norskhelsenett/zeniki';

const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  }
});

// NetBox integrator operations
const integrator = await nam.netbox_integrators.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
const integrators = await nam.netbox_integrators.getNetboxIntegrators({ enabled: true });

await nam.netbox_integrators.addNetboxIntegrator({
  name: 'datacenter-sync',
  sync_priority: 'medium',
  enabled: true,
  address_family: '4',
  depth: 2,
  mask_lte: 24,
  create_fg_group: true,
  netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f',
  fortigate_endpoints: [{
    endpoint: '674d7b2c8f1e4a1b2c3d4e60',
    vdoms: [{ name: 'root', enabled: true }]
  }]
});

// ROR integrator operations
const rorIntegrator = await nam.ror_integrators.getRorIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
await nam.ror_integrators.patchRorIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });

// API endpoint operations
const endpoint = await nam.api_endpoints.getApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f');
await nam.api_endpoints.deleteApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f');
```

## Advanced Usage

```typescript
import { NAMv2Driver, NHN_CommonNetboxExtraChoicesEnvironments, HTTPError } from '@norskhelsenett/zeniki';

const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: { 'Authorization': 'Bearer token' }
});

// Create multi-vendor API endpoints
const netboxEP = await nam.api_endpoints.addApiEndpoint({
  name: 'netbox-primary',
  url: 'https://netbox.company.com/api',
  vendor: 'generic',
  type: 'api',
  key: 'netbox-token',
  enabled: true
});

const fortigateEP = await nam.api_endpoints.addApiEndpoint({
  name: 'fortigate-cluster',
  url: 'https://fortigate.company.com/api/v2',
  vendor: 'fortinet',
  type: 'fw',
  user: 'admin',
  pass: 'password',
  enabled: true
});

// Create integrator with NHN custom fields and multi-VDOM support
const integrator = await nam.netbox_integrators.addNetboxIntegrator({
  name: 'production-automation',
  sync_priority: 'high',
  enabled: true,
  address_family: '4',
  depth: 3,
  mask_lte: 28,
  environments: [
    { name: 'prod' as NHN_CommonNetboxExtraChoicesEnvironments },
    { name: 'mgmt' as NHN_CommonNetboxExtraChoicesEnvironments }
  ],
  tenants: [{ id: 1, name: 'Production', slug: 'production' }],
  create_fg_group: true,
  fg_group_name: 'Auto_{{tenant}}_{{environment}}',
  netbox_endpoint: netboxEP._id,
  fortigate_endpoints: [{
    endpoint: fortigateEP._id,
    vdoms: [
      { name: 'production', enabled: true },
      { name: 'dmz', enabled: true }
    ]
  }]
});

// Error handling with HTTPError
try {
  await nam.netbox_integrators.patchNetboxIntegrator(integrator._id, { sync_priority: 'critical' });
} catch (error) {
  if (error instanceof HTTPError) {
    console.error(`API error ${error.code}: ${error.message}`);
  }
}

// Generic endpoint access with pagination
const customData = await nam.getPaginatedByUrl('/vendors/custom/resource', {}, true);
```

## Components

### NetBox Integrators Sub-Driver (`nam.netbox_integrators`)

Manages NetBox IPAM integrator configurations for automated synchronization.

- **`getNetboxIntegrator(id, params?)`** - Retrieve single integrator by ObjectId
- **`getNetboxIntegrators(params?)`** - List integrators with filtering/pagination
- **`addNetboxIntegrator(integrator, params?)`** - Create new integrator
- **`patchNetboxIntegrator(id, integrator, params?)`** - Partial update
- **`updateNetboxIntegrator(id, integrator, params?)`** - Complete replacement
- **`deleteNetboxIntegrator(id, params?)`** - Delete integrator

### ROR Integrators Sub-Driver (`nam.ror_integrators`)

Manages ROR (Regional Operational Registry) integrator configurations.

- **`getRorIntegrator(id, params?)`** - Retrieve single ROR integrator by ObjectId
- **`getRorIntegrators(params?)`** - List ROR integrators with filtering/pagination
- **`addRorIntegrator(integrator, params?)`** - Create new ROR integrator
- **`patchRorIntegrator(id, integrator, params?)`** - Partial update
- **`updateRorIntegrator(id, integrator, params?)`** - Complete replacement
- **`deleteRorIntegrator(id, params?)`** - Delete ROR integrator

### API Endpoints Sub-Driver (`nam.api_endpoints`)

Manages vendor API endpoint configurations (NetBox, FortiGate, NSX).

- **`getApiEndpoint(id, params?)`** - Retrieve single endpoint by ObjectId
- **`getApiEndpoints(params?)`** - List endpoints with filtering/pagination
- **`addApiEndpoint(endpoint, params?)`** - Create new endpoint
- **`patchApiEndpoint(id, endpoint, params?)`** - Partial update
- **`updateApiEndpoint(id, endpoint, params?)`** - Complete replacement
- **`deleteApiEndpoint(id, params?)`** - Delete endpoint

### Generic Methods (Main Driver)

- **`getByUrl<T>(url, params?)`** - Access custom NAM v2 endpoints directly
- **`getPaginatedByUrl<T>(url, params?, follow?)`** - Paginated requests with auto-aggregation

## Type Definitions

The NAM v2 driver provides comprehensive TypeScript type definitions for all NAM API objects and MongoDB-backed persistence.

### NAMNetboxIntegrator

Main integrator interface extending MongoDB document fields:

```typescript
interface NAMNetboxIntegrator extends NAMDefaultFields {
  // Basic configuration
  name: string;                                    // Integrator identifier
  desc?: string;                                   // Optional description
  sync_priority: SyncPriorities;                   // Execution priority
  enabled: Boolean;                                // Active state flag
  
  // NetBox filtering
  tenants?: NetboxTenant[];                        // Multi-tenant filtering
  role?: NetboxRole;                               // Role-based filtering
  sites?: NetboxSite[];                            // Geographic filtering
  status?: NetboxPrefixStatuses | NetboxPrefixStatus; // Status filtering
  address_family?: IPVersionString;                // IP version filtering
  vrf?: NetboxVrf;                                 // VRF context filtering
  
  // Synchronization parameters
  depth?: number;                                  // Hierarchy depth (0-10)
  mask_lte?: number;                               // Maximum prefix length
  mask_gte?: number;                               // Minimum prefix length
  
  // FortiGate integration
  create_fg_group?: boolean;                       // Enable FortiGate groups
  fg_group_name?: string;                          // Group name template
  
  // VMware NSX integration
  create_nsx_group?: boolean;                      // Enable NSX groups
  nsx_group_name?: string;                         // NSX group name template
  nsx_group_scope?: string;                        // NSX scope definition
  nsx_group_tag?: string;                          // NSX tag identifier
  
  // Generated query string
  query?: string;                                  // Auto-generated NetBox query
  
  // API endpoint references (MongoDB ObjectId or embedded objects)
  netbox_endpoint: ObjectId | string | NAMAPIEndpoint;
  fortigate_endpoints: [{
    endpoint: ObjectId | string | NAMAPIEndpoint;
    vdoms: NAMFortiOSVdom[];
  }];
  nsx_endpoints?: ObjectId[] | string[] | NAMAPIEndpoint[];
  
  // Custom field filtering with NHN-specific choices
  environments?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesEnvironments | string>[];
  domains?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesDomains | string>[];
  infrastructures?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesInfrastructures | string>[];
  purposes?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesPurposes | string>[];
  tags?: NetboxTag[];
}
```

### NAMAPIEndpoint

API endpoint configuration interface extending MongoDB document fields:

```typescript
interface NAMAPIEndpoint extends NAMDefaultFields {
  // Authentication
  user?: string;                                   // Username for auth
  pass?: string;                                   // Password for auth
  key?: string;                                    // API key/token
  keyExpires?: Date;                               // Token expiration
  
  // Basic configuration
  desc?: string;                                   // Optional description
  enabled: boolean;                                // Active state flag
  url: string;                                     // Base URL for API
  name?: string;                                   // Endpoint identifier
  
  // Vendor classification
  vendor?: NAMApiEndpointVendors | string;         // Vendor identifier
  type?: NAMApiEndpointTypes | string;             // Device type
  
  // SSL configuration
  ssl?: NAMAPIEndpointSSL;                         // SSL/TLS settings
}
```

### NAMDefaultFields

Base MongoDB document interface with tracking fields:

```typescript
interface NAMDefaultFields {
  // MongoDB document ID and version
  readonly _id?: string | ObjectId;               // MongoDB document identifier
  readonly __v?: number;                          // MongoDB version key
  
  // Audit trail fields
  createdBy?: string;                             // User who created document
  updatedBy?: string;                             // User who last updated document
  createdAt?: Date;                               // Creation timestamp
  updatedAt?: Date;                               // Last update timestamp
  
  // Session and rollback support
  session_id?: string;                            // Session tracking
  parent?: any;                                   // Parent document reference
  roll_back?: boolean;                            // Rollback operation flag
}
```

### NAMParams

Query parameters for NAM v2 API requests:

```typescript
interface NAMParams {
  // Pagination
  limit?: number;                                  // Results per page
  offset?: number;                                 // Skip count
  
  // Filtering
  enabled?: boolean;                               // Filter by enabled state
  sync_priority?: SyncPriorities;                  // Filter by priority
  vendor?: NAMApiEndpointVendors;                  // Filter by vendor
  type?: NAMApiEndpointTypes;                      // Filter by type
  
  // Search
  name__icontains?: string;                        // Case-insensitive name search
  desc__icontains?: string;                        // Case-insensitive description search
  
  // Ordering
  ordering?: string;                               // Sort field and direction
  
  // Metadata
  include_metadata?: boolean;                      // Include response metadata
}
```

### NAMResponse

Generic NAM v2 API response wrapper:

```typescript
interface NAMResponse<T> {
  // Result data
  results: T[];                                    // Array of objects
  count: number;                                   // Total result count
  
  // Pagination links
  next?: string | null;                            // Next page URL
  previous?: string | null;                        // Previous page URL
  
  // Response metadata
  _metadata?: {
    total_pages?: number;                          // Total page count
    current_page?: number;                         // Current page number
    page_size?: number;                            // Results per page
  };
}
```

### Type Enums

Key enumeration types for configuration:

```typescript
// Sync priority levels
type SyncPriorities = "low" | "medium" | "high";

// API endpoint vendors
type NAMApiEndpointVendors = "checkpoint" | "fortinet" | "vmware_nsx-t" | "f5" | "paloalto" | "cisco" | "generic";

// API endpoint types
type NAMApiEndpointTypes = "generic" | "cma" | "mds" | "sms" | "manager" | "fw" | "cmc" | "lb" | "api";

// IP version strings
type IPVersionString = "4" | "6";
```

### NHN NetBox Custom Field Types

NHN-specific NetBox custom field choice values for organizational filtering:

```typescript
// Environment choices for NHN organizational environments
type NHN_CommonNetboxExtraChoicesEnvironments = 
  "na" | "dev" | "qa" | "test" | "prod" | "mgmt" | "lab";

// Domain choices for NHN network domains and DNS zones
type NHN_CommonNetboxExtraChoicesDomains = 
  "na" | "365lab.no" | "ld.365lab.no" | "ad.ehelse.no" | "ad.noma.no" | 
  "cloud.ld.nhn.no" | "cloud.nhn.no" | "drift.nhn.no" | "fhi.no" | 
  "nhn.local" | "prod.drift.nhn.no" | "mgmt.ld.nhn.no" | 
  "test.drift.nhn.no" | "qa.drift.nhn.no" | "video.nhn.no" | 
  /* Additional 30+ domain values available */;

// Infrastructure choices for NHN service classifications
type NHN_CommonNetboxExtraChoicesInfrastructures = 
  "na" | "bck" | "cert" | "mgmt" | "prod" | "test";

// Purpose choices for NHN network segment purposes
type NHN_CommonNetboxExtraChoicesPurposes = 
  "na" | "archive" | "client" | "client_sec" | "datacenter" | "devops" | 
  "guest" | "iot" | "isp" | "lab" | "mgmt" | "monitor" | "nat" | 
  "ops" | "service" | "printer" | "technical" | "video";
```

**Usage Example:**

```typescript
// Example 1: Using string literals for common values
const basicIntegrator = await nam.addNetboxIntegrator({
  name: 'basic-integration',
  environments: [{ name: 'prod' }, { name: 'test' }],
  purposes: [{ name: 'datacenter' }, { name: 'service' }]
});

// Example 2: Using type-safe enum values for validation
const typedIntegrator = await nam.addNetboxIntegrator({
  name: 'typed-integration',
  environments: [
    { name: 'prod' as NHN_CommonNetboxExtraChoicesEnvironments },
    { name: 'mgmt' as NHN_CommonNetboxExtraChoicesEnvironments }
  ],
  domains: [
    { name: 'nhn.local' as NHN_CommonNetboxExtraChoicesDomains },
    { name: 'prod.drift.nhn.no' as NHN_CommonNetboxExtraChoicesDomains }
  ],
  infrastructures: [
    { name: 'prod' as NHN_CommonNetboxExtraChoicesInfrastructures },
    { name: 'mgmt' as NHN_CommonNetboxExtraChoicesInfrastructures }
  ],
  purposes: [
    { name: 'ops' as NHN_CommonNetboxExtraChoicesPurposes },
    { name: 'technical' as NHN_CommonNetboxExtraChoicesPurposes }
  ]
});
```

## See Also

- [NAM v2 API Documentation](https://nam.nhn.no/api/v2/docs/)
- [NetBox Integration Guide](https://docs.netbox.dev/en/stable/)
- [FortiGate API Reference](https://docs.fortinet.com/document/fortigate/7.4.0/rest-api-reference)
- [VMware NSX Policy API](https://code.vmware.com/apis/1083/nsx)
- [Main Zeniki Documentation](../../../../README.md)