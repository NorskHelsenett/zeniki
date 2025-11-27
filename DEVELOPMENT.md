# Development Guide

Guidelines for developing and contributing to the Zeniki project.

## Building

### Install Dependencies

```bash
npm install
```

### Build the Library

```bash
# Compile TypeScript to JavaScript
npm run build

# Create distributable package
npm pack
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test netbox-driver
npm test nam-v2-driver
npm test query-builder
npm test ip-hash

# Run with coverage
npm test -- --coverage
```

## Project Structure

```
zeniki/
├── src/
│   ├── core/                 # Core functionality
│   │   ├── base/            # Base classes (ZenikiCoreDriver)
│   │   ├── hw/              # Hardware drivers
│   │   │   ├── fortinet/    # FortiOS driver with sub-drivers
│   │   │   │   ├── fortios-driver.ts
│   │   │   │   ├── addresses/          # IPv4 address sub-driver
│   │   │   │   ├── address6/           # IPv6 address sub-driver
│   │   │   │   ├── addrgrp/            # IPv4 group sub-driver
│   │   │   │   ├── addrgrp6/           # IPv6 group sub-driver
│   │   │   │   └── vdoms/              # VDOM sub-driver
│   │   │   └── vmware/      # VMware NSX driver with sub-drivers
│   │   │       ├── vmware-nsx-driver.ts
│   │   │       └── groups/             # Security group sub-driver
│   │   ├── tools/           # API tool drivers
│   │   │   ├── netbox/      # NetBox driver with sub-drivers
│   │   │   │   ├── netbox-driver.ts
│   │   │   │   ├── ipam/               # IPAM sub-drivers (prefixes, vrfs, vlans)
│   │   │   │   ├── dcim/               # DCIM sub-drivers (devices, sites)
│   │   │   │   ├── tenancy/            # Tenancy sub-drivers (tenants)
│   │   │   │   └── extras/             # Extras sub-drivers (tags, custom fields)
│   │   │   └── nhn/         # NHN-specific tools
│   │   │       └── nam-v2/  # NAM v2 driver with sub-drivers
│   │   │           ├── nam-v2-driver.ts
│   │   │           ├── vendors/        # Integrator sub-drivers
│   │   │           │   ├── nam-netbox-integrators-sub_driver.ts
│   │   │           │   └── nam-ror-integrators-sub_driver.ts
│   │   │           └── settings/       # Settings sub-drivers
│   │   │               └── nam-api-endpoints-sub_driver.ts
│   │   ├── loggers/         # Logging utilities
│   │   │   └── winston-hec-logger.ts
│   │   └── utils/           # Utility functions
│   │       ├── env-loader.ts
│   │       ├── query-builder.ts
│   │       └── ip-to-hash.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── common/          # Common types
│   │   ├── hw/              # Hardware types
│   │   ├── tools/           # Tool types
│   │   └── utils/           # Utility types
│   └── index.ts             # Main entry point
├── test/                     # Unit tests
│   ├── setup.ts             # Jest configuration
│   ├── netbox-driver.test.ts
│   ├── nam-v2-driver.test.ts
│   ├── query-builder.test.ts
│   └── ip-hash.test.ts
├── playground/              # Manual testing scripts
│   └── test_driver.ts
├── config/                  # Configuration files
│   └── config.yaml.example
├── secrets/                 # Secret files (gitignored)
│   └── secrets.yaml
└── examples/                # Example configurations
    ├── config.yaml.example
    └── secrets.yaml.example
```

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone repository
git clone https://github.com/NorskHelsenett/zeniki.git
cd zeniki

# Install dependencies
npm install

# Copy example configuration files
cp examples/config.yaml.example config/config.yaml
cp examples/secrets.yaml.example secrets/secrets.yaml

# Edit configuration with your values
```

### 2. Make Changes

- Create a feature branch: `git checkout -b feature/amazing-feature`
- Make your changes in `src/` directory
- Add/update types in `types/` as needed
- Update JSDoc comments for public APIs
- Add unit tests in `test/` directory

#### Implementing a New Driver

Follow the sub-driver architecture pattern used by NetBox driver:

**1. Create Main Driver Class** (extends `ZenikiCoreDriver`)
```typescript
// src/core/tools/myapi/myapi-driver.ts
export class MyApiDriver extends ZenikiCoreDriver {
  public resources: MyApiResourcesSubDriver;
  
  constructor(config: RequestConfig) {
    super(config);
    this.resources = new MyApiResourcesSubDriver(config);
  }
  
