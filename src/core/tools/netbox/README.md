# NetBox Driver Documentation

The NetBox driver provides comprehensive integration with NetBox IPAM (IP Address Management) systems, offering type-safe, well-documented methods for managing IP prefixes, custom fields, and automated network allocation.

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
  NetboxDriver, 
  NetboxPrefixStatus, 
  NetboxOperationalStatus,
  NetboxSiteStatus,
  NetboxVlanStatus,
  NHN_CommonNetboxExtraChoicesEnvironment,
  NHN_CommonNetboxExtraChoicesDomain,
  NHN_CommonNetboxExtraChoicesInfrastructure,
  NHN_CommonNetboxExtraChoicesPurpose
} from '@norskhelsenett/zeniki';

// Initialize the NetBox driver
const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: {
    'Authorization': 'Token your-api-token-here',
    'Content-Type': 'application/json'
  }
});
```

### Basic Operations

```typescript
// Get a specific prefix by ID
const prefix = await netbox.getPrefix(123);
console.log(`Prefix: ${prefix.data.prefix}, Status: ${prefix.data.status?.label}`);

// Get all active IPv4 prefixes using string literals (quick prototyping)
const response = await netbox.getPrefixes({
  status: 'active',  // String literal approach
  family: 4,
  limit: 50
});

console.log(`Found ${response.data.count} prefixes`);
response.data.results.forEach(prefix => {
  console.log(`${prefix.prefix} - ${prefix.description || 'No description'}`);
});

// Add a new prefix using type-safe enums (recommended for production)
const newPrefix = await netbox.addPrefix({
  prefix: '192.168.100.0/24',
  description: 'Production network',
  status: NetboxPrefixStatus.Active,  // Type-safe enum with IDE support
  site: 1,
  custom_fields: {
    env: NHN_CommonNetboxExtraChoicesEnvironment.prod,
    domain: NHN_CommonNetboxExtraChoicesDomain["nhn.local"],
    infra: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
    purpose: NHN_CommonNetboxExtraChoicesPurpose.datacenter
  }
});
```

## Enhanced Type System

The NetBox driver provides a flexible type system that supports multiple development approaches while maintaining type safety and data integrity.

### Type System Approaches

#### 1. String Literals (Simple & Quick)
Perfect for prototyping and simple scripts:

```typescript
// Quick and simple - no imports needed
await netbox.addPrefix({
  prefix: '192.168.1.0/24',
  status: 'active',        // String literal
  description: 'Test network'
});

await netbox.addDevice({
  name: 'test-device',
  status: 'active',        // String literal
  face: 'front'            // String literal
});
```

#### 2. Type-Safe Enums (Recommended for Production)
Enhanced IDE support with autocompletion and type safety:

```typescript
import { 
  NetboxPrefixStatus, 
  NetboxOperationalStatus,
  NetboxSiteStatus,
  NetboxVlanStatus, 
  NetboxRackFace, 
  NetboxRackAirFlow 
} from '@norskhelsenett/zeniki';

// Type-safe with full IntelliSense support
await netbox.addPrefix({
  prefix: '192.168.1.0/24',
  status: NetboxPrefixStatus.Active,    // Enum with autocompletion
  description: 'Production network'
});

await netbox.addDevice({
  name: 'prod-device',
  status: NetboxOperationalStatus.Active,  // Type-safe enum
  face: NetboxRackFace.Front,              // Prevents typos
  airflow: NetboxRackAirFlow["Front to rear"]  // Spaces handled correctly
});

await netbox.addSite({
  name: 'Data Center East',
  slug: 'dc-east',
  status: NetboxSiteStatus.Active          // Site-specific status enum
});

await netbox.addVlan({
  name: 'Production Network', 
  vid: 100,
  status: NetboxVlanStatus.Active          // VLAN-specific status enum
});
```

#### 3. Immutable API Responses
All API responses return readonly data structures:

```typescript
// API responses use readonly properties for data integrity
const prefix = await netbox.getPrefix(123);

