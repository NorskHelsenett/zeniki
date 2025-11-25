# VMware NSX Driver Documentation

The VMware NSX driver provides comprehensive integration with VMware NSX Policy API for software-defined networking and security. Built for NSX 3.0+ with support for both local manager and global manager deployments, offering type-safe, well-documented methods for managing security groups, distributed firewall rules, and micro-segmentation policies.

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
  VMWareNSXDriver,
  VMwareNSXGroup,
  VMwareNSXParams,
  VMWareExpression
} from '@norskhelsenett/zeniki';

// Initialize the VMware NSX driver
const nsx = new VMWareNSXDriver({
  baseURL: 'https://nsx-manager.example.com',
  auth: {
    username: 'admin',
    password: 'VMware123!'
  },
  timeout: 30000
});
```

### Basic Operations

```typescript
// Get a specific security group by ID
const group = await nsx.getGroup('web-servers-group');
console.log(`Group: ${group.display_name}, Type: ${group.group_type}`);

// Get all security groups with filtering
const groups = await nsx.getGroups({
  cursor: 'cursor-value',
  page_size: 100
});

console.log(`Found ${groups.result_count} groups`);

// Add a new security group
const newGroup = await nsx.addGroup('database-servers', {
  display_name: 'Database Servers',
  description: 'Production database server group',
  resource_type: 'Group',
  group_type: ['VM'],
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    operator: 'EQUALS',
    key: 'Tag',
    scope: 'environment',
    value: 'production'
  }],
  tags: [{
    scope: 'tier',
    tag: 'database'
  }]
});

// Update an existing group with PATCH
const updatedGroup = await nsx.patchGroup('web-servers-group', {
  description: 'Updated web server group for production environment'
});
```

## VMware NSX Integration Features

The VMware NSX driver provides enterprise-grade features for software-defined networking and security:

### Security and Micro-segmentation
- **Policy-Based Security Groups** - Dynamic membership based on VM tags, IP addresses, or logical constructs
- **Distributed Firewall Rules** - Granular security policies with context-aware enforcement
- **Zero Trust Architecture** - Identity-driven security with application-level protection

### Multi-Site Operations
- **Local Manager Integration** - Single-site NSX deployments with full policy management
- **Global Manager Support** - Multi-site federation with centralized policy distribution
- **Cross-vCenter Operations** - Unified policy across multiple vCenter environments

### Advanced Networking
- **Dynamic Group Membership** - Expression-based criteria for automatic VM inclusion
- **External ID Integration** - Third-party system integration with external identifiers
- **Kubernetes Integration** - Native support for containerized workloads and namespaces

## Driver Configuration

### Constructor

Creates a new VMware NSX driver instance with connection configuration. Configures HTTP client for NSX Policy API access with authentication and SSL settings.

```typescript
new VMWareNSXDriver(config: RequestConfig)
```

**Parameters:**
- `config` (RequestConfig) - Request configuration for NSX manager connection
  - `baseURL` (string, required) - NSX manager base URL (e.g., 'https://nsx-manager.example.com')
  - `auth` (object, required) - Authentication credentials object
    - `username` (string) - NSX administrator username
    - `password` (string) - NSX administrator password
  - `timeout` (number, optional) - Request timeout in milliseconds
  - `httpsAgent` (Agent, optional) - Custom HTTPS agent for SSL configuration
  - `headers` (object, optional) - Custom HTTP headers

**Example configurations:**

```typescript
// Basic configuration with username/password
const nsx = new VMWareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  auth: {
    username: 'admin',
    password: 'VMware123!'
  },
  timeout: 30000
});

// Configuration with SSL certificate handling
import https from 'https';

const nsx = new VMWareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  auth: {
    username: 'admin',
    password: 'VMware123!'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false  // For self-signed certificates
  }),
  timeout: 30000
});

