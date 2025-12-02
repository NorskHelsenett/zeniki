# VMware NSX Driver Documentation

## Summary

The VMware NSX driver provides type-safe integration with VMware NSX Policy API (v3.0+) for software-defined networking and micro-segmentation. Core functionality includes security group management via sub-driver architecture, expression-based dynamic membership, and multi-domain policy operations with local/global manager support.

Key features include comprehensive TypeScript type definitions with enum support, HTTP error handling via `HTTPError` class, automatic pagination for large result sets, and specialized sub-drivers (`groups`, `search`) for organized API access. The driver supports enterprise features like Kubernetes workload protection, cross-site policy distribution, and Zero Trust architecture implementation.

Access patterns follow sub-driver structure: `nsx.groups.*` for security group operations, `nsx.search.*` for unified search queries, plus `getByUrl()` and `getPaginatedByUrl()` for generic Policy API access. Each sub-driver provides standard CRUD operations with consistent method signatures across local manager and global manager deployments.

Technical implementation uses native fetch API with `RequestConfig` supporting standard `RequestInit` options. Authentication via Basic Auth (username/password) or Bearer tokens, with domain targeting through method parameters. Error handling through `HTTPError` class exposing HTTP status codes and response details.

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
  baseURL: string;              // NSX manager base URL (e.g., 'https://nsx-manager.example.com')
  headers: HeadersInit;         // HTTP headers including Basic authentication
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

### Configuration Examples

```typescript
// Basic authentication (NSX Policy API standard)
const username = 'admin';
const password = 'VMware123!';
const authString = `${username}:${password}`;
const encodedAuth = btoa(authString);

const nsx = new VMwareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  headers: {
    'User-Agent': 'MyApp/1.0',
    'Authorization': `Basic ${encodedAuth}`,
    'Content-Type': 'application/json'
  }
});

// With request timeout
const nsx = new VMwareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  headers: {
    'Authorization': `Basic ${encodedAuth}`,
    'Content-Type': 'application/json'
  },
  signal: AbortSignal.timeout(30000)  // 30 second timeout
});
```

## Basic Usage

```typescript
import { VMwareNSXDriver } from '@norskhelsenett/zeniki';

// Encode credentials for Basic authentication
const username = 'admin';
const password = 'password';
const encodedAuth = btoa(`${username}:${password}`);

const nsx = new VMwareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  headers: {
    'Authorization': `Basic ${encodedAuth}`,
    'Content-Type': 'application/json'
  }
});

// Security group operations
const group = await nsx.groups.getGroup('web-servers', 'default');
const groups = await nsx.groups.getGroups({ page_size: 50 }, 'default');

await nsx.groups.addGroup('app-servers', 'default', {
  display_name: 'App Servers',
  resource_type: 'Group',
  expression: [{
    resource_type: 'Condition',
    member_type: 'VirtualMachine',
    key: 'Tag',
    value: 'app'
  }]
});

await nsx.groups.patchGroup('web-servers', 'default', {
  description: 'Updated description'
});

await nsx.groups.deleteGroup('old-group', 'default');

// Search operations
const searchResults = await nsx.search.query({ query: 'web-servers', resource_type: 'Group' });
```

## Advanced Usage

