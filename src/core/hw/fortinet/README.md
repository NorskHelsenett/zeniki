# FortiOS Driver Documentation

The FortiOS driver provides comprehensive integration with Fortinet FortiGate firewalls, offering type-safe, well-documented methods for managing firewall addresses, address groups, and automated security policy configuration. Built for FortiOS 7.4.x with backward compatibility to 6.0.0.

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
  FortiOSDriver,
  FortiOSFirewallAddress,
  FortiOSFirewallAddress6,
  FortiOSFirewallAddrGrp,
  FortiOSFirewallAddrGrp6
} from '@norskhelsenett/zeniki';

// Initialize the FortiOS driver
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  timeout: 30000
});
```

### Basic Operations

```typescript
// Get a specific IPv4 address object
const address = await fortios.getAddress('web-server-1');
console.log(`Address: ${address.results[0].subnet}, Type: ${address.results[0].type}`);

// Get all IPv4 address objects with filtering
const addresses = await fortios.getAddresses({
  filter: 'subnet=@192.168.1.0/24',
  count: 50
});

console.log(`Found ${addresses.count} addresses`);

// Add a new IPv4 address object
const newAddress = await fortios.addAddress({
  name: 'database-server',
  type: 'ipmask',
  subnet: '192.168.100.50/32',
  comment: 'Primary database server'
});

// Create an address group with multiple members
const addressGroup = await fortios.addAddressGroup({
  name: 'web-servers',
  type: 'default',
  member: [
    { name: 'web-server-1' },
    { name: 'web-server-2' },
    { name: 'web-server-3' }
  ],
  comment: 'Production web server cluster'
});
```

## FortiOS Integration Features

The FortiOS driver provides enterprise-grade features for FortiGate firewall management:

### Security Fabric Integration
- **EMS Tag Integration** - Leverage FortiClient EMS tags for dynamic policy creation
- **Zero Trust Network Access (ZTNA)** - Support for ZTNA gateway configurations
- **Global Object Distribution** - Manage objects across Security Fabric members

### Enterprise Automation
- **Multi-VDOM Support** - Complete support for Virtual Domain configurations
- **Compliance Automation** - Automated policy validation and compliance checking
- **Audit Logging** - Comprehensive logging for security and compliance requirements
- **CI/CD Integration** - Pipeline-friendly configuration management

### Advanced Networking
- **IPv4/IPv6 Dual-Stack** - Complete support for both IPv4 and IPv6 configurations
- **Template-Based Addressing** - Support for address templates and dynamic objects
- **Interface Integration** - Associate addresses with specific interfaces and zones

## Driver Configuration

### Constructor

```typescript
new FortiOSDriver(config: RequestConfig)
```

**Parameters:**
- `config` - Request configuration including base URL, headers, and authentication

**Example configurations:**

```typescript
// Basic configuration with API token
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Configuration with username/password authentication
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  auth: {
    username: 'admin',
    password: 'password'
  },
  timeout: 30000
});

// Configuration with VDOM specification
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  params: {
    vdom: 'production'  // Target specific VDOM
  }
});
```

## API Methods

The FortiOS driver provides comprehensive CRUD operations for firewall objects:

- **IPv4 Address Management** - Complete lifecycle management for IPv4 address objects
- **IPv6 Address Management** - Full support for IPv6 address objects and configurations
- **IPv4 Address Groups** - Group management with up to 600 members per group
- **IPv6 Address Groups** - IPv6 group management with enterprise scalability
- **Generic URL Access** - Direct access to any FortiOS API endpoint

### IPv4 Address Management

#### `getAddress(name, params?)`

Retrieves a specific IPv4 address object by name.

```typescript
async getAddress(
  name: string,
  params?: FortiOSParams
): Promise<FortiOSResponse<FortiOSFirewallAddress>>>
```

**Examples:**

```typescript
// Get address object by name
const response = await fortios.getAddress('web-server-1');
if (response && response.results && response.results.length > 0) {
  const address = response.results[0];
  console.log(`Address: ${address.name}, Subnet: ${address.subnet}`);
}

// Get address with specific VDOM
const response = await fortios.getAddress('web-server-1', {
  vdom: 'production'
});

// Get address with metadata
const response = await fortios.getAddress('web-server-1', {
  with_meta: true
});
```

#### `getAddresses(params?)`

Retrieves a paginated list of IPv4 address objects with optional filtering.

```typescript
async getAddresses(
  params?: FortiOSParams
): Promise<FortiOSResponse<FortiOSFirewallAddress>>>
```

**Examples:**

```typescript
// Get all IPv4 addresses
const response = await fortios.getAddresses();
if (response && response.results) {
  const addresses = response.results;
}