// Configuration with API key authentication (if supported)
const nsx = new VMWareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  }
});
```

## API Methods

The VMware NSX driver provides comprehensive CRUD operations for NSX policy objects:

- **Security Group Management** - Complete lifecycle management for NSX security groups
- **Expression-Based Membership** - Dynamic group criteria with tag, IP, and VM-based filtering
- **Multi-Domain Support** - Operations across different NSX policy domains
- **Global Manager Integration** - Cross-site policy management and distribution

> **Note on Response Types:** Mutation operations (PUT, PATCH, DELETE) return a Response. Check the response's `ok` property or `status` and `statusText` to verify operation success. A status code of 200 indicates success.

### Security Group Management

#### `getGroup(group_id, params?, domain_id?, global_manager?)`

Retrieves a specific NSX security group by ID from the specified domain.

```typescript
async getGroup(
  group_id: string,
  params?: VMwareNSXParams,
  domain_id: string = "default",
  global_manager: boolean = false
): Promise<VMwareNSXGroup | undefined>
```

**Parameters:**
- `group_id` (string) - Security group identifier
- `params` (VMwareNSXParams, optional) - Additional query parameters for filtering results
- `domain_id` (string, default: "default") - Domain identifier for group scope
- `global_manager` (boolean, default: false) - Use global manager API endpoint for federated environments

**Returns:** Promise resolving to NSX group response with group details

**Examples:**

```typescript
// Get group from default domain using local manager
const group = await nsx.getGroup('web-servers-group');
if (group) {
  console.log(`Group: ${group.display_name}, Members: ${group.expression?.length}`);
}

// Get group from specific domain
const response = await nsx.getGroup(
  'database-servers',
  { include_mark_for_delete_objects: false },
  'production-domain'
);

// Get group using global manager API
const response = await nsx.getGroup(
  'cross-site-group',
  {},
  'global-domain',
  true
);
```

#### `getGroups(params?, domain_id?, global_manager?)`

Retrieves a paginated list of NSX security groups with optional filtering.

```typescript
async getGroups(
  params?: VMwareNSXParams,
  domain_id: string = "default",
  global_manager: boolean = false
): Promise<VMwareNSXResponse<VMwareNSXGroup>>>
```

**Parameters:**
- `params` (VMwareNSXParams, optional) - Additional query parameters for filtering (cursor, page_size, etc.)
- `domain_id` (string, default: "default") - Domain identifier for group scope
- `global_manager` (boolean, default: false) - Use global manager API endpoint for federated environments

**Returns:** Promise resolving to paginated NSX groups response

**Examples:**

```typescript
// Get all groups from default domain
const groups = await nsx.getGroups();
if (groups && groups.results) {
  const groupList = groups.results;
}

// Get groups with pagination
const response = await nsx.getGroups({
  cursor: 'cursor-value',
  page_size: 50
});

// Search groups by display name
const response = await nsx.getGroups({
  search_string: 'web'
});

// Get groups with specific resource type
const response = await nsx.getGroups({
  resource_type: 'Group'
});
```

#### `addGroup(group_id, group, params?, domain_id?)`

Creates a new NSX security group using PUT operation (upsert). Creates new group if not exists, updates if already present.

```typescript
async addGroup(
  group_id: string,
  group: VMwareNSXGroup,
  params?: VMwareNSXParams,
  domain_id: string = "default"
): Promise<string>>
```

**Parameters:**
- `group_id` (string) - Security group identifier to create or update
- `group` (VMwareNSXGroup) - Complete group object with all required properties
- `params` (VMwareNSXParams, optional) - Additional query parameters for operation control
- `domain_id` (string, default: "default") - Domain identifier for group scope

**Returns:** Promise resolving to operation status (check status and statusText, data is an empty string)

**Examples:**

```typescript
// Example 1: Using string literals (quick setup)
const simpleGroup = await nsx.addGroup('web-servers', {
  display_name: 'Web Servers',
  description: 'Simple web server group',
  resource_type: 'Group',
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    key: 'Tag',
    operator: 'EQUALS',
    value: 'web'
  }]
});

