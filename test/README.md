# Zeniki Test Suite

This directory contains comprehensive Jest tests for the Zeniki library, including unit and integration tests for the NetBox Driver, FortiOS Driver, and utility functions. The test suite includes **72+ tests across 5 test suites** with comprehensive coverage.

> **⚠️ Note**: Some unit test files still use Axios mocks and need to be updated to use native fetch API mocks. See [TEST_MIGRATION_STATUS.md](./TEST_MIGRATION_STATUS.md) for detailed information about the migration status and how to update test files.

## Test Files

### Core Driver Tests

- **zeniki-core-driver.unit.test.ts**
  - Comprehensive unit tests for the `ZenikiCoreDriver` abstract base class
  - Tests all HTTP methods (GET, POST, PUT, PATCH, DELETE) with type safety
  - Validates HTTP functionality:
    - Native fetch API usage
    - CSRF token extraction from response headers
    - Error handling for 401 Unauthorized and other HTTP errors
  - Covers constructor behavior, configuration handling, and abstract method requirements
  - Uses mocked fetch API for complete isolation from external dependencies

### NetBox Driver Tests

- **netbox-driver.unit.test.ts**
  - Complete unit tests for the `NetboxDriver` class extending `ZenikiCoreDriver`
  - All HTTP requests are fully mocked using Jest with fetch API mocks
  - Covers all main driver methods:
    - `getPrefix()`, `getPrefixes()` - Prefix retrieval operations
    - `getNextAvailablePrefix()` - Available prefix queries
    - `registerNextAvailablePrefix()` - Prefix allocation/creation
    - `getVrf()`, `getVrfs()` - VRF (Virtual Routing and Forwarding) operations
    - `getVlan()`, `getVlans()` - VLAN management operations
    - `getSite()`, `getSites()` - Site management
    - `getTenant()`, `getTenants()` - Tenant operations
    - `getTag()`, `getTags()` - Tag management
    - `getCustomFields()` - Custom field management
    - `getByUrl()` - Generic URL endpoint access
  - Validates correct URL endpoints, parameters, and request payloads
  - Ensures proper error handling and response processing

- **netbox-driver.integration.test.ts**
  - Real-world integration tests against a live NetBox API instance
  - Requires environment configuration in `.env` file:
    - `NETBOX_BASE_URL` - NetBox API base URL (e.g., `https://netbox.example.com/api`)
    - `NETBOX_TOKEN` - Valid NetBox API authentication token
  - Tests actual API communication and response handling
  - **⚠️ Warning:** Integration tests may create/modify data in your NetBox instance

### FortiOS Driver Tests

- **fortios-driver.unit.test.ts** *(planned)*
  - Unit tests for the `FortiOSDriver` class extending `ZenikiCoreDriver`
  - Mocked tests using native fetch API for FortiOS API endpoints including:
    - `getAddress()`, `getAddresses()` - IPv4 address object operations
    - `getAddress6()`, `getAddresses6()` - IPv6 address object operations
    - `addAddress()`, `updateAddress()`, `deleteAddress()` - IPv4 address lifecycle
    - `addAddress6()`, `updateAddress6()`, `deleteAddress6()` - IPv6 address lifecycle
    - `getAddressGroup()`, `getAddressGroups()` - IPv4 address group operations
    - `getAddressGroup6()`, `getAddressGroups6()` - IPv6 address group operations
    - Address group lifecycle management (add, update, delete)
    - `getByUrl()` - Generic FortiOS API endpoint access
  - Validates FortiOS-specific URL patterns, VDOM parameters, and request structures
  - Tests error handling for FortiOS-specific error codes (424, 403, etc.)

- **fortios-driver.integration.test.ts** *(planned)*
  - Integration tests against live FortiGate firewall systems
  - Requires environment configuration:
    - `FORTIOS_BASE_URL` - FortiGate HTTPS URL (e.g., `https://fortigate.company.com`)
    - `FORTIOS_TOKEN` - Valid FortiOS API token or username/password
    - `FORTIOS_VDOM` - Target Virtual Domain (optional, defaults to 'root')
  - Tests real firewall object creation, modification, and deletion
  - **⚠️ Warning:** Integration tests will create/modify firewall objects in your FortiGate