// Get addresses with filtering
const response = await fortios.getAddresses({
  filter: 'subnet=@192.168.1.0/24',
  count: 100
});

// Search addresses by name pattern
const response = await fortios.getAddresses({
  filter: 'name=@web-*',
  sortby: 'name'
});

// Get addresses with pagination
const response = await fortios.getAddresses({
  start: 0,
  count: 50
});
```

#### `addAddress(address, params?)`

Creates a new IPv4 address object.

```typescript
async addAddress(
  address: FortiOSFirewallAddress,
  params?: FortiOSParams
): Promise<FortiOSResponse<FortiOSFirewallAddress>>>
```

**Examples:**

```typescript
// Example 1: Using string literals (quick prototyping)
const webServer = await fortios.addAddress({
  name: 'web-server-1',
  type: 'ipmask',
  subnet: '192.168.100.10/32',
  comment: 'Primary web server'
});

// Example 2: Using type-safe enums (production recommended)
const databaseServer = await fortios.addAddress({
  name: 'database-server',
  type: FortiOSFirewallAddressType.IP_Mask,
  subnet: '192.168.100.50 255.255.255.0',
  comment: 'Primary database server',
  'allow-routing': CommonEnableDisable.Enable
});
```

#### `deleteAddress(name, params?)`

Deletes an IPv4 address object by name.

```typescript
async deleteAddress(
  name: string,
  params?: FortiOSParams
): Promise<FortiOSResponse<FortiOSFirewallAddress>>>
```

#### `updateAddress(name, address, params?)`

Updates an existing IPv4 address object.

```typescript
async updateAddress(
  name: string,
  address: Partial<FortiOSFirewallAddress>,
  params?: FortiOSParams
): Promise<FortiOSResponse<FortiOSFirewallAddress>>>
```

**Examples:**

```typescript
// Example 1: Using string literals (quick update)
const updated = await fortios.updateAddress('web-server-1', {
  subnet: '192.168.1.101/32',
  comment: 'Updated IP address for web server'
});

// Example 2: Using type-safe enums and interfaces
const secureUpdate = await fortios.updateAddress('database-server', {
  type: FortiOSFirewallAddressType.IP_Mask,
  subnet: '192.168.100.60 255.255.255.0',
  'allow-routing': CommonEnableDisable.Disable,
  'fabric-object': CommonEnableDisable.Enable,
  comment: 'Secured database server with fabric sync'
});
```

### IPv6 Address Management

The IPv6 address management methods follow the same patterns as IPv4:

#### `getAddress6(name, params?)` / `getAddresses6(params?)`

Retrieve IPv6 address objects with full dual-stack support.

#### `addAddress6(address, params?)`

Create IPv6 address objects with enhanced addressing capabilities.

```typescript
// Create an IPv6 subnet address
const ipv6Address = await fortios.addAddress6({
  name: 'ipv6-server',
  type: 'ipprefix',
  ip6: '2001:db8::/128',
  comment: 'IPv6 server address'
});

// Create an IPv6 range
const ipv6Range = await fortios.addAddress6({
  name: 'ipv6-dhcp-range',
  type: 'iprange',
  'start-ip': '2001:db8::100',
  'end-ip': '2001:db8::200',
  comment: 'IPv6 DHCP range'
});
```

### Address Group Management

#### `getAddressGroup(name, params?)` / `getAddressGroups(params?)`

Retrieve IPv4 address groups with member information.

#### `addAddressGroup(group, params?)`

Create IPv4 address groups with multiple members.

```typescript
async addAddressGroup(
  group: FortiOSFirewallAddrGrp,
  params?: FortiOSParams
): Promise<FortiOSResponse<FortiOSFirewallAddrGrp>>>
```

**Examples:**

```typescript
// Example 1: Using string literals (simple group)
const webServers = await fortios.addAddressGroup({
  name: 'web-servers',
  type: 'default',
  member: [
    { name: 'web-server-1' },
    { name: 'web-server-2' },
    { name: 'web-server-3' }
  ],
  comment: 'Production web server cluster'
});