// Example 2: Using actual type values (production recommended)
const productionGroup = await nsx.addGroup('web-servers-prod', {
  display_name: 'Production Web Servers',
  description: 'Web servers in production environment',
  resource_type: 'Group',
  group_type: ['IPAddress'],
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    key: 'Tag',
    operator: 'EQUALS',
    value: 'web-server'
  }],
  tags: [{
    scope: 'environment', 
    tag: 'production'
  }]
});
```
    tag: 'production'
  }]
});

// Create an IP address-based group
const ipGroup = await nsx.addGroup('dmz-network', {
  display_name: 'DMZ Network Range',
  description: 'DMZ IP address range',
  resource_type: 'Group',
  expression: [{
    resource_type: 'IPAddressExpression',
    ip_addresses: ['192.168.100.0/24', '192.168.101.0/24']
  }]
});

// Create a complex group with multiple conditions
const complexGroup = await nsx.addGroup('multi-tier-app', {
  display_name: 'Multi-Tier Application',
  description: 'Complex application with multiple tiers',
  resource_type: 'Group',
  expression: [{
    resource_type: 'NestedExpression',
    expressions: [
      {
        resource_type: 'Condition',
        member_type: 'VirtualMachine',
        operator: 'EQUALS',
        key: 'Tag',
        scope: 'application',
        value: 'ecommerce'
      },
      {
        resource_type: 'ConjunctionOperator',
        conjunction_operator: 'OR'
      },
      {
        resource_type: 'Condition',
        member_type: 'VirtualMachine',
        operator: 'EQUALS',
        key: 'Tag',
        scope: 'tier',
        value: 'web'
      }
    ]
  }]
});
```

#### `updateGroup(group_id, group, params?, domain_id?)`

Updates an existing NSX security group using PUT operation (complete replacement). Performs complete replacement of group configuration with provided data.

```typescript
async updateGroup(
  group_id: string,
  group: VMwareNSXGroup,
  params?: VMwareNSXParams,
  domain_id: string = "default"
): Promise<string>>
```

**Parameters:**
- `group_id` (string) - Security group identifier to update or create
- `group` (VMwareNSXGroup) - Complete group object with all required properties
- `params` (VMwareNSXParams, optional) - Additional query parameters for operation control
- `domain_id` (string, default: "default") - Domain identifier for group scope

**Returns:** Promise resolving to operation status (check status and statusText, data is an empty string)

#### `patchGroup(group_id, group, params?, domain_id?)`

Updates an existing NSX security group using PATCH operation (partial update). Allows selective updates to group properties without replacing the entire group configuration.

```typescript
async patchGroup(
  group_id: string,
  group: Partial<VMwareNSXGroup>,
  params?: VMwareNSXParams,
  domain_id: string = "default"
): Promise<string>>
```

**Parameters:**
- `group_id` (string) - Security group identifier to update
- `group` (Partial<VMwareNSXGroup>) - Partial group object with fields to modify
- `params` (VMwareNSXParams, optional) - Additional query parameters for operation control
- `domain_id` (string, default: "default") - Domain identifier for group scope

**Returns:** Promise resolving to operation status (check status and statusText, data is an empty string)

**Examples:**

```typescript
// Example 1: Simple description update (string literals)
const updated = await nsx.patchGroup('web-servers', {
  description: 'Updated web server group description'
});

// Example 2: Complex update with type-safe values
const advancedUpdate = await nsx.patchGroup('database-servers', {
  description: 'Production database servers with compliance tags',
  tags: [
    { scope: 'environment', tag: 'production' },
    { scope: 'backup', tag: 'daily' },
    { scope: 'compliance', tag: 'pci-dss' }
  ],
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    key: 'Tag',
    operator: 'EQUALS',
    value: 'database-server'
  }]
});
```
const updated = await nsx.patchGroup('app-servers', {
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    operator: 'CONTAINS',
    key: 'Name',
    value: 'app-server'
  }]
});
```

#### `deleteGroup(group_id, params?, domain_id?)`

Deletes an NSX security group from the specified domain. Removes the group and all its associated configurations from the NSX policy framework.

```typescript
async deleteGroup(
  group_id: string,
  params?: VMwareNSXParams,
  domain_id: string = "default"
): Promise<string>>
```

**Parameters:**
- `group_id` (string) - Security group identifier to delete
- `params` (VMwareNSXParams, optional) - Additional query parameters (force deletion, etc.)
- `domain_id` (string, default: "default") - Domain identifier for group scope

**Returns:** Promise resolving to deletion status (check status and statusText, data is an empty string)

**Examples:**

```typescript
// Delete group from default domain
const result = await nsx.deleteGroup('old-web-servers');

// Delete group with force option
const result = await nsx.deleteGroup('legacy-group', {
  force: true
});

