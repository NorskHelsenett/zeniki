# NAM v2 Driver Documentation

The NAM (Network Architecture Management) v2 driver provides comprehensive integration with NHN's Network Architecture Management system for centralized network infrastructure orchestration. Built for enterprise-scale network automation with MongoDB-backed persistence, offering type-safe methods for managing NetBox integrations, API endpoints, and multi-vendor network synchronization.

## Table of Contents

- [Quick Start](#quick-start)
- [Driver Configuration](#driver-configuration)
- [API Methods](#api-methods)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Type Definitions](#type-definitions)

## Quick Start

### Basic Setup

```typescript
import { 
  NAMv2Driver,
  NAMNetboxIntegrator,
  NAMAPIEndpoint,
  NAMParams,
  NHN_CommonNetboxExtraChoicesDomains,
  NHN_CommonNetboxExtraChoicesEnvironments,
  NHN_CommonNetboxExtraChoicesInfrastructures,
  NHN_CommonNetboxExtraChoicesPurposes
} from '@norskhelsenett/zeniki';
import { ObjectId } from 'mongodb';

// Initialize the NAM v2 driver
const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  timeout: 30000
});
```

### Basic Operations

```typescript
// Get a specific NetBox integrator by ID
const integrator = await nam.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
if (integrator) {
  console.log(`Integrator: ${integrator.name}, Enabled: ${integrator.enabled}`);
}

// Get all NetBox integrators with filtering
const response = await nam.getNetboxIntegrators({
  enabled: true,
  sync_priority: 'high',
  limit: 50
});

if (response) {
  console.log(`Found ${response.count} active integrators`);
}

// Add a new NetBox integrator
const newIntegrator = await nam.addNetboxIntegrator({
  name: 'production-sync',
  desc: 'Production environment synchronization',
  sync_priority: 'high',
  enabled: true,
  address_family: 'ipv4',
  depth: 2,
  mask_lte: 24,
  create_fg_group: true,
  create_nsx_group: true,
  netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f',
  fortigate_endpoints: [{
    endpoint: '674d7b2c8f1e4a1b2c3d4e60',
    vdoms: [{ name: 'root', enabled: true }]
  }],
  nsx_endpoints: ['674d7b2c8f1e4a1b2c3d4e61']
});

// Update an existing integrator
const updatedIntegrator = await nam.patchNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    desc: 'Updated description for production sync',
    mask_lte: 26
  }
);
```

## NAM v2 Integration Features

The NAM v2 driver provides enterprise-grade features for network architecture management:

### Multi-Vendor Integration
- **NetBox IPAM Integration** - Automated synchronization with NetBox for IP address management
- **FortiGate Firewall Support** - Address group creation and synchronization with FortiOS
- **VMware NSX Integration** - Security group management with NSX Policy API
- **MongoDB Persistence** - Document-based storage with ObjectId references

### Enterprise Automation
- **Priority-Based Scheduling** - Configurable sync priorities for execution ordering
- **Multi-Tenant Support** - Tenant-aware operations with organizational isolation
- **Role-Based Filtering** - Fine-grained control over synchronized prefixes
- **Custom Field Integration** - Support for NetBox custom fields and choice sets

### Advanced Configuration Management
- **VDOM-Aware Operations** - FortiGate Virtual Domain support for enterprise deployments
- **Environment Isolation** - Separate configurations for development, staging, and production
- **SSL Certificate Management** - Comprehensive SSL/TLS configuration for secure communications
- **API Endpoint Lifecycle** - Complete CRUD operations for API endpoint management

## Driver Configuration

### Constructor

```typescript
new NAMv2Driver(config: RequestConfig)
```

**Parameters:**
- `config` - Request configuration including base URL, headers, and authentication

**Example configurations:**

```typescript
// Basic configuration with API token
const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Configuration with username/password authentication
const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  auth: {
    username: 'admin',
    password: 'password'
  },
  timeout: 30000
});

// Configuration with custom headers
const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: {
    'Authorization': 'Bearer token',
    'X-Session-ID': 'session-123',
    'X-User-Agent': 'NAM-Client/2.0'
  }
});
```

## API Methods

The NAM v2 driver provides comprehensive CRUD operations for network architecture management:

- **NetBox Integrator Management** - Complete lifecycle management for NetBox synchronization
- **API Endpoint Management** - Configuration and management of multi-vendor API endpoints
- **MongoDB Integration** - ObjectId-based references with document persistence
- **Generic URL Access** - Direct access to any NAM v2 API endpoint

### NetBox Integrator Management

#### `getNetboxIntegrator(id, params?)`

Retrieves a specific NetBox integrator by MongoDB ObjectId.

```typescript
async getNetboxIntegrator(
  id: string | ObjectId,
  params?: NAMParams
): Promise<NAMNetboxIntegrator>>
```

**Examples:**

```typescript
// Get integrator by ObjectId string
const response = await nam.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
const integrator = response;
console.log(`Integrator: ${integrator.name}, Priority: ${integrator.sync_priority}`);

// Get integrator with query parameters
const response = await nam.getNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  { include_metadata: true }
);

// Get integrator using ObjectId instance
import { ObjectId } from 'mongodb';
const response = await nam.getNetboxIntegrator(new ObjectId('674d7b2c8f1e4a1b2c3d4e5f'));
```

#### `getNetboxIntegrators(params?)`

Retrieves a paginated list of NetBox integrators with optional filtering.

```typescript
async getNetboxIntegrators(
  params?: NAMParams
): Promise<NAMResponse<NAMNetboxIntegrator>>>
```

**Examples:**

```typescript
// Get all NetBox integrators
const integrators = await nam.getNetboxIntegrators();
if (integrators && integrators.results) {
  const integratorList = integrators.results;
}

// Get enabled integrators with high priority
const response = await nam.getNetboxIntegrators({
  enabled: true,
  sync_priority: 'high',
  limit: 25
});

// Search integrators by name pattern
const response = await nam.getNetboxIntegrators({
  name__icontains: 'production',
  ordering: 'created_at'
});

// Get integrators with specific address family
const response = await nam.getNetboxIntegrators({
  address_family: 'ipv4',
  offset: 50,
  limit: 25
});
```

#### `addNetboxIntegrator(integrator, params?)`

Creates a new NetBox integrator configuration.

```typescript
async addNetboxIntegrator(
  integrator: NAMNetboxIntegrator,
  params?: NAMParams
): Promise<NAMNetboxIntegrator>>
```

**Examples:**

```typescript
// Example 1: Basic integrator with string literals
const basicIntegrator = await nam.addNetboxIntegrator({
  name: 'datacenter-sync',
  desc: 'Basic datacenter synchronization',
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

// Example 2: Advanced integrator with NHN custom fields and comprehensive configuration
const enterpriseIntegrator = await nam.addNetboxIntegrator({
  name: 'production-enterprise-sync',
  desc: 'Enterprise production environment synchronization with NHN custom fields',
  sync_priority: 'high',
  enabled: true,
  address_family: '4',
  depth: 3,
  mask_lte: 28,
  mask_gte: 16,
  create_fg_group: true,
  create_nsx_group: true,
  fg_group_name: 'NetBox_{{tenant}}_{{site}}_{{role}}',
  nsx_group_name: 'NSX_{{environment}}_{{purpose}}',
  nsx_group_scope: '/infra/domains/production',
  
  // NHN-specific custom field filtering
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
    { name: 'datacenter' as NHN_CommonNetboxExtraChoicesPurposes },
    { name: 'service' as NHN_CommonNetboxExtraChoicesPurposes }
  ],
  
  // Traditional NetBox filtering
  tenants: [{ id: 1, name: 'Production', slug: 'production' }],
  sites: [{ id: 10, name: 'DC-East', slug: 'dc-east' }],
  depth: 3,
  mask_lte: 28,
  mask_gte: 16,
  create_fg_group: true,
  create_nsx_group: true,
  fg_group_name: 'NetBox_{{tenant}}_{{site}}_{{role}}',
  nsx_group_name: 'NSX_{{environment}}_{{purpose}}',
  nsx_group_scope: '/infra/domains/production',
  tenants: [{ id: 1, name: 'Production', slug: 'production' }],
  sites: [{ id: 10, name: 'DC-East', slug: 'dc-east' }],
  netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f',
  fortigate_endpoints: [{
    endpoint: '674d7b2c8f1e4a1b2c3d4e60',
    vdoms: [
      { name: 'production', enabled: true },
      { name: 'dmz', enabled: true }
    ]
  }],
  nsx_endpoints: ['674d7b2c8f1e4a1b2c3d4e61']
});
```
  desc: 'NSX micro-segmentation with NetBox integration',
  sync_priority: 'high',
  enabled: true,
  address_family: 'ipv4',
  create_nsx_group: true,
  nsx_group_name: 'NetBox_{{purpose}}_{{environment}}',
  nsx_group_scope: '/infra/domains/default',
  nsx_group_tag: 'netbox-managed',
  netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e5f',
  fortigate_endpoints: [{
    endpoint: '674d7b2c8f1e4a1b2c3d4e60',
    vdoms: [{ name: 'root', enabled: true }]
  }],
  nsx_endpoints: ['674d7b2c8f1e4a1b2c3d4e61']
});

// Create integrator with custom field filtering
const customFieldIntegrator = await nam.addNetboxIntegrator({
  name: 'custom-field-sync',
  sync_priority: 'low',
  enabled: true,
  environments: [
    { name: 'production' },
    { name: 'staging' }
  ],
  domains: [
    { name: 'internal' },
    { name: 'dmz' }
  ],
  infrastructures: [
    { name: 'compute' },
    { name: 'storage' }
});
```

#### `patchNetboxIntegrator(id, integrator, params?)`

Updates an existing NetBox integrator with partial modifications.

```typescript
async patchNetboxIntegrator(
  id: string | ObjectId,
  integrator: Partial<NAMNetboxIntegrator>,
  params?: NAMParams
): Promise<NAMNetboxIntegrator>>
```

**Examples:**

```typescript
// Example 1: Simple update (string literals)
const updated = await nam.patchNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    desc: 'Updated production sync',
    sync_priority: 'high'
  }
);