// Example 2: Using enums and advanced features
const secureGroup = await fortios.addAddressGroup({
  name: 'dmz-servers',
  type: 'default',
  member: [
    { name: 'dmz-web' },
    { name: 'dmz-app' }
  ],
  'fabric-object': CommonEnableDisable.Enable,
  'allow-routing': CommonEnableDisable.Enable,
  comment: 'DMZ server group with fabric sync'
});
```

#### IPv6 Address Groups

IPv6 address groups support the same functionality with `getAddressGroup6`, `addAddressGroup6`, etc.

### Generic API Access

#### `getByUrl<T>(url, params?)`

Access any FortiOS API endpoint directly.

```typescript
async getByUrl<T>(
  url: string,
  params?: FortiOSParams
): Promise<T>>
```

**Examples:**

```typescript
// Access firewall policies
const policies = await fortios.getByUrl<FortiOSResponse<any>>(
  '/api/v2/cmdb/firewall/policy'
);

// Get system status
const status = await fortios.getByUrl<any>(
  '/api/v2/monitor/system/status'
);

// Access specific VDOM configuration
const vdomConfig = await fortios.getByUrl<any>(
  '/api/v2/cmdb/system/vdom',
  { vdom: 'production' }
);
```

## Advanced Usage

### Multi-VDOM Operations

FortiOS driver supports Virtual Domain (VDOM) operations for enterprise deployments:

```typescript
// Target specific VDOM for all operations
const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: { 'Authorization': 'Bearer token' },
  params: { vdom: 'production' }  // Global VDOM setting
});

// Override VDOM for specific operations
const devAddresses = await fortios.getAddresses({
  vdom: 'development',  // Override global VDOM
  count: 100
});
```

### Security Fabric Integration

```typescript
// Create fabric objects that sync across Security Fabric
const fabricAddress = await fortios.addAddress({
  name: 'global-dns-server',
  type: 'ipmask',
  subnet: '8.8.8.8/32',
  'fabric-object': 'enable',  // Sync across fabric members
  comment: 'Global DNS server - fabric distributed'
});

// Create EMS tag-based dynamic addressing
const emsTaggedGroup = await fortios.addAddressGroup({
  name: 'ems-tagged-devices',
  type: 'folder',
  'fabric-object': 'enable',
  'tag-detection': 'enable',
  'tag-type': 'ems',
  comment: 'Devices tagged by FortiClient EMS'
});
```

### Bulk Operations

```typescript
// Bulk address creation for network segments
async function createNetworkSegments() {
  const segments = [
    { name: 'users', subnet: '192.168.10.0/24' },
    { name: 'servers', subnet: '192.168.20.0/24' },
    { name: 'guest', subnet: '192.168.30.0/24' },
    { name: 'iot', subnet: '192.168.40.0/24' }
  ];

  const createdAddresses = [];
  for (const segment of segments) {
    const address = await fortios.addAddress({
      name: `network-${segment.name}`,
      type: 'ipmask',
      subnet: segment.subnet,
      comment: `${segment.name} network segment`
    });
    createdAddresses.push(address.data);
  }

  // Create umbrella group for all segments
  const allNetworks = await fortios.addAddressGroup({
    name: 'all-internal-networks',
    type: 'default',
    member: createdAddresses.map(addr => ({ name: addr.results[0].name })),
    comment: 'All internal network segments'
  });

  return allNetworks;
}
```

### Error Handling and Validation

```typescript
import { HTTPError } from '@norskhelsenett/zeniki';

try {
  const address = await fortios.addAddress({
    name: 'test-server',
    type: 'ipmask',
    subnet: '192.168.1.100/32'
  });
} catch (error) {
  if (error instanceof HTTPError) {
    if (error.code === 424) {
      console.log('Object already exists or dependency failed');
    } else if (error.code === 403) {
      console.log('Insufficient permissions or read-only mode');
    } else {
      console.log(`FortiOS API error: ${error.code}`);
      console.log(`Error details: ${error.message}`);
    }
  }
}
```

### Configuration Backup and Restore

```typescript
// Export current address configuration
async function backupAddressConfiguration() {
  const addresses = await fortios.getAddresses({ count: 1000 });
  const groups = await fortios.getAddressGroups({ count: 1000 });
  
  const backup = {
    timestamp: new Date().toISOString(),
    addresses: addresses.results,
    groups: groups.results
  };
  
  return backup;
}

// Restore configuration from backup
async function restoreAddressConfiguration(backup: any) {
  // Restore addresses first (dependencies)
  for (const address of backup.addresses) {
    try {
      await fortios.addAddress(address);
    } catch (error) {
      console.log(`Failed to restore address ${address.name}:`, error);
    }
  }
  
  // Restore groups second
  for (const group of backup.groups) {
    try {
      await fortios.addAddressGroup(group);
    } catch (error) {
      console.log(`Failed to restore group ${group.name}:`, error);
    }
  }
}
```

## Examples

### Complete Address Object CRUD Operations

```typescript
import { 
  FortiOSDriver,
  FortiOSFirewallAddressType,
  CommonEnableDisable 
} from '@norskhelsenett/zeniki';