```typescript
import { VMwareNSXDriver, HTTPError } from '@norskhelsenett/zeniki';

// Encode credentials for Basic authentication
const username = 'admin';
const password = 'password';
const encodedAuth = btoa(`${username}:${password}`);

const nsx = new VMwareNSXDriver({
  baseURL: 'https://nsx-manager.company.com',
  headers: {
    'Authorization': `Basic ${encodedAuth}`,
    'Content-Type': 'application/json'
  }
});

// Multi-domain and expression-based operations
try {
  // Tag-based dynamic membership
  await nsx.groups.addGroup('web-tier', 'production', {
    display_name: 'Web Tier',
    resource_type: 'Group',
    expression: [{
      resource_type: 'Condition',
      member_type: 'VirtualMachine',
      operator: 'EQUALS',
      key: 'Tag',
      scope: 'tier',
      value: 'web'
    }],
    tags: [{ scope: 'environment', tag: 'production' }]
  });

  // IP address-based group
  await nsx.groups.addGroup('dmz-network', 'default', {
    display_name: 'DMZ Network',
    resource_type: 'Group',
    expression: [{
      resource_type: 'IPAddressExpression',
      ip_addresses: ['192.168.100.0/24']
    }]
  });

  // Kubernetes workload protection
  await nsx.groups.addGroup('k8s-production', 'default', {
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

  // Global manager cross-site operations
  const globalGroup = await nsx.groups.getGroup(
    'cross-site-policy',
    'global-domain',
    {},
  // Generic API access with pagination
  const allPolicies = await nsx.getPaginatedByUrl(
    '/policy/api/v1/infra/domains/default/security-policies',
    { page_size: 100 },
    true  // Auto-follow pagination
  );

  // Search across NSX resources
  const vmSearch = await nsx.search.query({
    query: 'web',
    resource_type: 'VirtualMachine',
    cursor: undefined
  });

} catch (error) {-follow pagination
  );

} catch (error) {
  if (error instanceof HTTPError) {
    console.error(`NSX API Error ${error.code}: ${error.message}`);
    if (error.code === 409) console.log('Group already exists');
### Sub-Drivers

**`groups`** - VMwareNSXGroupsSubDriver
- `getGroup(group_id, domain_id?, params?, global_manager?)` - Retrieve security group by ID
- `getGroups(domain_id?, params?, global_manager?)` - List all security groups with pagination
- `addGroup(group_id, domain_id?, group, params?)` - Create new security group (upsert)
- `updateGroup(group_id, domain_id?, group, params?)` - Complete replacement of security group
- `patchGroup(group_id, domain_id?, group, params?)` - Partial update of security group
- `deleteGroup(group_id, domain_id?, params?)` - Delete security group

**`search`** - VMwareNSXSearchSubDriver
- `query<T>(params)` - Execute unified search query across NSX resources

### Generic Methodsd, domain_id?, params?, global_manager?)` - Retrieve security group by ID
- `getGroups(domain_id?, params?, global_manager?)` - List all security groups with pagination
- `addGroup(group_id, domain_id?, group, params?)` - Create new security group (upsert)
- `updateGroup(group_id, domain_id?, group, params?)` - Complete replacement of security group
- `patchGroup(group_id, domain_id?, group, params?)` - Partial update of security group
- `deleteGroup(group_id, domain_id?, params?)` - Delete security group

### Generic Methods

- `getByUrl<T>(url, params?)` - Access any NSX Policy API endpoint
- `getPaginatedByUrl<T>(url, params?, follow?)` - Paginated endpoint access with auto-follow

## Type Definitions

### Core Interfaces

**VMwareNSXGroup** - Security group with expression-based membership
```typescript
interface VMwareNSXGroup extends VMwareNSXPolicyConfigResource {
  expression?: VMwareExpression[];              // Membership criteria expressions
  extended_expression?: VMwareExpression[];     // Extended context (AD groups for IDFW)
  resource_type?: VMwareResourceTypes;          // Resource type identifier
  group_type?: VMwareGroupTypes[];              // Entity membership constraints
  readonly reference?: boolean;                 // Remote reference indicator
  readonly state?: VMwareRealizationStates;     // Realization state
  tags?: VMwareNSXTag[];                        // Metadata tags (max 30)
}
```

**VMwareExpression** - Dynamic group membership criteria
```typescript
interface VMwareExpression extends VMwareNSXPolicyConfigResource {
  resource_type?: VMwareExpressionResourceTypes;    // Expression type
  value?: string;                                   // Match value (max 1024 chars)
  key?: VMwareExpressionKeyTypes;                   // Condition key type
  member_type?: VMwareExpressionMemberTypes;        // Member entity type
  operator?: VMwareExpressionOperatorTypes;         // Comparison operator
  scope_operator?: VMwareExpressionScopeOperatorTypes; // Scope operator
  conjunction_operator?: VMwareExpressionConjunctionOperatorTypes; // Logical operator
  ip_addresses?: string[];                          // IP addresses (1-2000 items)
  tags?: VMwareNSXTag[];                           // Expression tags (max 30)
}
```

