# ROR v1 Driver

Driver for ROR (Register of Resources) v1 API interactions. Provides access to
Norwegian Health Network cluster management and resource registry operations.

## Features

- Cluster control plane metadata retrieval
- Type-safe API interactions
- API key authentication support
- Query parameter filtering
- Native fetch API integration

## Basic Usage

```typescript
import { RORv1Driver } from "@norskhelsenett/zeniki";

const ror = new RORv1Driver({
  baseURL: "https://ror.company.com/api/v1",
  headers: {
    "x-api-key": "your-api-key",
    "Content-Type": "application/json",
  },
});

// Get all cluster control plane metadata
const metadata = await ror.getControlplanesMetadata();

console.log(`Found ${metadata.length} clusters`);
```

## Advanced Usage

```typescript
import {
  RORClusterControlPlaneMetaData,
  RORv1Driver,
} from "@norskhelsenett/zeniki";

const ror = new RORv1Driver({
  baseURL: "https://ror.company.com/api/v1",
  headers: {
    "x-api-key": "your-api-key",
    "Content-Type": "application/json",
  },
});

// Get metadata with query parameters
const metadata = await ror.getControlplanesMetadata({
  datacenter: "oslo",
  environment: "production",
});

// Process cluster information
metadata.forEach((cluster: RORClusterControlPlaneMetaData) => {
  console.log(`Cluster: ${cluster.cluster_name}`);
  console.log(`Datacenter: ${cluster.datacenter?.name}`);

  cluster.ip_addresses?.forEach((ip) => {
    console.log(`  IP: ${ip.vip} (${ip.type})`);
  });
});
```

## Required Headers

The driver uses native fetch API and accepts standard `RequestInit`
configuration:

```typescript
const ror = new RORv1Driver({
  baseURL: "https://ror.company.com/api/v1",
  headers: {
    "x-api-key": "your-api-key",
    "Content-Type": "application/json",
    // Optional additional headers
    "Accept": "application/json",
  },
  // Optional fetch configuration
  // Any other fetch RequestInit options
});
```

**Required Headers:**

- `x-api-key` - API authentication key for ROR access

**Recommended Headers:**

- `Content-Type: application/json` - Request content type
- `Accept: application/json` - Response content type

## Methods

### getControlplanesMetadata(params?)

Retrieves all cluster control plane metadata objects with optional query
filtering.

**Parameters:**

- `params` (optional) - Query parameters object or URLSearchParams

**Returns:** `Promise<RORClusterControlPlaneMetaData[]>`

## Types

### RORClusterControlPlaneMetaData

```typescript
interface RORClusterControlPlaneMetaData {
  _id?: string | ObjectId;
  cluster_id: string;
  cluster_name: string;
  workspace_id: string;
  datacenter?: RORClusterControlPlaneMetaDataDatacenter;
  ip_addresses?: RORClusterControlPlaneMetaDataIp[];
}
```

### RORClusterControlPlaneMetaDataDatacenter

```typescript
interface RORClusterControlPlaneMetaDataDatacenter {
  name: string;
  region: string;
  provider: string;
}
```

### RORClusterControlPlaneMetaDataIp

```typescript
interface RORClusterControlPlaneMetaDataIp {
  vip: string;
  type: string;
  datacenter: string;
}
```

## Error Handling

```typescript
import { HTTPError } from "@norskhelsenett/zeniki";

try {
  const metadata = await ror.getControlplanesMetadata();
  console.log("Success:", metadata);
} catch (error) {
  if (error instanceof HTTPError) {
    console.error(`HTTP Error ${error.status}: ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}
```
