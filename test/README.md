# Zeniki Test Suite

Comprehensive unit tests for the @norskhelsenett/zeniki network automation package using Jest with TypeScript.

## Test Setup

Tests use Jest with `ts-jest` for TypeScript support. Global configuration is in `jest.config.js` with environment setup in `test/setup.ts`.

```bash
# Run all tests
npm test

# Run specific test file
npm test netbox-driver
npm test nam-v2-driver
npm test query-builder
npm test ip-hash

# Run with coverage
npm test -- --coverage
```

## Test Files

### `netbox-driver.test.ts`
Tests NetBox API driver prefix methods with mocked native fetch API.

**Coverage:**
- `getPrefix` - Single prefix retrieval with query parameters
- `getPrefixes` - Paginated lists with filtering and pagination following
- `getNextAvailablePrefix` - Available subnet suggestions
- `registerNextAvailablePrefix` - Automated prefix allocation
- `addPrefix` - Create IPv4/IPv6 prefixes
- `updatePrefix` - Update existing prefixes with PUT

**Features:**
- Native fetch API mocking with jest.fn()
- NHN custom field enums (domain, environment, infrastructure, purpose)
- HTTPError exception handling
- Type-safe NetboxParams and NetboxPrefix usage

**Tests:** 15 passing

### `nam-v2-driver.test.ts`
Tests NAM v2 API driver for NetBox integrators and API endpoints with mocked fetch.

**Coverage:**
- NetBox Integrator CRUD (get, list, add, patch, update, delete)
- API Endpoint CRUD operations
- Custom URL operations with pagination
- Query parameter handling (NAMParams, URLSearchParams)
- Error handling with HTTPError

**Features:**
- MongoDB ObjectId support (_id fields)
- NAMResponse pagination structure (count, results)
- NAMAPIEndpoint validation (vendor, type, url, key)
- Absolute and relative URL handling

**Tests:** 26 passing

### `query-builder.test.ts`
Tests query string builder utilities with object and URLSearchParams inputs.

**Coverage:**
- `queryBuilder` - Async query string builder
- `queryBuilderSync` - Synchronous query string builder
- Object input handling
- URLSearchParams input handling
- Special character encoding
- NetBox-style filter parameters

**Features:**
- URL encoding (spaces, special chars, CIDR notation)
- Complex filter support (description__icontains, created__gte)
- Empty/null/undefined input handling
- Multi-value parameter support
- Identical output validation between async/sync versions

**Tests:** 42 passing

### `ip-hash.test.ts`
Tests IP address hashing utilities for device naming and unique identifiers.

**Coverage:**
- IPv4 and IPv6 hash generation
- MD5 and SHA-256 algorithm support
- Hash consistency and uniqueness
- Edge case IP addresses (localhost, broadcast, private ranges)
- Performance validation

**Features:**
- Cryptographic hashing with md5/sha256
- Consistent output for same input
- Different hashes for different IPs
- Real-world device naming scenarios
- Error handling for invalid inputs

**Tests:** 18 passing

## Mock Configuration

All tests use native fetch API mocking:

```typescript
global.fetch = jest.fn();

mockFetch.mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => mockData,
  headers: new Headers({ 'content-type': 'application/json' })
});
```

## Custom Field Types

Tests use NHN organizational enums for NetBox custom fields:

- **Environment:** `NHN_CommonNetboxExtraChoicesEnvironment` (dev, qa, test, prod, mgmt, lab)
- **Infrastructure:** `NHN_CommonNetboxExtraChoicesInfrastructure` (bck, cert, mgmt, prod, test)
- **Purpose:** `NHN_CommonNetboxExtraChoicesPurpose` (service, devops, mgmt, archive, etc.)

## Test Patterns

### Error Handling
Tests expect `HTTPError` throws rather than undefined returns:

```typescript
await expect(driver.getPrefix(9999)).rejects.toThrow('Not Found');
```

### Type Safety
All tests use strict TypeScript types with proper interfaces:

```typescript
const params: NetboxParams = { q: 'search', limit: 25 };
const mockPrefix: NetboxPrefix = { prefix: '192.168.1.0/24', status: 'active' };
```

### Mocked Responses
Response mocks include all required properties:

```typescript
{
  ok: true,
  status: 200,
  statusText: 'OK',
  json: async () => mockData,
  headers: new Headers()
}
```

## Running Tests

Tests are configured to:
- Run in Node test environment
- Use 10-second timeout per test
- Clear mocks between tests
- Support TypeScript with ts-jest
- Generate coverage reports in `/coverage`

## Total Coverage

**101 tests passing** across 4 test suites covering core utilities, API drivers, and network automation functions.