// Example 2: Complex NSX integration update
const nsxUpdate = await nam.patchNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    create_nsx_group: true,
    nsx_group_name: 'NetBox_{{tenant}}_{{site}}',
    nsx_endpoints: ['674d7b2c8f1e4a1b2c3d4e61']
  }
);
```

Updates an existing NetBox integrator with partial modifications.

```typescript
async patchNetboxIntegrator(
  id: string | ObjectId,
  integrator: Partial<NAMNetboxIntegrator>,
  params?: NAMParams
): Promise<NAMNetboxIntegrator>>
```

#### `updateNetboxIntegrator(id, integrator, params?)`

Updates an existing NetBox integrator with complete replacement.

```typescript
async updateNetboxIntegrator(
  id: string | ObjectId,
  integrator: NAMNetboxIntegrator,
  params?: NAMParams
): Promise<NAMNetboxIntegrator>>
```

#### `deleteNetboxIntegrator(id, params?)`

Deletes a NetBox integrator configuration.

```typescript
async deleteNetboxIntegrator(
  id: string | ObjectId,
  params?: NAMParams
): Promise<NAMNetboxIntegrator>>
```

**Examples:**

```typescript
// Update integrator description and priority
const updated = await nam.patchNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    desc: 'Updated production synchronization configuration',
    sync_priority: 'critical'
  }
);