### Utility Function Tests

- **ip-hash.test.ts**
  - Tests for IP address hashing utilities
  - Covers IPv4 and IPv6 address hashing
  - Validates hash consistency and uniqueness
  - Tests various hashing algorithms (MD5, SHA-256)

- **query-builder.test.ts**
  - Tests for NetBox query parameter building utilities
  - Validates URL encoding and parameter serialization
  - Tests both synchronous and asynchronous query builders

All utility tests are now consolidated in the `/test` directory alongside integration and unit tests.

## Environment Setup

### For Integration Tests

Create a `.env` file in the project root with your NetBox and FortiOS configuration:

```env
# NetBox API Configuration
NETBOX_BASE_URL=https://your-netbox.example.com/api
NETBOX_TOKEN=your-netbox-api-token-here

# FortiOS API Configuration
FORTIOS_BASE_URL=https://your-fortigate.example.com
FORTIOS_TOKEN=your-fortios-api-token-here
FORTIOS_VDOM=root
# Alternative: Use username/password instead of token
# FORTIOS_USERNAME=admin
# FORTIOS_PASSWORD=your-password
```

### Dependencies

Ensure you have the required test dependencies installed:

```bash
npm install -D jest @types/jest ts-jest dotenv
```

## Running Tests

### All Tests
```bash
npm test
# Runs all 72+ tests across 5 test suites
```

### Specific Test Suites
```bash
# Core driver tests only (29 tests)
npx jest test/zeniki-core-driver.unit.test.ts

# NetBox Driver tests only
npx jest test/netbox-driver.*.test.ts

# FortiOS Driver tests only (when implemented)
npx jest test/fortios-driver.*.test.ts

# Unit tests only (no integration)
npx jest test/zeniki-core-driver.unit.test.ts test/netbox-driver.unit.test.ts test/fortios-driver.unit.test.ts test/ip-hash.test.ts test/query-builder.test.ts

# Integration tests only (requires .env setup)
npx jest test/netbox-driver.integration.test.ts test/fortios-driver.integration.test.ts

# Watch mode for development
npm run test:watch
```

### Test Coverage
```bash
npx jest --coverage
```

## Writing New Tests

### Unit Tests
- Mock all external dependencies (fetch API, etc.)
- Focus on testing individual function behavior
- Use the existing patterns in `netbox-driver.unit.test.ts`

### Integration Tests
- Test against real API endpoints when possible
- Handle authentication and network errors gracefully
- Be mindful of rate limits and API quotas

### Test Structure
```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup mocks and test data
  });

  it('should describe expected behavior', async () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Documentation References

- [NetboxDriver API Reference](../src/core/tools/netbox/netbox-driver.ts)
- [FortiOSDriver API Reference](../src/core/hardware/fortinet/fortios-driver.ts)
- [NetBox REST API Documentation](https://netbox.readthedocs.io/en/stable/rest-api/)
- [FortiOS REST API Documentation](https://docs.fortinet.com/document/fortigate/7.4.0/rest-api-reference)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [TypeScript Jest Configuration](https://jestjs.io/docs/getting-started#using-typescript)

## Troubleshooting

### Common Issues

1. **Integration tests failing**: Verify your `.env` file contains correct NetBox/FortiOS URLs and tokens
2. **Type errors**: Ensure all NetBox and FortiOS type definitions are up to date
3. **Mock issues**: Check that fetch API mocks are properly configured in unit tests
4. **FortiOS authentication**: Verify API access is enabled and tokens/credentials are valid

### Debug Mode
```bash
# Run tests with verbose output
npx jest --verbose

# Run single test file with debugging
npx jest test/zeniki-core-driver.unit.test.ts --verbose
npx jest test/netbox-driver.unit.test.ts --verbose
```

---

For more details, see the main [Zeniki README](../README.md).