  // Generic methods for custom endpoints
  async getByUrl<T>(url: string, params?: any): Promise<T> { }
  async getPaginatedByUrl<T>(url: string, params?: any, follow?: boolean): Promise<T> { }
}
```

**2. Create Sub-Drivers** (one per resource type)
```typescript
// src/core/tools/myapi/resources/myapi-resources-sub_driver.ts
export class MyApiResourcesSubDriver extends ZenikiCoreDriver {
  async getResource(id: number, params?: any): Promise<Resource> { }
  async getResources(params?: any, follow?: boolean): Promise<PaginatedResponse<Resource>> { }
  async addResource(data: Resource, id?: number): Promise<Resource> { }
  async patchResource(updates: Partial<Resource>, id: number): Promise<Resource> { }
  async deleteResourceById(id: number, params?: any): Promise<void> { }
}
```

**3. Define Types**
```typescript
// src/types/tools/myapi/resource.ts
export interface Resource {
  id?: number;
  name: string;
  description?: string;
  // ... other properties
}

export interface MyApiParams {
  limit?: number;
  offset?: number;
  // ... other query parameters
}
```

**4. Export from Index**
```typescript
// src/index.ts
export { MyApiDriver } from './core/tools/myapi/myapi-driver';
export type { Resource, MyApiParams } from './types/tools/myapi';
```

**Example: NetBox Driver Structure**
```typescript
// Main driver initializes all sub-drivers
export class NetboxDriver extends ZenikiCoreDriver {
  public prefixes: NetboxPrefixesSubDriver;
  public devices: NetboxDevicesSubDriver;
  public vlans: NetboxVlansSubDriver;
  public vrfs: NetboxVrfsSubDriver;
  public tenants: NetboxTenantsSubDriver;
  public tags: NetboxTagsSubDriver;
  public custom_fields: NetboxCustomFieldsSubDriver;
  
  constructor(config: RequestConfig) {
    super(config);
    this.prefixes = new NetboxPrefixesSubDriver(config);
    this.devices = new NetboxDevicesSubDriver(config);
    // ... initialize other sub-drivers
  }
}

// Usage pattern
const netbox = new NetboxDriver({ baseURL, headers });
await netbox.prefixes.addPrefix({ prefix: '10.0.0.0/24' });
await netbox.devices.getDevices({ site: 1 });
```

#### Complete Implementation Example

**Main Driver Implementation** (`src/core/tools/netbox/netbox-driver.ts`)
```typescript
import { ZenikiCoreDriver, RequestConfig, ResponseGeneric } from "../../base/zeniki-core-driver";
import { NetboxPrefixesSubDriver } from "./ipam/netbox-prefixes-sub_driver";
import { NetboxParams } from "../../../types/tools/netbox/shared/netbox-params";
import { HTTPError } from "../../../types";
import { queryBuilderSync } from "../../utils";

/**
 * NetBox API driver providing type-safe interface for NetBox REST API.
 * Manages IPAM, DCIM, Tenancy, and Extras through specialized sub-drivers.
 * Supports flexible type system, pagination, and generic endpoint access.
 *
 * @example
 * ```typescript
 * const netbox = new NetboxDriver({
 *   baseURL: 'https://netbox.example.com/api',
 *   headers: { 'Authorization': 'Token your-token' }
 * });
 * ```
 */
export class NetboxDriver extends ZenikiCoreDriver {
  public prefixes: NetboxPrefixesSubDriver;
  public devices: NetboxDevicesSubDriver;
  // ... other sub-drivers

  constructor(config: RequestConfig) {
    super(config);
    this.prefixes = new NetboxPrefixesSubDriver(config);
    this.devices = new NetboxDevicesSubDriver(config);
    // ... initialize other sub-drivers
  }