// Enable NSX integration for existing integrator
const nsxEnabled = await nam.patchNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    create_nsx_group: true,
    nsx_group_name: 'NetBox_Auto_{{site}}_{{role}}',
    nsx_endpoints: ['674d7b2c8f1e4a1b2c3d4e61']
  }
);

// Disable integrator temporarily
const disabled = await nam.patchNetboxIntegrator(
  '674d7b2c8f1e4a1b2c3d4e5f',
  { enabled: false }
);

// Delete integrator
const deleted = await nam.deleteNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
```

### API Endpoint Management

#### `getApiEndpoint(id, params?)` / `getApiEndpoints(params?)`

Retrieve API endpoint configurations for multi-vendor device connectivity.

```typescript
async getApiEndpoint(
  id: string | ObjectId,
  params?: NAMParams
): Promise<NAMAPIEndpoint>>

async getApiEndpoints(
  params?: NAMParams
): Promise<NAMResponse<NAMAPIEndpoint>>>
```

#### `addApiEndpoint(endpoint, params?)`

Creates a new API endpoint configuration.

```typescript
async addApiEndpoint(
  endpoint: NAMAPIEndpoint,
  params?: NAMParams
): Promise<NAMAPIEndpoint>>
```

**Examples:**

```typescript
// Create FortiGate API endpoint
const fortigateEndpoint = await nam.addApiEndpoint({
  name: 'fortigate-01',
  desc: 'Primary FortiGate firewall',
  enabled: true,
  url: 'https://192.168.1.1:443/api/v2',
  vendor: 'fortinet',
  type: 'fw',
  user: 'admin',
  pass: 'password123',
  ssl: {
    verify: false,
    cert_file: '/path/to/cert.pem',
    key_file: '/path/to/key.pem'
  }
});