// Delete group from specific domain
const result = await nsx.deleteGroup(
  'test-group',
  {},
  'development-domain'
);
```

### Generic API Access

#### `getByUrl<T>(url, params?)`

Generic method to access any NSX API endpoint using a full URL. Provides generic access to NSX Policy API endpoints beyond predefined methods.

```typescript
async getByUrl<T>(
  url: string,
  params?: { [key: string]: any }
): Promise<T>>
```

**Parameters:**
- `url` (string) - Complete NSX API endpoint URL (relative or absolute path)
- `params` (object, optional) - Query parameters for the request (filters, pagination, etc.)

**Returns:** Promise resolving to typed NSX response

#### `getPaginatedByUrl<T>(url, params?, follow?)`

Execute paginated requests with optional automatic result aggregation. Optionally follows pagination links to retrieve complete result sets from NSX API.

```typescript
async getPaginatedByUrl<T>(
  url: string,
  params?: { [key: string]: any },
  follow?: boolean
): Promise<VMwareNSXResponse<T>>>
```

**Parameters:**
- `url` (string) - NSX API endpoint URL for paginated request
- `params` (object, optional) - Query parameters including pagination controls (page_size, cursor, etc.)
- `follow` (boolean, default: false) - Enable automatic pagination following to retrieve all pages

**Returns:** Promise resolving to paginated NSX response

**Examples:**

```typescript
// Access distributed firewall rules
const rules = await nsx.getByUrl<any>(
  '/policy/api/v1/infra/domains/default/security-policies'
);

// Get specific policy with parameters
const policy = await nsx.getByUrl<any>(
  '/policy/api/v1/infra/domains/default/security-policies/web-policy',
  { include_mark_for_delete_objects: false }
);

// Get all groups with automatic pagination
const allGroups = await nsx.getPaginatedByUrl<VMwareNSXGroup>(
  '/policy/api/v1/infra/domains/default/groups',
  { page_size: 100 },
  true
);

// Access global manager endpoints
const globalPolicies = await nsx.getByUrl<any>(
  '/api/v1/global-infra/domains/default/security-policies'
);
```

## Advanced Usage

### Multi-Domain Operations

NSX supports multiple policy domains for logical separation:

```typescript
// Work with production domain
const prodGroups = await nsx.getGroups({}, 'production');

// Create group in development domain
const devGroup = await nsx.addGroup('test-servers', {
  display_name: 'Test Servers',
  resource_type: 'Group',
  expression: [{ resource_type: 'Condition' }]
}, {}, 'development');

// Cross-domain policy distribution using global manager
const globalGroup = await nsx.getGroup(
  'cross-site-policy',
  {},
  'global',
  true
);
```

### Expression-Based Group Membership

Create dynamic groups with complex membership criteria:

```typescript
// Tag-based membership
const tagGroup = await nsx.addGroup('production-vms', {
  display_name: 'Production VMs',
  resource_type: 'Group',
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    operator: 'EQUALS',
    key: 'Tag',
    scope: 'environment',
    value: 'production'
  }]
});

// IP address-based membership
const ipGroup = await nsx.addGroup('subnet-192-168-1', {
  display_name: 'Subnet 192.168.1.x',
  resource_type: 'Group',
  expression: [{
    resource_type: 'IPAddressExpression',
    ip_addresses: ['192.168.1.0/24']
  }]
});

// Complex logical expressions
const complexGroup = await nsx.addGroup('web-and-app-tiers', {
  display_name: 'Web and App Tiers',
  resource_type: 'Group',
  expression: [{
    resource_type: 'NestedExpression',
    expressions: [
      {
        resource_type: 'Condition',
        member_type: 'VirtualMachine',
        operator: 'EQUALS',
        key: 'Tag',
        scope: 'tier',
        value: 'web'
      },
      {
        resource_type: 'ConjunctionOperator',
        conjunction_operator: 'OR'
      },
      {
        resource_type: 'Condition',
        member_type: 'VirtualMachine',
        operator: 'EQUALS',
        key: 'Tag',
        scope: 'tier',
        value: 'app'
      }
    ]
  }]
});
```

### Kubernetes Integration

NSX supports Kubernetes workloads with native objects:

```typescript
// Kubernetes namespace-based group
const k8sGroup = await nsx.addGroup('k8s-production', {
  display_name: 'Kubernetes Production',
  resource_type: 'Group',
  expression: [{
    resource_type: 'Condition',
    member_type: 'Namespace',
    operator: 'EQUALS',
    key: 'Name',
    value: 'production'
  }]
});