  // Generic method for custom endpoints
  async getByUrl<T>(url: string, params?: NetboxParams): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : this.config.baseURL + url;
    const response = await this.get<T>(
      fullUrl + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Generic paginated method
  async getPaginatedByUrl<T>(url: string, params?: NetboxParams, follow = false): Promise<T> {
    if (follow) {
      const response = await this.next<T>(url, params);
      return await response.json();
    }

    const fullUrl = url.startsWith("http") ? url : this.config.baseURL + url;
    const response = await this.get<T>(
      fullUrl + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Protected pagination helper
  protected async next<T>(path: string, params?: any): Promise<ResponseGeneric<T>> {
    let tmp: any[] = [];
    let res = await this.get<any>(
      this.config.baseURL + path + queryBuilderSync(params),
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    tmp = data.results || [];

    while (data.next) {
      res = await this.get<any>(data.next, { ...this.config, method: "GET" });
      data = await res.json();
      if (data.results && data.results.length > 0) {
        tmp = tmp.concat(data.results);
      }
    }

    return {
      ...res,
      json: async () => ({ ...data, results: tmp, count: tmp.length })
    } as ResponseGeneric<T>;
  }
}
```

**Sub-Driver Implementation** (`src/core/tools/netbox/ipam/netbox-prefixes-sub_driver.ts`)
```typescript
import { ZenikiCoreDriver, RequestConfig, ResponseGeneric } from "../../../base/zeniki-core-driver";
import { NetboxPrefix, NetboxPaginated, NetboxParams, HTTPError } from "../../../../types";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox Prefixes Sub-Driver for managing IPAM Prefixes.
 * Provides methods to retrieve, create, update, and delete IP prefixes.
 *
 * @example
 * ```typescript
 * const prefixes = await netbox.prefixes.getPrefixes({ status: 'active' });
 * ```
 */
export class NetboxPrefixesSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  // Get single resource
  async getPrefix(id: number, params?: NetboxParams): Promise<NetboxPrefix> {
    const response = await this.get<NetboxPrefix>(
      this.config.baseURL + `/ipam/prefixes/${id}/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Get paginated list
  async getPrefixes(params?: NetboxParams, follow = false): Promise<NetboxPaginated<NetboxPrefix>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxPrefix>>(`/ipam/prefixes/`, params);
      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxPrefix>>(
      this.config.baseURL + `/ipam/prefixes/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Create resource
  async addPrefix(prefix: NetboxPrefix, id?: number): Promise<NetboxPrefix> {
    const response = await this.post<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "POST", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Partial update
  async patchPrefix(prefix: Partial<NetboxPrefix>, id?: number): Promise<NetboxPrefix> {
    const response = await this.patch<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Complete replacement
  async updatePrefix(prefix: NetboxPrefix, id?: number): Promise<NetboxPrefix> {
    const response = await this.put<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "PUT", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Delete by ID
  async deletePrefixById(id: number): Promise<NetboxPrefix> {
    const response = await this.delete<NetboxPrefix>(
      this.config.baseURL + `/ipam/prefixes/${id}/`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  // Protected pagination helper (same as main driver)
  protected async next<T>(path: string, params?: any): Promise<ResponseGeneric<T>> {
    let tmp: any[] = [];
    let res = await this.get<any>(
      this.config.baseURL + path + queryBuilderSync(params),
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    tmp = data.results || [];

    while (data.next) {
      res = await this.get<any>(data.next, { ...this.config, method: "GET" });
      data = await res.json();
      if (data.results && data.results.length > 0) {
        tmp = tmp.concat(data.results);
      }
    }

    return {
      ...res,
      json: async () => ({ ...data, results: tmp, count: tmp.length })
    } as ResponseGeneric<T>;
  }
}
```

**Key Implementation Patterns:**

1. **Extend ZenikiCoreDriver** - All drivers and sub-drivers inherit HTTP methods
2. **Pass RequestConfig** - Configuration flows from main driver to all sub-drivers
3. **Consistent Error Handling** - Use HTTPError for all API failures
4. **Pagination Support** - Implement `next()` helper for automatic result aggregation
5. **Standard CRUD Methods** - Follow naming: `getResource`, `getResources`, `addResource`, `patchResource`, `updateResource`, `deleteResourceById`
6. **Generic Methods** - Main driver provides `getByUrl()` and `getPaginatedByUrl()` for custom endpoints
7. **Type Safety** - Use TypeScript interfaces for all request/response data

### 3. Test Changes

```bash
# Run type checking
npm run build

# Run unit tests
npm test

# Run specific tests
npm test your-test-file

# Manual testing
npx tsx playground/test_driver.ts
```

### 4. Code Quality

- Follow existing code style and patterns
- Ensure TypeScript strict mode compliance
- Add comprehensive JSDoc documentation
- Include examples in documentation
- Update README files as needed

### 5. Submit Changes

```bash
# Commit changes
git add .
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request on GitHub
```

## Testing

### Unit Tests

- Use Jest with ts-jest for TypeScript support
- Mock native fetch API for HTTP operations
- Test all CRUD operations and edge cases
- Aim for high code coverage

See [Test Suite Documentation](test/README.md) for details.

### Manual Testing

- Use playground scripts for manual verification
- Test against real API endpoints
- Validate error handling and edge cases

See [Playground Documentation](playground/README.md) for details.

## TypeScript Configuration

The project uses strict TypeScript configuration:

- Strict mode enabled
- ESNext target with CommonJS modules
- Declaration files generated for types
- Source maps for debugging

## Dependencies

### Runtime Dependencies

- None - Zeniki uses native Node.js/Deno APIs

### Development Dependencies

- TypeScript 5.9+
- Jest with ts-jest
- @types packages for type definitions

## Publishing

Package is published to npm under `@norskhelsenett/zeniki`:

```bash
# Update version in package.json
npm version patch|minor|major

# Build and test
npm run build
npm test

# Publish to npm
npm publish --access public
```

## Code Style

- Use TypeScript strict mode
- Prefer async/await over promises
- Use native fetch API (no axios)
- Follow JSDoc conventions
- Export types alongside implementations
- Use readonly for immutable properties
- Organize drivers with sub-driver architecture for resource separation
- Keep main driver focused on initialization and generic methods
- Place resource-specific operations in dedicated sub-drivers
- Follow consistent CRUD method naming: `getResource`, `getResources`, `addResource`, `patchResource`, `deleteResourceById`

## Documentation

- Update JSDoc for all public APIs
- Include usage examples in comments
- Keep README files up to date
- Document breaking changes in CHANGELOG

## Support

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Pull Requests: Contribute improvements

## License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.