// Create NetBox API endpoint
const netboxEndpoint = await nam.addApiEndpoint({
  name: 'netbox-production',
  desc: 'Production NetBox IPAM system',
  enabled: true,
  url: 'https://netbox.company.com/api',
  vendor: 'generic',
  type: 'api',
  key: 'your-netbox-api-token',
  keyExpires: new Date('2024-12-31'),
  ssl: {
    verify: true,
    ca_bundle: '/path/to/ca-bundle.pem'
  }
});

// Create CheckPoint Security Management endpoint
const checkpointEndpoint = await nam.addApiEndpoint({
  name: 'checkpoint-sms-01',
  desc: 'CheckPoint Security Management Server',
  enabled: true,
  url: 'https://checkpoint-sms.company.com',
  vendor: 'checkpoint',
  type: 'sms',
  user: 'admin',
  pass: 'CheckPoint123!',
  ssl: {
    verify: true
  }
});

// Create VMware NSX endpoint
const nsxEndpoint = await nam.addApiEndpoint({
  name: 'nsx-manager-01',
  desc: 'VMware NSX Manager',
  enabled: true,
  url: 'https://nsx-manager.company.com',
  vendor: 'vmware_nsx-t',
  type: 'manager',
  user: 'admin',
  pass: 'VMware123!',
  ssl: {
    verify: false
  }
});
```

#### `patchApiEndpoint(id, endpoint, params?)` / `updateApiEndpoint(id, endpoint, params?)` / `deleteApiEndpoint(id, params?)`

Complete CRUD operations for API endpoint management.

**Examples:**

```typescript
// Update endpoint credentials
const updated = await nam.patchApiEndpoint(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    key: 'new-api-token',
    keyExpires: new Date('2025-12-31')
  }
);

// Update SSL configuration
const sslUpdated = await nam.patchApiEndpoint(
  '674d7b2c8f1e4a1b2c3d4e5f',
  {
    ssl: {
      verify: true,
      ca_bundle: '/path/to/new-ca-bundle.pem'
    }
  }
);