// Pod-based group with labels
const podGroup = await nsx.addGroup('frontend-pods', {
  display_name: 'Frontend Pods',
  resource_type: 'Group',
  expression: [{
    resource_type: 'Condition',
    member_type: 'Pod',
    operator: 'EQUALS',
    key: 'Tag',
    scope: 'app',
    value: 'frontend'
  }]
});
```

### Error Handling and Validation

```typescript
import { HTTPError } from '@norskhelsenett/zeniki';

try {
  const group = await nsx.addGroup('duplicate-group', groupData);
  console.log('Group created successfully');
  
} catch (error) {
  if (error instanceof HTTPError) {
    if (error.code === 409) {
      console.log('Group already exists');
    } else if (error.code === 400) {
      console.log('Invalid group configuration');
      console.log('Validation errors:', error.message);
    } else if (error.code === 403) {
      console.log('Insufficient permissions');
    } else if (error.code === 404) {
      console.log('Resource not found');
    } else {
      console.log(`NSX API error: ${error.code}`);
      console.log(`Error details: ${error.message}`);
    }
  }
}

// Checking operation success for PATCH/PUT/DELETE
async function updateGroupSafely() {
  try {
    await nsx.patchGroup('web-servers', {
      description: 'Updated description'
    });
    console.log('Update successful');
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error(`Update failed: ${error.code} ${error.message}`);
    }
  }
}
```

## Examples

### Complete Security Group CRUD Operations

```typescript
import { VMWareNSXDriver } from '@norskhelsenett/zeniki';

const nsx = new VMWareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  auth: { username: 'admin', password: 'password' }
});

async function manageSecurityGroups() {
  // CREATE: Add new security group
  const webGroup = await nsx.addGroup('web-servers', {
    display_name: 'Web Servers',
    description: 'Production web server group',
    resource_type: 'Group',
    group_type: ['IPAddress'],
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      key: 'Tag',
      operator: 'EQUALS',
      value: 'web-server'
    }],
    tags: [{
      scope: 'environment',
      tag: 'production'
    }]
  });

  // READ: Get the created group
  const retrievedGroup = await nsx.getGroup('web-servers');
  console.log(`Group: ${retrievedGroup.display_name}`);

  // UPDATE: Modify the group (partial update)
  const updatedGroup = await nsx.patchGroup('web-servers', {
    description: 'Updated production web server group',
    tags: [{
      scope: 'environment',
      tag: 'production'
    }, {
      scope: 'tier',
      tag: 'frontend'
    }]
  });

  // DELETE: Remove the group
  await nsx.deleteGroup('web-servers');
}
```

### Complete Micro-segmentation Setup

```typescript
import { VMWareNSXDriver } from '@norskhelsenett/zeniki';

const nsx = new VMWareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  auth: { username: 'admin', password: 'password' }
});