**VMwareNSXPartial** - Base NSX policy object properties
```typescript
interface VMwareNSXPartial {
  readonly _create_time?: number;                   // Resource creation timestamp
  readonly _create_user?: string;                   // User who created resource
  readonly _last_modified_time?: number;            // Last modification timestamp
  readonly _last_modified_user?: string;            // User who last modified
  readonly _protection?: VMwareProtectionStatuses;  // Protection status
  readonly _revision?: number;                      // Revision number for optimistic locking
  readonly _system_owned?: boolean;                 // System-owned resource flag
  description?: string;                             // Resource description (max 1024 chars)
  display_name?: string;                            // Display name (max 255 chars)
  id?: string;                                      // Unique identifier (max 255 chars)
  resource_type?: VMwareResourceTypes;              // Resource type identifier
  tags?: VMwareNSXTag[];                           // Metadata tags (max 30)
  children?: any[];                                 // Child resources
  marked_for_delete?: boolean;                      // Deletion pending flag
  parent_path?: string;                             // Parent resource path
  path?: string;                                    // Absolute resource path
  relative_path?: string;                           // Relative resource path
  remote_path?: string;                             // Remote location path
  unique_id?: string;                               // Globally unique identifier
}
```

**VMwareNSXDiscoveredResource** - Auto-discovered resource base
```typescript
interface VMwareNSXDiscoveredResource {
  readonly _last_sync_time?: number;                // Last synchronization timestamp
  readonly _links?: VMwareNSXResourceLink[];        // Resource links
  readonly _schema?: string;                        // Schema URL
  readonly _self?: VMwareNSXSelfResourceLink;       // Self-reference link
  description?: string;                             // Resource description (max 1024 chars)
  display_name?: string;                            // Display name (max 255 chars)
  id?: string;                                      // Unique identifier (max 255 chars)
  resource_type?: VMwareResourceTypes;              // Resource type
  scope?: VMwareNSXDiscoveredResourceScope[];       // Resource scopes
  tags?: VMwareNSXTag[];                           // Metadata tags (max 30)
}
```

**VMwareNSXResourceReference** - Resource reference with validation
```typescript
interface VMwareNSXResourceReference {
  readonly is_valid?: boolean;                      // Resource validity status
  readonly target_display_name?: string;            // Referenced resource display name
  readonly target_id?: string;                      // Referenced resource ID
  readonly target_type?: string;                    // Referenced resource type
}
```

**VMwareNSXVirtualMachine** - Virtual machine in NSX inventory
```typescript
interface VMwareNSXVirtualMachine extends Partial<VMwareNSXDiscoveredResource> {
  readonly _meta?: VMwareNSXVirtualMachineMeta;     // VM metadata
  compute_ids: string[];                            // External compute IDs
  external_id: string;                              // Current external ID
  readonly guest_info?: VMwareNSXGuestInfo;         // Guest OS information
  host_id?: string;                                 // Host system ID
  local_id_on_host: string;                         // Local VM identifier
  power_state: VMwareNSXVirtualMachinePowerStates;  // VM power state
  readonly runtime_info?: VMwareNSXVirtualMachineRuntimeInfo; // Runtime details
  source?: VMwareNSXResourceReference;              // Source reference
  type?: VMwareNSXVirtualMachineTypes;              // VM type
  readonly uptv2_enabled?: boolean;                 // UPTv2 status
}
```

### Request/Response Types

**VMwareNSXParams** - Query parameters
```typescript
interface VMwareNSXParams {
  cursor?: string;                          // Pagination cursor
  page_size?: number;                       // Results per page
  include_mark_for_delete_objects?: boolean; // Include deleted objects
  search_string?: string;                   // Search filter
  resource_type?: string;                   // Resource type filter
  force?: boolean;                          // Force operation flag
}
```