// Disable endpoint
const disabled = await nam.patchApiEndpoint(
  '674d7b2c8f1e4a1b2c3d4e5f',
  { enabled: false }
);
```

### Generic API Access

#### `getByUrl<T>(url, params?)`

Generic method to access any NAM v2 API endpoint.

#### `getPaginatedByUrl<T>(url, params?, follow?)`

Execute paginated requests with optional automatic result aggregation.

**Examples:**

```typescript
// Access custom NAM endpoints
const customData = await nam.getByUrl<any>('/custom/analytics/reports');

// Get all integrators with pagination
const allIntegrators = await nam.getPaginatedByUrl<NAMNetboxIntegrator>(
  '/vendors/netbox/netbox-integrators/',
  { limit: 100 },
  true
);

// Access monitoring endpoints
const systemStatus = await nam.getByUrl<any>('/system/health/status');
```

## Advanced Usage

### Multi-Vendor Integration Workflow

Complete integration setup across multiple network vendors:

```typescript
async function setupMultiVendorIntegration() {
  // 1. Create API endpoints for each vendor
  const netboxEndpoint = await nam.addApiEndpoint({
    name: 'netbox-production',
    url: 'https://netbox.company.com/api',
    vendor: 'generic',
    type: 'api',
    key: 'netbox-api-token',
    enabled: true
  });

  const fortigateEndpoint = await nam.addApiEndpoint({
    name: 'fortigate-cluster',
    url: 'https://fortigate.company.com/api/v2',
    vendor: 'fortinet',
    type: 'fw',
    user: 'admin',
    pass: 'password',
    enabled: true
  });

  const nsxEndpoint = await nam.addApiEndpoint({
    name: 'nsx-manager',
    url: 'https://nsx.company.com',
    vendor: 'vmware_nsx-t',
    type: 'manager',
    user: 'admin',
    pass: 'password',
    enabled: true
  });

  // 2. Create comprehensive integrator
  const integrator = await nam.addNetboxIntegrator({
    name: 'enterprise-automation',
    desc: 'Complete enterprise network automation',
    sync_priority: 'critical',
    enabled: true,
    address_family: 'ipv4',
    depth: 4,
    mask_lte: 28,
    mask_gte: 16,
    create_fg_group: true,
    create_nsx_group: true,
    fg_group_name: 'Auto_{{tenant}}_{{site}}_{{role}}',
    nsx_group_name: 'NetBox_{{environment}}_{{purpose}}',
    nsx_group_scope: '/infra/domains/production',
    netbox_endpoint: netboxEndpoint.data._id,
    fortigate_endpoints: [{
      endpoint: fortigateEndpoint.data._id,
      vdoms: [
        { name: 'root', enabled: true },
        { name: 'production', enabled: true },
        { name: 'dmz', enabled: true }
      ]
    }],
    nsx_endpoints: [nsxEndpoint.data._id]
  });

  return {
    endpoints: [netboxEndpoint, fortigateEndpoint, nsxEndpoint],
    integrator
  };
}
```

### Priority-Based Sync Management

Implement priority-based synchronization scheduling:

```typescript
async function setupPriorityBasedSync() {
  // Critical priority for production environments
  const criticalSync = await nam.addNetboxIntegrator({
    name: 'production-critical-sync',
    sync_priority: 'critical',
    enabled: true,
    tenants: [{ id: 1, name: 'Production', slug: 'production' }],
    status: 'active',
    netbox_endpoint: 'endpoint-id',
    fortigate_endpoints: [{ endpoint: 'fg-endpoint-id', vdoms: [] }]
  });

  // High priority for staging environments
  const highSync = await nam.addNetboxIntegrator({
    name: 'staging-high-sync',
    sync_priority: 'high',
    enabled: true,
    tenants: [{ id: 2, name: 'Staging', slug: 'staging' }],
    status: 'active',
    netbox_endpoint: 'endpoint-id',
    fortigate_endpoints: [{ endpoint: 'fg-endpoint-id', vdoms: [] }]
  });

  // Medium priority for development
  const mediumSync = await nam.addNetboxIntegrator({
    name: 'development-medium-sync',
    sync_priority: 'medium',
    enabled: true,
    tenants: [{ id: 3, name: 'Development', slug: 'development' }],
    netbox_endpoint: 'endpoint-id',
    fortigate_endpoints: [{ endpoint: 'fg-endpoint-id', vdoms: [] }]
  });

  return { criticalSync, highSync, mediumSync };
}
```

### Custom Field Integration

Leverage NetBox custom fields with NHN-specific choice values for advanced filtering:

```typescript
import { 
  NHN_CommonNetboxExtraChoicesEnvironments,
  NHN_CommonNetboxExtraChoicesDomains,
  NHN_CommonNetboxExtraChoicesInfrastructures,
  NHN_CommonNetboxExtraChoicesPurposes
} from '@norskhelsenett/zeniki';