const fortios = new FortiOSDriver({
  baseURL: 'https://fortigate.company.com',
  headers: { 'Authorization': 'Bearer token' }
});

async function manageAddressObjects() {
  // CREATE: Add new address object
  const webServers = await fortios.addAddress({
    name: 'web-servers',
    type: FortiOSFirewallAddressType.IP_Mask,
    subnet: '192.168.10.0 255.255.255.0',
    comment: 'Web server network segment',
    'allow-routing': CommonEnableDisable.Enable
  });

  // READ: Get the created address object
  const retrievedAddress = await fortios.getAddress('web-servers');
  console.log(`Address: ${retrievedAddress.results.subnet}`);

  // UPDATE: Modify the address object
  const updatedAddress = await fortios.updateAddress('web-servers', {
    name: 'web-servers',
    type: FortiOSFirewallAddressType.IP_Mask,
    subnet: '192.168.10.0 255.255.255.0',
    comment: 'Updated web server network segment',
    'allow-routing': CommonEnableDisable.Enable
  });

  // DELETE: Remove the address object
  await fortios.deleteAddress('web-servers');
}
```
  });

  const clientGroup = await fortios.addAddressGroup({
    name: 'client-networks',
    type: 'default', 
    member: [{ name: 'user-network' }],
    comment: 'Client access networks'
  });

  // 3. Create external service addresses
  const externalApi = await fortios.addAddress({
    name: 'external-payment-api',
    type: 'fqdn',
    fqdn: 'api.payment-processor.com',
    comment: 'External payment processing API'
  });

  // 4. Create comprehensive network groups
  const allInternal = await fortios.addAddressGroup({
    name: 'all-internal-networks',
    type: 'default',
    member: [
      { name: 'frontend-tier' },
      { name: 'backend-tier' },
      { name: 'client-networks' }
    ],
    comment: 'All internal network segments'
  });

  return {
    addresses: [webServers, databases, users, externalApi],
    groups: [frontendGroup, backendGroup, clientGroup, allInternal]
  };
}
```

### IPv6 Dual-Stack Configuration

```typescript
async function setupDualStackNetwork() {
  // IPv4 configuration
  const ipv4Network = await fortios.addAddress({
    name: 'dual-stack-ipv4',
    type: 'ipmask',
    subnet: '192.168.50.0/24',
    comment: 'IPv4 side of dual-stack network'
  });

  // IPv6 configuration
  const ipv6Network = await fortios.addAddress6({
    name: 'dual-stack-ipv6',
    type: 'ipprefix',
    ip6: '2001:db8:50::/64',
    comment: 'IPv6 side of dual-stack network'
  });

  // Create dual-stack groups
  const ipv4Group = await fortios.addAddressGroup({
    name: 'dual-stack-ipv4-group',
    type: 'default',
    member: [{ name: 'dual-stack-ipv4' }],
    comment: 'IPv4 dual-stack addresses'
  });

  const ipv6Group = await fortios.addAddressGroup6({
    name: 'dual-stack-ipv6-group', 
    type: 'default',
    member: [{ name: 'dual-stack-ipv6' }],
    comment: 'IPv6 dual-stack addresses'
  });

  return {
    ipv4: { address: ipv4Network, group: ipv4Group },
    ipv6: { address: ipv6Network, group: ipv6Group }
  };
}
```

### Enterprise Compliance and Auditing

```typescript
async function generateComplianceReport() {
  // Get all address objects for compliance review
  const allAddresses = await fortios.getAddresses({ count: 1000 });
  const allGroups = await fortios.getAddressGroups({ count: 1000 });

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalAddresses: allAddresses.count,
      totalGroups: allGroups.count
    },
    findings: {
      uncommentedObjects: [],
      fabricObjects: [],
      dynamicObjects: []
    }
  };

  // Analyze addresses for compliance
  for (const address of allAddresses.results) {
    if (!address.comment || address.comment.trim() === '') {
      report.findings.uncommentedObjects.push({
        type: 'address',
        name: address.name,
        issue: 'Missing comment/description'
      });
    }

    if (address['fabric-object'] === 'enable') {
      report.findings.fabricObjects.push({
        type: 'address',
        name: address.name,
        feature: 'Security Fabric distribution enabled'
      });
    }
  }

  // Analyze groups for compliance
  for (const group of allGroups.results) {
    if (!group.comment || group.comment.trim() === '') {
      report.findings.uncommentedObjects.push({
        type: 'group',
        name: group.name,
        issue: 'Missing comment/description'
      });
    }

    if (group.type === 'folder') {
      report.findings.dynamicObjects.push({
        type: 'group',
        name: group.name,
        feature: 'Dynamic group membership'
      });
    }
  }

  return report;
}
```