**VMwareNSXResponse<T>** - API response wrapper
```typescript
interface VMwareNSXResponse<T> {
  results: T[];                             // Result objects
  result_count?: number;                    // Total count
  cursor?: string;                          // Next page cursor
  _metadata?: {                             // Response metadata
    total_count?: number;
    page_size?: number;
    current_cursor?: string;
  };
}
```

### Enums

**VMwareResourceTypes**
```typescript
type VMwareResourceTypes = "Group" | "NSGroup" | "VirtualMachine" | "TagBulkOperation" | "Rule" | "Expression";
```

**VMwareGroupTypes**
```typescript
type VMwareGroupTypes = "IPAddress" | "ANTREA";
```

**VMwareExpressionResourceTypes**
```typescript
type VMwareExpressionResourceTypes = 
  | "Condition" | "ConjunctionOperator" | "NestedExpression"
  | "IPAddressExpression" | "MACAddressExpression" | "ExternalIDExpression"
  | "PathExpression" | "IdentityGroupExpression";
```

**VMwareExpressionMemberTypes**
```typescript
type VMwareExpressionMemberTypes = 
  | "IPSet" | "VirtualMachine" | "LogicalPort" | "LogicalSwitch"
  | "Segment" | "SegmentPort" | "Pod" | "Service" | "Namespace"
  | "TransportNode" | "Group" | "DVPG" | "DVPort" | "IPAddress"
  | "VpcSubnet" | "KubernetesCluster" | "KubernetesNamespace"
  | "AntreaEgress" | "AntreaIPPool" | "KubernetesIngress"
  | "KubernetesGateway" | "KubernetesService" | "KubernetesNode" | "VpcSubnetPort";
```

**VMwareExpressionOperatorTypes**
```typescript
type VMwareExpressionOperatorTypes = 
  | "EQUALS" | "CONTAINS" | "STARTSWITH" | "ENDSWITH"
  | "NOTEQUALS" | "NOTIN" | "MATCHES" | "IN";
```

**VMwareExpressionConjunctionOperatorTypes**
```typescript
type VMwareExpressionConjunctionOperatorTypes = "AND" | "OR";
```

**VMwareExpressionKeyTypes**
```typescript
type VMwareExpressionKeyTypes = 
  | "Tag" | "Name" | "OSName" | "ComputerName" | "NodeType"
  | "GroupType" | "ALL" | "IPAddress" | "PodCidr";
```

**VMwareRealizationStates**
```typescript
type VMwareRealizationStates = "IN_PROGRESS" | "SUCCESS" | "FAILURE";
```

**VMwareProtectionStatuses**
```typescript
type VMwareProtectionStatuses = 
  | "PROTECTED" | "NOT_PROTECTED" | "REQUIRE_OVERRIDE" | "UNKNOWN";
```

**VMwareNSXVirtualMachinePowerStates**
```typescript
type VMwareNSXVirtualMachinePowerStates = 
  | "VM_RUNNING" | "VM_STOPPED" | "VM_SUSPENDED" | "UNKNOWN";
```

**VMwareNSXVirtualMachineTypes**
```typescript
type VMwareNSXVirtualMachineTypes = 
  | "BFMS" | "EXTERNAL" | "REGULAR" | "EDGE" | "SVM";
```

**VMwareNSXScopeTypes**
```typescript
type VMwareNSXScopeTypes = "CONTAINER_CLUSTER" | "VPC";
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

- [VMware NSX 3.0+ Policy API Documentation](https://code.vmware.com/apis/1083/nsx)
- [VMware NSX Administration Guide](https://docs.vmware.com/en/VMware-NSX/index.html)
- [NSX Kubernetes Integration](https://docs.vmware.com/en/VMware-NSX/index.html)
- [Main Zeniki Documentation](../../../../README.md)