async function setupCustomFieldIntegration() {
  const customFieldIntegrator = await nam.addNetboxIntegrator({
    name: 'nhn-custom-field-automation',
    desc: 'Advanced NHN custom field-based synchronization',
    sync_priority: 'high',
    enabled: true,
    
    // Example 1: Environment-based filtering with string literals
    environments: [
      { name: 'prod' },
      { name: 'test' },
      { name: 'qa' }
    ],
    
    // Example 2: Domain-based filtering with NHN enum types
    domains: [
      { name: 'nhn.local' as NHN_CommonNetboxExtraChoicesDomains },
      { name: 'prod.drift.nhn.no' as NHN_CommonNetboxExtraChoicesDomains },
      { name: 'mgmt.ld.nhn.no' as NHN_CommonNetboxExtraChoicesDomains }
    ],
    
    // Infrastructure type filtering with NHN-specific values
    infrastructures: [
      { name: 'prod' as NHN_CommonNetboxExtraChoicesInfrastructures },
      { name: 'mgmt' as NHN_CommonNetboxExtraChoicesInfrastructures },
      { name: 'test' as NHN_CommonNetboxExtraChoicesInfrastructures }
    ],
    
    // Purpose-based filtering with NHN enum types
    purposes: [
      { name: 'datacenter' as NHN_CommonNetboxExtraChoicesPurposes },
      { name: 'service' as NHN_CommonNetboxExtraChoicesPurposes },
      { name: 'mgmt' as NHN_CommonNetboxExtraChoicesPurposes },
      { name: 'ops' as NHN_CommonNetboxExtraChoicesPurposes }
    ],
    
    // Combine with traditional filtering
    tenants: [{ id: 1, name: 'Production', slug: 'production' }],
    sites: [{ id: 10, name: 'DC-East', slug: 'dc-east' }],
    role: { id: 5, name: 'Server Networks', slug: 'server-networks' },
    
    netbox_endpoint: 'endpoint-id',
    fortigate_endpoints: [{ endpoint: 'fg-endpoint-id', vdoms: [] }]
  });

  return customFieldIntegrator;
}
```

### Error Handling and Monitoring

```typescript
import { HTTPError } from '@norskhelsenett/zeniki';

try {
  const integrator = await nam.addNetboxIntegrator(integratorConfig);
} catch (error) {
  if (error instanceof HTTPError) {
    if (error.code === 409) {
      console.log('Integrator with this name already exists');
    } else if (error.code === 400) {
      console.log('Invalid integrator configuration');
      console.log('Validation errors:', error.message);
    } else if (error.code === 404) {
      console.log('Referenced endpoint not found');
    } else {
      console.log(`NAM API error: ${error.code}`);
      console.log(`Error details: ${error.message}`);
    }
  }
}