## Type Definitions

The FortiOS driver provides comprehensive TypeScript type definitions for all FortiOS API objects and responses.

### FortiOSFirewallAddress

IPv4 firewall address object supporting multiple address types:

```typescript
interface FortiOSFirewallAddress {
  name: string;                    // Unique address object name
  type: string;                    // Address type: 'ipmask', 'iprange', 'fqdn', 'geography', etc.
  subnet?: string;                 // IP subnet in CIDR notation (for ipmask type)
  'start-ip'?: string;            // Start IP for range type
  'end-ip'?: string;              // End IP for range type  
  fqdn?: string;                  // Fully qualified domain name (for fqdn type)
  country?: string;               // Country code (for geography type)
  interface?: string;             // Interface name (for interface-subnet type)
  comment?: string;               // Optional description
  'fabric-object'?: string;       // Enable/disable Security Fabric distribution
  'tag-detection'?: string;       // Enable/disable EMS tag detection
  'tag-type'?: string;           // Tag type: 'ems', 'dynamic'
  // ... and many more properties for advanced features
}
```

### FortiOSFirewallAddress6

IPv6 firewall address object with enhanced IPv6 capabilities:

```typescript
interface FortiOSFirewallAddress6 {
  name: string;                    // Unique address object name
  type: string;                    // Address type: 'ipprefix', 'iprange', 'fqdn', etc.
  ip6?: string;                   // IPv6 address/prefix
  'start-ip'?: string;            // Start IPv6 for range
  'end-ip'?: string;              // End IPv6 for range
  fqdn?: string;                  // FQDN for IPv6 resolution
  comment?: string;               // Optional description
  'fabric-object'?: string;       // Security Fabric distribution
  // ... additional IPv6-specific properties
}
```

### FortiOSFirewallAddrGrp

IPv4 address group supporting up to 600 members:

```typescript
interface FortiOSFirewallAddrGrp {
  name: string;                    // Unique group name
  type: string;                    // Group type: 'default', 'folder'
  member: Array<{                 // Group members (up to 600)
    name: string;                 // Member address object name
  }>;
  comment?: string;               // Optional description
  'fabric-object'?: string;       // Security Fabric distribution
  exclude?: string;               // Enable/disable exclusion logic
  'exclude-member'?: Array<{      // Excluded members
    name: string;
  }>;
  // ... additional group management properties
}
```

### FortiOSFirewallAddrGrp6

IPv6 address group with same capabilities as IPv4 groups:

```typescript
interface FortiOSFirewallAddrGrp6 {
  name: string;                    // Unique group name
  type: string;                    // Group type: 'default', 'folder'
  member: Array<{                 // IPv6 group members
    name: string;                 // Member IPv6 address object name
  }>;
  comment?: string;               // Optional description
  'fabric-object'?: string;       // Security Fabric distribution
  // ... IPv6-specific group properties
}
```

### FortiOSParams

Query parameters for FortiOS API requests:

```typescript
interface FortiOSParams {
  vdom?: string;                  // Target Virtual Domain
  filter?: string;                // Filter expression
  count?: number;                 // Maximum results to return
  start?: number;                 // Starting index for pagination
  sortby?: string;                // Sort field
  with_meta?: boolean;            // Include metadata in response
  // ... additional query parameters
}
```

### FortiOSResponse

Generic FortiOS API response wrapper:

```typescript
interface FortiOSResponse<T> {
  http_method: string;            // HTTP method used
  results: T[];                   // Array of result objects
  vdom: string;                   // Virtual Domain
  path: string;                   // API path
  name: string;                   // Object name
  status: string;                 // Response status
  http_status: number;            // HTTP status code
  serial: string;                 // Device serial number
  version: string;                // FortiOS version
  build: number;                  // FortiOS build number
  count?: number;                 // Total result count
  // ... additional response metadata
}
```

## See Also

- [FortiOS 7.4.x REST API Reference](https://docs.fortinet.com/document/fortigate/7.4.0/rest-api-reference)
- [FortiOS Administration Guide](https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide)
- [Security Fabric Documentation](https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/154688/security-fabric)
- [Main Zeniki Documentation](../../../../README.md)