async function setupMicroSegmentation() {
  // 1. Create tier-based security groups
  const webTierGroup = await nsx.addGroup('web-tier', {
    display_name: 'Web Tier',
    description: 'Web servers for application delivery',
    resource_type: 'Group',
    group_type: ['VM'],
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'tier',
      value: 'web'
    }],
    tags: [
      { scope: 'application', tag: 'ecommerce' },
      { scope: 'tier', tag: 'web' }
    ]
  });

  const appTierGroup = await nsx.addGroup('app-tier', {
    display_name: 'Application Tier',
    description: 'Application servers for business logic',
    resource_type: 'Group',
    group_type: ['VM'],
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'tier',
      value: 'app'
    }],
    tags: [
      { scope: 'application', tag: 'ecommerce' },
      { scope: 'tier', tag: 'app' }
    ]
  });

  const dbTierGroup = await nsx.addGroup('db-tier', {
    display_name: 'Database Tier',
    description: 'Database servers for data persistence',
    resource_type: 'Group',
    group_type: ['VM'],
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'tier',
      value: 'db'
    }],
    tags: [
      { scope: 'application', tag: 'ecommerce' },
      { scope: 'tier', tag: 'db' }
    ]
  });

  // 2. Create environment-based groups
  const productionGroup = await nsx.addGroup('production-env', {
    display_name: 'Production Environment',
    description: 'All production workloads',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'environment',
      value: 'production'
    }]
  });

  // 3. Create network-based groups
  const dmzGroup = await nsx.addGroup('dmz-network', {
    display_name: 'DMZ Network',
    description: 'DMZ network segment',
    resource_type: 'Group',
    expression: [{
      resource_type: 'IPAddressExpression',
      ip_addresses: ['192.168.100.0/24']
    }]
  });

  return {
    tiers: [webTierGroup, appTierGroup, dbTierGroup],
    environments: [productionGroup],
    networks: [dmzGroup]
  };
}
```

### Cross-Site Policy Management

```typescript
async function setupCrossSitePolicy() {
  // Create local groups on each site
  const site1Group = await nsx.addGroup('site1-web-servers', {
    display_name: 'Site 1 Web Servers',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'CONTAINS',
      key: 'Name',
      value: 'site1-web'
    }]
  }, {}, 'site1-domain');

  const site2Group = await nsx.addGroup('site2-web-servers', {
    display_name: 'Site 2 Web Servers',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'CONTAINS',
      key: 'Name',
      value: 'site2-web'
    }]
  }, {}, 'site2-domain');

  // Create global group using global manager
  const globalGroup = await nsx.addGroup('global-web-servers', {
    display_name: 'Global Web Servers',
    description: 'Web servers across all sites',
    resource_type: 'Group',
    expression: [{
      resource_type: 'NestedExpression',
      expressions: [
        {
          resource_type: 'PathExpression',
          paths: ['/infra/domains/site1-domain/groups/site1-web-servers']
        },
        {
          resource_type: 'ConjunctionOperator',
          conjunction_operator: 'OR'
        },
        {
          resource_type: 'PathExpression',
          paths: ['/infra/domains/site2-domain/groups/site2-web-servers']
        }
      ]
    }]
  }, {}, 'global-domain');

  return { site1Group, site2Group, globalGroup };
}
```

### Kubernetes Workload Protection

```typescript
async function setupKubernetesProtection() {
  // Create namespace-based groups
  const prodNamespace = await nsx.addGroup('k8s-prod-namespace', {
    display_name: 'Kubernetes Production Namespace',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'Namespace',
      operator: 'EQUALS',
      key: 'Name',
      value: 'production'
    }]
  });

  // Create pod-based groups with labels
  const frontendPods = await nsx.addGroup('frontend-pods', {
    display_name: 'Frontend Pods',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'Pod',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'app',
      value: 'frontend'
    }]
  });

  // Create service-based groups
  const backendServices = await nsx.addGroup('backend-services', {
    display_name: 'Backend Services',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'Service',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'tier',
      value: 'backend'
    }]
  });

  return {
    namespaces: [prodNamespace],
    pods: [frontendPods],
    services: [backendServices]
  };
}
```

## Type Definitions

The VMware NSX driver provides comprehensive TypeScript type definitions for all NSX Policy API objects and responses.

### VMwareNSXGroup

Main security group interface supporting expression-based membership. Extends VMwareNSXPartial to provide grouping capabilities with expression-based membership criteria, extended identity context, and reference group support.

```typescript
interface VMwareNSXGroup extends VMwareNSXPartial {
  // Expression list defining group membership criteria with validation rules (optional)
  expression?: VMWareExpression[];
  
  // Extended expression for higher-level context - user AD groups for IDFW (optional, max 1 item)
  extended_expression?: VMWareExpression[];
  
  // Resource type identifier for this group object (optional)
  resource_type?: VmwareResourceTypes;
  
  // Group type specification for entity membership constraints (optional, max 1 item)
  group_type?: VmwareGroupTypes[];
  
  // Indicates if group is a remote reference with different span (optional, readonly, default: false)
  readonly reference?: boolean;
  
  // Current realization state of the group object (optional, readonly)
  readonly state?: VmwareRealizationStates | VmwareRealizationState;
  
  // Tag collection for group metadata and filtering (optional, max 30)
  tags?: VMWareNSXTag[] | [];
}
```

### VMWareExpression

Expression interface for dynamic group membership criteria. Extends VMwareNSXPartial with expression-based matching capabilities.

```typescript
interface VMWareExpression extends VMwareNSXPartial {
  // Expression resource type defining the matching criteria behavior (optional)
  resource_type?: VmwareExpressionResourceTypes;
  
  // Value for condition expression matching (optional, max 1024 chars)
  value?: string;
  
  // Key type for condition expression evaluation (optional)
  key?: VmwareExpressionKeyTypes;
  
  // Member type for condition and external ID expressions (optional)
  member_type?: VmwareExpressionMemberTypes | VmwareExternalIDExpressionTypes;
  
  // Operator for condition expression logic (optional)
  operator?: VmwareExpressionOperatorTypes;
  