// Monitor integrator status
async function monitorIntegrators() {
  const integrators = await nam.getNetboxIntegrators({ enabled: true });
  
  for (const integrator of integrators.results) {
    console.log(`Integrator: ${integrator.name}`);
    console.log(`Priority: ${integrator.sync_priority}`);
    console.log(`Last Modified: ${integrator.updated_at}`);
    console.log(`Created By: ${integrator.created_by_user}`);
  }
}
```

## Examples

### Complete Network Automation Setup

```typescript
import { NAMv2Driver } from '@norskhelsenett/zeniki';

const nam = new NAMv2Driver({
  baseURL: 'https://nam.company.com/api/v2',
  headers: { 'Authorization': 'Bearer token' }
});

async function setupCompleteNetworkAutomation() {
  // 1. Create API endpoints for all network devices
  const endpoints = await Promise.all([
    // NetBox IPAM endpoint
    nam.addApiEndpoint({
      name: 'netbox-primary',
      desc: 'Primary NetBox IPAM system',
      enabled: true,
      url: 'https://netbox.company.com/api',
      vendor: 'generic',
      type: 'api',
      key: 'netbox-api-token-here',
      ssl: { verify: true, ca_bundle: '/path/to/ca.pem' }
    }),
    
    // FortiGate firewall endpoints
    nam.addApiEndpoint({
      name: 'fortigate-dc1',
      desc: 'Data Center 1 FortiGate cluster',
      enabled: true,
      url: 'https://fortigate-dc1.company.com/api/v2',
      vendor: 'fortinet',
      type: 'fw',
      user: 'automation',
      pass: 'secure-password',
      ssl: { verify: false }
    }),
    
    nam.addApiEndpoint({
      name: 'fortigate-dc2',
      desc: 'Data Center 2 FortiGate cluster',
      enabled: true,
      url: 'https://fortigate-dc2.company.com/api/v2',
      vendor: 'fortinet',
      type: 'fw',
      user: 'automation',
      pass: 'secure-password',
      ssl: { verify: false }
    }),
    
    // VMware NSX managers
    nam.addApiEndpoint({
      name: 'nsx-dc1',
      desc: 'Data Center 1 NSX Manager',
      enabled: true,
      url: 'https://nsx-dc1.company.com',
      vendor: 'vmware_nsx-t',
      type: 'manager',
      user: 'admin',
      pass: 'VMware123!',
      ssl: { verify: false }
    }),
    
    nam.addApiEndpoint({
      name: 'nsx-dc2',
      desc: 'Data Center 2 NSX Manager',
      enabled: true,
      url: 'https://nsx-dc2.company.com',
      vendor: 'vmware_nsx-t',
      type: 'manager',
      user: 'admin',
      pass: 'VMware123!',
      ssl: { verify: false }
    })
  ]);

  const [netboxEP, fortigateEP1, fortigateEP2, nsxEP1, nsxEP2] = endpoints;

  // 2. Create comprehensive integrators for different environments
  const integrators = await Promise.all([
    // Production environment integrator
    nam.addNetboxIntegrator({
      name: 'production-automation',
      desc: 'Production environment complete automation',
      sync_priority: 'critical',
      enabled: true,
      address_family: 'ipv4',
      depth: 3,
      mask_lte: 28,
      mask_gte: 16,
      create_fg_group: true,
      create_nsx_group: true,
      fg_group_name: 'Prod_{{tenant}}_{{site}}_{{role}}',
      nsx_group_name: 'NetBox_Prod_{{environment}}_{{purpose}}',
      nsx_group_scope: '/infra/domains/production',
      nsx_group_tag: 'netbox-production',
      tenants: [{ id: 1, name: 'Production', slug: 'production' }],
      status: 'active',
      environments: [{ name: 'production' }],
      netbox_endpoint: netboxEP.data._id,
      fortigate_endpoints: [
        {
          endpoint: fortigateEP1.data._id,
          vdoms: [
            { name: 'production', enabled: true },
            { name: 'dmz', enabled: true }
          ]
        },
        {
          endpoint: fortigateEP2.data._id,
          vdoms: [
            { name: 'production', enabled: true },
            { name: 'dmz', enabled: true }
          ]
        }
      ],
      nsx_endpoints: [nsxEP1.data._id, nsxEP2.data._id]
    }),

    // Staging environment integrator
    nam.addNetboxIntegrator({
      name: 'staging-automation',
      desc: 'Staging environment automation for testing',
      sync_priority: 'high',
      enabled: true,
      address_family: 'ipv4',
      depth: 2,
      mask_lte: 26,
      create_fg_group: true,
      create_nsx_group: false,
      fg_group_name: 'Staging_{{tenant}}_{{role}}',
      tenants: [{ id: 2, name: 'Staging', slug: 'staging' }],
      status: 'active',
      environments: [{ name: 'staging' }],
      netbox_endpoint: netboxEP.data._id,
      fortigate_endpoints: [{
        endpoint: fortigateEP1.data._id,
        vdoms: [{ name: 'staging', enabled: true }]
      }]
    }),

    // Development environment integrator
    nam.addNetboxIntegrator({
      name: 'development-automation',
      desc: 'Development environment basic automation',
      sync_priority: 'medium',
      enabled: true,
      address_family: 'ipv4',
      depth: 1,
      mask_lte: 24,
      create_fg_group: true,
      create_nsx_group: false,
      fg_group_name: 'Dev_{{role}}',
      tenants: [{ id: 3, name: 'Development', slug: 'development' }],
      environments: [{ name: 'development' }],
      netbox_endpoint: netboxEP.data._id,
      fortigate_endpoints: [{
        endpoint: fortigateEP1.data._id,
        vdoms: [{ name: 'development', enabled: true }]
      }]
    })
  ]);

  return {
    endpoints: endpoints.map(ep => ep.data),
    integrators: integrators.map(int => int.data)
  };
}
```

### Disaster Recovery Integration

```typescript
async function setupDisasterRecoveryIntegration() {
  // Primary site integrator
  const primaryIntegrator = await nam.addNetboxIntegrator({
    name: 'primary-site-dr',
    desc: 'Primary site with DR capabilities',
    sync_priority: 'critical',
    enabled: true,
    sites: [{ id: 1, name: 'Primary-DC', slug: 'primary-dc' }],
    create_fg_group: true,
    create_nsx_group: true,
    fg_group_name: 'Primary_{{tenant}}_{{role}}',
    nsx_group_name: 'Primary_{{environment}}_{{purpose}}',
    netbox_endpoint: 'primary-netbox-endpoint-id',
    fortigate_endpoints: [{
      endpoint: 'primary-fortigate-endpoint-id',
      vdoms: [
        { name: 'primary', enabled: true },
        { name: 'dr-ready', enabled: true }
      ]
    }],
    nsx_endpoints: ['primary-nsx-endpoint-id']
  });

  // DR site integrator
  const drIntegrator = await nam.addNetboxIntegrator({
    name: 'dr-site-standby',
    desc: 'Disaster recovery site standby configuration',
    sync_priority: 'high',
    enabled: false, // Disabled until DR activation
    sites: [{ id: 2, name: 'DR-DC', slug: 'dr-dc' }],
    create_fg_group: true,
    create_nsx_group: true,
    fg_group_name: 'DR_{{tenant}}_{{role}}',
    nsx_group_name: 'DR_{{environment}}_{{purpose}}',
    netbox_endpoint: 'dr-netbox-endpoint-id',
    fortigate_endpoints: [{
      endpoint: 'dr-fortigate-endpoint-id',
      vdoms: [{ name: 'dr-active', enabled: true }]
    }],
    nsx_endpoints: ['dr-nsx-endpoint-id']
  });

  return { primaryIntegrator, drIntegrator };
}
```

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