// Access immutable value-label pairs
console.log(prefix.data.status);  // { readonly value: 'active', readonly label: 'Active' }
console.log(prefix.data.site);    // { readonly id: 1, readonly name: 'DC-01', ... }

// ❌ Cannot modify readonly properties (TypeScript prevents this)
// prefix.data.status.value = 'inactive';  // Error: Cannot assign to readonly property

// ✅ Create new objects for updates instead
const updates = {
  status: NetboxPrefixStatus.Deprecated,  // Use enum for updates
  description: 'Being decommissioned'
};
await netbox.patchPrefix(updates, 123);
```

### Benefits

- **Type Safety**: Enums prevent invalid values and typos
- **IDE Support**: Full autocompletion and refactoring support  
- **Data Integrity**: Readonly properties prevent accidental modifications
- **Flexibility**: Choose the right approach for your use case

## Driver Configuration

### Constructor

```typescript
new NetboxDriver(config: RequestConfig)
```

**Parameters:**
- `config` - Request configuration including base URL, headers, and authentication

**Example configurations:**

```typescript
// Basic configuration
const netbox = new NetboxDriver({
  baseURL: 'https://netbox.company.com/api',
  headers: {
    'Authorization': 'Token abc123def456',
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Configuration with SSL verification disabled (development only)
const netbox = new NetboxDriver({
  baseURL: 'https://netbox.company.com/api',
  headers: {
    'Authorization': 'Token abc123def456',
    'Content-Type': 'application/json'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
```

## API Methods

The NetBox driver provides comprehensive CRUD operations across all major NetBox applications:

- **IPAM (IP Address Management)** - Complete prefix lifecycle with VRFs and VLANs
- **DCIM (Data Center Infrastructure Management)** - Sites and devices management
- **Tenancy** - Multi-tenant support with organizational hierarchy
- **Extras** - Tags, custom fields, and extensible data models

### Prefix Management

#### `getPrefix(id, params?)`

Retrieves a specific IP prefix by ID.

```typescript
async getPrefix(
  id: number,
  params?: NetboxParams
): Promise<NetboxPrefix>>
```

**Examples:**

```typescript
// Get prefix with basic information
const response = await netbox.getPrefix(42);
const prefix = response.data;
console.log(`Prefix: ${prefix.prefix}, Status: ${prefix.status?.label}`);

// Get prefix with additional query parameters
const response = await netbox.getPrefix(42, {
  brief: true // NetBox parameter for condensed response
});
```

#### `getPrefixes(params?)`

Retrieves a paginated list of IP prefixes with optional filtering.

```typescript
async getPrefixes(
  params?: NetboxParams
): Promise<NetboxPaginated<NetboxPrefix>>>
```

**Examples:**

```typescript
// Get all prefixes (first page with default limit)
const response = await netbox.getPrefixes();
const prefixes = response.data.results;
const totalCount = response.data.count;

// Get active IPv4 prefixes with pagination
const response = await netbox.getPrefixes({
  status: 'active',
  family: 4,
  limit: 25,
  offset: 50
});

// Search prefixes within a specific range
const response = await netbox.getPrefixes({
  within_include: '10.0.0.0/8',
  ordering: 'prefix'
});

// Text search across prefix descriptions
const response = await netbox.getPrefixes({
  q: 'user networks',
  limit: 100
});
```

**Filtering parameters:**

```typescript
const prefixes = await netbox.getPrefixes({
  q: 'user networks',           // Search term
  status: 'active',             // Filter by status
  within_include: '192.168.0.0/16', // Within this supernet
  ordering: '-created',         // Order by creation date (descending)
  limit: 25,                    // Results per page
  offset: 50                    // Skip first 50 results
});
```

### Automated Prefix Allocation

#### `getNextAvailablePrefix(id, params?)`

Retrieves available prefix suggestions within a parent prefix.

```typescript
async getNextAvailablePrefix(
  id: number,
  params?: NetboxParams
): Promise<NetboxAvailablePrefix[]>>
```

**Examples:**

```typescript
// Get all available prefixes within parent prefix ID 42
const availablePrefixes = await netbox.getNextAvailablePrefix(42);
console.log(`Found ${availablePrefixes.data.length} available prefixes`);

// Get available prefixes with specific length filter
const availablePrefixes = await netbox.getNextAvailablePrefix(42, {
  prefix_length: 24  // Only show /24 suggestions
});

// Process available prefixes
availablePrefixes.data.forEach(prefix => {
  console.log(`Available: ${prefix.prefix}`);
});
```

#### `addPrefix(prefix, id?)`

Creates a new IP prefix in NetBox.

```typescript
async addPrefix(
  prefix: NetboxPrefix,
  id?: number
): Promise<NetboxPrefix>>
```

**Examples:**

```typescript
// Example 1: Using string literals (quick prototyping)
const newPrefix = await netbox.addPrefix({
  prefix: '192.168.100.0/24',
  status: 'active',
  description: 'User access network',
  is_pool: false
});

// Example 2: Using type-safe enums (production recommended)
const vrfPrefix = await netbox.addPrefix({
  prefix: '10.1.0.0/16',
  status: NetboxPrefixStatus.Reserved,
  description: 'Corporate VPN range',
  tenant: 1,
  is_pool: true
});
```

#### `deletePrefix(prefix)` / `deletePrefixById(id)`

Deletes a prefix from NetBox using either prefix object or ID.

```typescript
async deletePrefix(prefix: Partial<NetboxPrefix>): Promise<NetboxPrefix>>
async deletePrefixById(id: number): Promise<NetboxPrefix>>
```

**Examples:**

```typescript
// Example 1: Delete by prefix object (string literals)
await netbox.deletePrefix({
  prefix: '192.168.100.0/24',
  status: 'active'
});

// Example 2: Delete by ID (cleaner approach)
await netbox.deletePrefixById(123);
```

#### `patchPrefix(updates, id)` / `updatePrefix(prefix, id)`

Updates a prefix with partial or complete data.

```typescript
async patchPrefix(updates: Partial<NetboxPrefix>, id: number): Promise<NetboxPrefix>>
async updatePrefix(prefix?: NetboxPrefix, id?: number): Promise<NetboxPrefix>>
```

**Examples:**

```typescript
// Example 1: Partial update with string literals
const updated = await netbox.patchPrefix({
  description: 'Updated user network',
  status: 'reserved'
}, 123);

// Example 2: Partial update with type-safe enums
const statusUpdate = await netbox.patchPrefix({
  status: NetboxPrefixStatus.Deprecated,
  description: 'Being decommissioned'
}, 123);
```

#### `registerNextAvailablePrefix(id, length, vlan_id?, description?, json_fields?, custom_fields?, params?)`

Creates and allocates a new prefix from available space within a parent prefix.

```typescript
async registerNextAvailablePrefix(
  id: number,
  length: number,
  vlan_id?: number | null,
  description?: string,
  json_fields?: { [key: string]: any },
  custom_fields?: { [key: string]: string },
  params?: NetboxParams
): Promise<NetboxPrefix[]>>
```

**Examples:**

```typescript
// Create a new /28 prefix within parent prefix ID 42
const newPrefix = await netbox.registerNextAvailablePrefix(42, 28);
console.log(`Created prefix: ${newPrefix.data[0].prefix}`);

// Create prefix with VLAN assignment and description
// Create a new prefix with VLAN assignment and description (enhanced type-safe approach)
const newPrefix = await netbox.registerNextAvailablePrefix(
  42,     // Parent prefix ID
  26,     // New prefix length (/26)
  100,    // VLAN ID
  "User network for development team",  // Description
  {
    status: NetboxPrefixStatus.Active  // Type-safe enum instead of string
  }
);

// Create prefix with custom fields
const newPrefix = await netbox.registerNextAvailablePrefix(
  42,
  24,
  null,   // No VLAN
  "Production network",
  {
    status: "active",
    role: 5  // Network role ID
  },
  {
    "domain": "production",
    "env": "prod",
    "infra": "core",
    "purpose": "application"
  }
);

// Create prefix with only custom fields
const newPrefix = await netbox.registerNextAvailablePrefix(
  42,
  25,
  null,
  undefined,  // No description
  undefined,  // No additional JSON fields
  {
    "business_unit": "engineering",
    "cost_center": "1234",
    "env": "staging"
  }
);
```

### VRF Management

#### `getVrf(id, params?)`

Retrieves a specific VRF (Virtual Routing and Forwarding) by its ID.

```typescript
async getVrf(
  id: number,
  params?: NetboxParams
): Promise<NetboxVrf>>
```

**Examples:**

```typescript
// Get VRF with basic information
const response = await netbox.getVrf(10);
const vrf = response.data;
console.log(`VRF: ${vrf.name}, RD: ${vrf.rd}`);

// Get VRF with additional query parameters
const response = await netbox.getVrf(10, {
  brief: true
});
```

#### `getVrfs(params?, follow?)`

Retrieves a paginated list of VRFs with optional filtering.

```typescript
async getVrfs(
  params?: NetboxParams,
  follow?: boolean
): Promise<NetboxPaginated<NetboxVrf>>>
```

**Examples:**

```typescript
// Get all VRFs (first page)
const response = await netbox.getVrfs();

// Get VRFs with filtering
const response = await netbox.getVrfs({
  tenant: 5,
  ordering: 'name',
  limit: 50
});

// Get all VRFs across all pages
const response = await netbox.getVrfs({}, true);
```

#### `addVrf(vrf, id?)`

Creates a new VRF in NetBox.

```typescript
async addVrf(
  vrf: NetboxVrf,
  id?: number
): Promise<NetboxVrf>>
```

**Examples:**

```typescript
// Example 1: Using simple object (string literals)
const newVrf = await netbox.addVrf({
  name: 'PRODUCTION_VRF',
  rd: '65000:100',
  tenant: 1,
  enforce_unique: true,
  description: 'Production environment VRF'
});

// Example 2: Using interface type (recommended)
const enterpriseVrf: NetboxVrf = {
  name: 'ENTERPRISE_VRF',
  rd: '65000:200', 
  tenant: 2,
  enforce_unique: true,
  description: 'Enterprise division VRF'
};
const response = await netbox.addVrf(enterpriseVrf);
```

#### `deleteVrf(vrf)` / `deleteVrfById(id)`

Deletes a VRF from NetBox using either VRF object or ID.

```typescript
async deleteVrf(vrf: Partial<NetboxVrf>): Promise<NetboxVrf>>
async deleteVrfById(id: number): Promise<NetboxVrf>>
```

#### `patchVrf(updates, id)` / `updateVrf(vrf, id)`

Updates a VRF with partial or complete data.

```typescript
async patchVrf(updates: Partial<NetboxVrf>, id: number): Promise<NetboxVrf>>
async updateVrf(vrf?: NetboxVrf, id?: number): Promise<NetboxVrf>>
```

### VLAN Management

#### `getVlan(id, params?)` / `getVlans(params?, follow?)`

Retrieves VLANs by ID or with filtering.

```typescript
async getVlan(id: number, params?: NetboxParams): Promise<NetboxVlan>>
async getVlans(params?: NetboxParams, follow?: boolean): Promise<NetboxPaginated<NetboxVlan>>>
```

#### `addVlan(vlan, id?)` 

Creates a new VLAN in NetBox.

```typescript
async addVlan(
  vlan: NetboxVlan,
  id?: number
): Promise<NetboxVlan>>
```

**Examples:**

```typescript
// Example 1: Using string literals (quick prototyping)
const newVlan = await netbox.addVlan({
  name: 'Production Network',
  vid: 100,
  site: 1,
  status: 'active'
});

// Example 2: Using type-safe enums (production recommended)  
const enterpriseVlan = await netbox.addVlan({
  name: 'Development Network',
  vid: 200,
  site: 1,
  status: NetboxVlanStatus.Active,
  tenant: 1
});
```

### Site Management

#### `getSite(id, params?)` / `getSites(params?, follow?)`

Retrieves sites by ID or with filtering.

#### `addSite(site, id?)` / `deleteSite(site)` / `deleteSiteById(id)`

Complete CRUD operations for site management.

```typescript
async addSite(site: NetboxSite, id?: number): Promise<NetboxSite>>
async deleteSite(site: Partial<NetboxSite>): Promise<NetboxSite>>
async deleteSiteById(id: number): Promise<NetboxSite>>
```

**Examples:**

```typescript
// Example 1: Using string literals (quick prototyping)
const newSite = await netbox.addSite({
  name: 'Data Center North',
  slug: 'dc-north',
  status: 'active',
  description: 'Primary data center location'
});

// Example 2: Using type-safe enums (production recommended)
const enterpriseSite = await netbox.addSite({
  name: 'Data Center South',
  slug: 'dc-south',
  status: NetboxSiteStatus.Active,
  region: 1,
  tenant: 1
});
```
  name: 'Data Center South',
  slug: 'dc-south',
  status: NetboxSiteStatus.Active  // Site-specific lifecycle status enum
};
const enumResponse = await netbox.addSite(newSiteEnum);
```

### Tenant Management

#### `getTenant(id, params?)` / `getTenants(params?, follow?)`

Retrieves tenants for multi-tenancy support.

#### `addTenant(tenant, id?)` / `deleteTenant(tenant)` / `deleteTenantById(id)`

Complete tenant lifecycle management.

### Tag Management

#### `getTag(id, params?)` / `getTags(params?, follow?)`

Retrieves tags for flexible labeling systems.

#### `addTag(tag, id?)` / `deleteTag(tag)` / `deleteTagById(id)`

Complete tag operations for object labeling.

### Device Management

#### `getDevice(id, params?)` / `getDevices(params?, follow?)`

Retrieves devices for infrastructure inventory.

#### `addDevice(device, id?)` / `deleteDevice(device)` / `deleteDeviceById(id)`

Complete device lifecycle management.

### Custom Fields Management

#### `getCustomField(id, params?)`

Retrieves a specific custom field by its ID.

```typescript
async getCustomField(
  id: number,
  params?: NetboxParams
): Promise<NetboxCustomField>>
```

#### `getCustomFields(params?)`

Retrieves a paginated list of custom fields from NetBox.

```typescript
async getCustomFields(
  params?: NetboxParams
): Promise<NetboxPaginated<NetboxCustomField>>>
```

**Examples:**

```typescript
// Get all custom fields
const response = await netbox.getCustomFields();
const customFields = response.data.results;
const totalCount = response.data.count;

// Get custom fields for specific content types
const response = await netbox.getCustomFields({
  content_types: 'ipam.prefix',
  limit: 50
});

// Search custom fields by name
const response = await netbox.getCustomFields({
  q: 'business',
  ordering: 'name'
});

// Get required custom fields only
const response = await netbox.getCustomFields({
  required: true
});
```

#### `getCustomFieldChoiceSet(id, params?)`

Retrieves a specific custom field choice set by its ID.

```typescript
async getCustomFieldChoiceSet(
  id: number,
  params?: NetboxParams
): Promise<NetboxCustomFieldChoiceSet>>
```

**Examples:**

```typescript
// Get custom field choice set with basic information
const response = await netbox.getCustomFieldChoiceSet(2);
const choiceSet = response.data;
console.log(`Choice Set: ${choiceSet.name}, Choices: ${choiceSet.extra_choices.length}`);

// Get choice set with additional query parameters
const response = await netbox.getCustomFieldChoiceSet(2, {
  brief: true
});
```

#### `getCustomFieldChoiceSets(params?, follow?)`

Retrieves a paginated list of all custom field choice sets.

```typescript
async getCustomFieldChoiceSets(
  params?: NetboxParams,
  follow?: boolean
): Promise<NetboxPaginated<NetboxCustomFieldChoiceSet>>>
```

**Examples:**

```typescript
// Get all custom field choice sets
const response = await netbox.getCustomFieldChoiceSets();
response.data.results.forEach(choiceSet => {
  console.log(`Choice Set: ${choiceSet.name} (${choiceSet.extra_choices.length} choices)`);
});

// Filter choice sets by name pattern
const response = await netbox.getCustomFieldChoiceSets({
  name__icontains: 'status',
  limit: 10
});

// Get all choice sets across all pages
const response = await netbox.getCustomFieldChoiceSets({
  ordering: 'name'
}, true);
```

### Generic API Access

#### `getByUrl<T>(url, params?)`

Generic method to access any NetBox API endpoint using a full URL.

```typescript
async getByUrl<T>(
  url: string, 
  params?: NetboxParams
): Promise<T>>
```

**Examples:**

```typescript
// Get a specific custom field choice set by URL
const choiceSet = await netbox.getByUrl<NetboxCustomFieldChoiceSet>(
  'https://netbox.example.com/api/extras/custom-field-choice-sets/2/'
);

// Follow a link from an API response
const prefix = await netbox.getPrefix(123);
if (prefix.data.site && typeof prefix.data.site === 'string') {
  const site = await netbox.getByUrl<NetboxSite>(prefix.data.site);
}

// Access any NetBox endpoint with parameters
const devices = await netbox.getByUrl<NetboxPaginated<any>>(
  'https://netbox.example.com/api/dcim/devices/',
  { status: 'active', limit: 100 }
);

// Get specific object by direct URL
const vlan = await netbox.getByUrl<NetboxVlan>(
  'https://netbox.example.com/api/ipam/vlans/456/'
);
```

## Advanced Usage

### Split Delete Patterns

The NetBox driver implements dual deletion methods for all resources, providing flexibility in how you delete objects:

```typescript
// Object-based deletion (requires object properties)
await netbox.deletePrefix({ prefix: '192.168.1.0/24' });
await netbox.deleteVrf({ name: 'PROD_VRF' });
await netbox.deleteSite({ slug: 'dc-north' });

// ID-based deletion (requires only the ID)
await netbox.deletePrefixById(123);
await netbox.deleteVrfById(456);
await netbox.deleteSiteById(789);
```

### Comprehensive CRUD Operations

All major NetBox resources support full CRUD operations with consistent patterns:

```typescript
// Create/Read/Update/Delete pattern for all resources
const vrf = await netbox.addVrf(newVrfData);           // Create
const existing = await netbox.getVrf(vrf.data.id);     // Read
await netbox.patchVrf({ description: 'Updated' }, vrf.data.id); // Update (partial)
await netbox.updateVrf(fullVrfData, vrf.data.id);      // Update (complete)
await netbox.deleteVrfById(vrf.data.id);               // Delete
```

### Pagination Support

Most list methods support automatic pagination following:

```typescript
// Get first page only
const response = await netbox.getVrfs({ limit: 25 });

// Follow all pages automatically
const allVrfs = await netbox.getVrfs({ limit: 25 }, true);

// Manual pagination
const page1 = await netbox.getVrfs({ limit: 25, offset: 0 });
const page2 = await netbox.getVrfs({ limit: 25, offset: 25 });
```

### Security Features

The NetBox driver automatically handles CSRF tokens from response headers. CSRF tokens are extracted from multiple header variations:
- `x-csrf-token`
- `x-csrftoken`  
- `csrf-token`
- `X-CSRFTOKEN`

No additional configuration is needed - CSRF protection is automatic.

### Working with Custom Fields

```typescript
// Get all custom fields for prefixes
const customFields = await netbox.getCustomFields({
  content_types: 'ipam.prefix'
});

// Get a specific choice set
const choiceSet = await netbox.getByUrl<NetboxCustomFieldChoiceSet>(
  'https://netbox.example.com/api/extras/custom-field-choice-sets/1/'
);

console.log(`Choice set "${choiceSet.data.name}" has ${choiceSet.data.choices_count} options`);

// Access choice options
if (choiceSet.data.extra_choices) {
  choiceSet.data.extra_choices.forEach(([value, label]) => {
    console.log(`Option: ${value} = ${label}`);
  });
}
```

### Error Handling

```typescript
import { HTTPError } from '@norskhelsenett/zeniki';

try {
  const prefix = await netbox.getPrefix(999);
} catch (error) {
  if (error instanceof HTTPError) {
    if (error.code === 404) {
      console.log('Prefix not found');
    } else if (error.code === 401) {
      console.log('Authentication failed');
    } else {
      console.log(`API error: ${error.code}`);
    }
  }
}
```

### Following API Links

```typescript
// Follow API links dynamically
const prefix = await netbox.getPrefix(123);
if (prefix.data.vrf && typeof prefix.data.vrf === 'string') {
  const vrf = await netbox.getByUrl(prefix.data.vrf);
  console.log(`VRF: ${vrf.data.name}`);
}
```

## Examples

### Complete Prefix CRUD Operations

```typescript
import { 
  NetboxDriver,
  NetboxPrefixStatus
} from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: { 'Authorization': 'Token your-token' }
});

async function managePrefixes() {
  // CREATE: Add new prefix
  const newPrefix = await netbox.addPrefix({
    prefix: '192.168.100.0/24',
    status: NetboxPrefixStatus.Active,
    description: 'Production server network',
    is_pool: false
  });

  // READ: Get the created prefix
  const retrievedPrefix = await netbox.getPrefix(newPrefix.data.id);
  console.log(`Prefix: ${retrievedPrefix.data.prefix}, Status: ${retrievedPrefix.data.status?.label}`);

  // UPDATE: Modify the prefix (partial update)
  const updatedPrefix = await netbox.patchPrefix({
    description: 'Updated production server network',
    status: NetboxPrefixStatus.Reserved
  }, newPrefix.data.id);

  // DELETE: Remove the prefix
  await netbox.deletePrefixById(newPrefix.data.id);
}
```

### Complete Infrastructure Provisioning Workflow

```typescript
import { 
  NetboxDriver, 
  NetboxPrefixStatus, 
  NetboxOperationalStatus,
  NetboxSiteStatus,
  NetboxVlanStatus
} from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: { 'Authorization': 'Token your-token' }
});

async function provisionCompleteInfrastructure() {
  // 1. Create a site for the new infrastructure (using type-safe enums)
  const newSite = await netbox.addSite({
    name: 'Branch Office East',
    slug: 'branch-east',
    status: NetboxSiteStatus.Active,  // Site-specific enum (more precise than general operational status)
    description: 'New branch office location'
  });
  console.log(`Created site: ${newSite.data.name}`);

  // 2. Create a tenant for organization
  const newTenant = await netbox.addTenant({
    name: 'Engineering Department',
    slug: 'engineering',
    description: 'Engineering team resources'
  });
  
  // 3. Create VRF for network isolation
  const newVrf = await netbox.addVrf({
    name: 'BRANCH_EAST_VRF',
    rd: '65000:200',
    tenant: newTenant.data.id,
    enforce_unique: true
  });
  
  // 4. Create VLANs for different network segments (using type-safe approach)
  const managementVlan = await netbox.addVlan({
    name: 'Management',
    vid: 100,
    site: newSite.data.id,
    tenant: newTenant.data.id,
    status: NetboxVlanStatus.Active  // VLAN-specific enum (more precise than general operational status)
  });
  
  const userVlan = await netbox.addVlan({
    name: 'User Network',
    vid: 200,
    site: newSite.data.id,
    tenant: newTenant.data.id,
    status: NetboxVlanStatus.Active  // VLAN-specific enum
  });
  
  // 5. Add devices to the site
  const coreSwitch = await netbox.addDevice({
    name: 'branch-east-sw01',
    device_type: 42, // Assuming device type ID
    role: 1,         // Assuming role ID
    site: newSite.data.id,
    tenant: newTenant.data.id
  });
  
  // 6. Create tags for organization
  const criticalTag = await netbox.addTag({
    name: 'critical-infrastructure',
    slug: 'critical-infra',
    color: '#ff0000'
  });
  
  return {
    site: newSite.data,
    tenant: newTenant.data,
    vrf: newVrf.data,
    vlans: [managementVlan.data, userVlan.data],
    device: coreSwitch.data,
    tag: criticalTag.data
  };
}
```

### Complete Workflow: Automated Network Provisioning

```typescript
import { NetboxDriver, NetboxPrefixStatus } from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: { 'Authorization': 'Token your-token' }
});

async function provisionNetwork() {
  // 1. Find available space within a parent prefix
  const availablePrefixes = await netbox.getNextAvailablePrefix(42);
  console.log(`Found ${availablePrefixes.data.length} available prefix options`);

  // 2. Automatically allocate a new prefix with metadata (using type-safe enums)
  const newPrefix = await netbox.registerNextAvailablePrefix(
    42,      // Parent prefix ID
    26,      // Desired prefix length (/26)
    100,     // VLAN ID (optional)
    "User access network",  // Description
    {
      status: NetboxPrefixStatus.Active,  // Type-safe enum instead of string
      role: 5  // Network role ID
    },
    {
      "business_unit": "engineering",
      "env": "production", 
      "cost_center": "1234"
    }
  );

  console.log(`Allocated new prefix: ${newPrefix.data[0].prefix}`);
  return newPrefix.data[0];
}

provisionNetwork();
```

### Bulk Operations with Custom Fields

```typescript
async function setupDevelopmentNetworks() {
  const parentPrefixId = 42;
  const environments = ['dev', 'test', 'stage'];
  
  for (const env of environments) {
    const prefix = await netbox.registerNextAvailablePrefix(
      parentPrefixId,
      27,  // /27 networks for each environment
      null,
      `${env.toUpperCase()} environment network`,
      {
        status: NetboxPrefixStatus.Active  // Type-safe enum
      },
      {
        "env": env,
        "purpose": "development",
        "auto_provisioned": "true"
      }
    );
    
    console.log(`Created ${env} network: ${prefix.data[0].prefix}`);
  }
}
```

### Infrastructure Cleanup and Management

```typescript
async function cleanupInfrastructure(siteId: number) {
  // 1. Get all resources associated with the site
  const devices = await netbox.getDevices({ site_id: siteId });
  const vlans = await netbox.getVlans({ site_id: siteId });
  const prefixes = await netbox.getPrefixes({ site_id: siteId });
  
  // 2. Clean up devices first (dependencies)
  for (const device of devices.data.results) {
    await netbox.deleteDeviceById(device.id!);
    console.log(`Deleted device: ${device.name}`);
  }
  
  // 3. Clean up network resources
  for (const vlan of vlans.data.results) {
    await netbox.deleteVlanById(vlan.id!);
    console.log(`Deleted VLAN: ${vlan.name}`);
  }
  
  for (const prefix of prefixes.data.results) {
    await netbox.deletePrefixById(prefix.id!);
    console.log(`Deleted prefix: ${prefix.prefix}`);
  }
  
  // 4. Finally delete the site
  await netbox.deleteSiteById(siteId);
  console.log('Site cleanup completed');
}

// Usage with error handling
async function safeCleanup() {
  try {
    await cleanupInfrastructure(123);
  } catch (error) {
    console.error('Cleanup failed:', error);
    // Handle cleanup failures appropriately
  }
}
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