  // Scope operator for condition expression evaluation (optional)
  scope_operator?: VmwareExpressionScopeOperatorTypes;
  
  // Conjunction operator for expression logic combination (optional)
  conjunction_operator?: VmwareExpressionConjunctionOperatorTypes;
  
  // IP address collection for IP-based expression matching (optional, 1-2000 items)
  ip_addresses?: string[];
  
  // Tag collection for expression-based matching and filtering (optional, max 30)
  tags?: VMWareNSXTag[];
}
```

### VMwareNSXParams

Query parameters for NSX API requests:

```typescript
interface VMwareNSXParams {
  // Pagination cursor (optional)
  cursor?: string;
  
  // Page size for pagination (optional)
  page_size?: number;
  
  // Include objects marked for deletion (optional)
  include_mark_for_delete_objects?: boolean;
  
  // Search string for filtering (optional)
  search_string?: string;
  
  // Resource type filter (optional)
  resource_type?: string;
  
  // Force operation flag (optional)
  force?: boolean;
}
```

### VMwareNSXResponse

Generic NSX API response wrapper:

```typescript
interface VMwareNSXResponse<T> {
  // Array of result objects
  results: T[];
  
  // Total result count
  result_count?: number;
  
  // Pagination cursor for next page (optional)
  cursor?: string;
  
  // Response metadata (optional)
  _metadata?: {
    total_count?: number;
    page_size?: number;
    current_cursor?: string;
  };
}
```

### Type Enums

Key enumeration types for type safety:

```typescript
// Resource types
type VmwareResourceTypes = "Group" | "NSGroup" | "VirtualMachine" | "TagBulkOperation" | "Rule" | "Expression";

// Group types
type VmwareGroupTypes = "IPAddress" | "ANTREA";

// Expression resource types
type VmwareExpressionResourceTypes = 
  | "Condition"
  | "ConjunctionOperator"
  | "NestedExpression"
  | "IPAddressExpression"
  | "MACAddressExpression"
  | "ExternalIDExpression"
  | "PathExpression"
  | "IdentityGroupExpression";

// Member types for expressions
type VmwareExpressionMemberTypes = 
  | "IPSet"
  | "VirtualMachine"
  | "LogicalPort"
  | "LogicalSwitch"
  | "Segment"
  | "SegmentPort"
  | "Pod"
  | "Service"
  | "Namespace"
  | "TransportNode"
  | "Group"
  | "DVPG"
  | "DVPort"
  | "IPAddress"
  | "VpcSubnet"
  | "KubernetesCluster"
  | "KubernetesNamespace"
  | "AntreaEgress"
  | "AntreaIPPool"
  | "KubernetesIngress"
  | "KubernetesGateway"
  | "KubernetesService"
  | "KubernetesNode"
  | "VpcSubnetPort";

// External ID expression types
type VmwareExternalIDExpressionTypes = 
  | "ExternalIDExpression";

// Comparison operators
type VmwareExpressionOperatorTypes = 
  | "EQUALS"
  | "CONTAINS"
  | "STARTSWITH"
  | "ENDSWITH"
  | "NOTEQUALS"
  | "NOTIN"
  | "MATCHES"
  | "IN";

// Scope operators for condition expressions
type VmwareExpressionScopeOperatorTypes = 
  | "EQUALS";

// Logical conjunction operators
type VmwareExpressionConjunctionOperatorTypes = 
  | "AND"
  | "OR";

// Attribute keys for condition matching
type VmwareExpressionKeyTypes = 
  | "Tag"
  | "Name"
  | "OSName"
  | "ComputerName"
  | "NodeType"
  | "GroupType"
  | "ALL"
  | "IPAddress"
  | "PodCidr";

// Realization states for policy objects
type VmwareRealizationStates = 
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILURE";

// Protection statuses for resource modification control
type VmwareProtectionStatuses = 
  | "PROTECTED"
  | "NOT_PROTECTED"
  | "REQUIRE_OVERRIDE";
```

## See Also

- [VMware NSX 3.0+ Policy API Documentation](https://code.vmware.com/apis/1083/nsx)
- [VMware NSX Administration Guide](https://docs.vmware.com/en/VMware-NSX/index.html)
- [NSX Kubernetes Integration](https://docs.vmware.com/en/VMware-NSX/index.html)
- [Main Zeniki Documentation](../../../../README.md)