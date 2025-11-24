# Test Files Migration Status

## Overview
The Zeniki library has been fully migrated from Axios to native fetch API across all drivers, types, and documentation. The test files still use Axios mocks and need to be updated to reflect the new implementation.

## Migration Status

### ✅ Completed
- All driver implementations (NetBox, FortiOS, VMware NSX, NAM v2)
- HTTPError implementation and exports
- All README documentation files
- MEMORY_MANAGEMENT.md
- Zero Axios references remain in production code or documentation

### 🔄 Pending Updates
- `test/zeniki-core-driver.unit.test.ts` - Uses Axios mocks
- `test/netbox-driver.unit.test.ts` - Uses Axios mocks

### ✅ No Changes Needed
- `test/ip-hash.test.ts` - No HTTP client usage
- `test/query-builder.test.ts` - No HTTP client usage
- `test/netbox-driver.integration.test.ts` - Tests against real NetBox instance

## Key Changes Required

### Test Files Need To:

1. **Remove Axios Dependencies**
   ```typescript
   // OLD (Axios)
   import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
   jest.mock('axios');
   
   // NEW (fetch)
   // No imports needed - use global.fetch mock
   ```

2. **Update Mock Structure**
   ```typescript
   // OLD (Axios)
   const mockAxiosInstance = {
     get: jest.fn(),
     post: jest.fn(),
     // ...
   };
   
   axios.create.mockReturnValue(mockAxiosInstance);
   
   // NEW (fetch)
   global.fetch = jest.fn().mockResolvedValue({
     ok: true,
     status: 200,
     statusText: 'OK',
     json: jest.fn().mockResolvedValue(mockData),
     headers: new Headers(),
   } as unknown as Response);
   ```

3. **Understand Driver Return Types**
   - Driver methods now return typed data directly (e.g., `NetboxPrefix`)
   - Methods throw `HTTPError` on failure instead of returning undefined
   - Error handling pattern:
     ```typescript
     const response = await this.get<Type>(url, config);
     
     if (response.ok) {
       return await response.json(); // Returns typed data
     } else {
       throw new HTTPError(response.statusText, response.status, response);
     }
     ```

4. **Update Type Expectations**
   ```typescript
   // OLD (Axios)
   const result: AxiosResponse<NetboxPrefix> = await driver.getPrefix(1);
   expect(result.status).toBe(200);
   expect(result.data.id).toBe(1);
   
   // NEW (fetch)
   const result: NetboxPrefix | undefined = await driver.getPrefix(1);
   expect(result).toBeDefined();
   expect(result!.id).toBe(1);
   
   // OR test for errors
   global.fetch = jest.fn().mockResolvedValue({
     ok: false,
     status: 404,
     statusText: 'Not Found',
     json: jest.fn(),
     headers: new Headers(),
   } as unknown as Response);
   
   await expect(driver.getPrefix(999)).rejects.toThrow(HTTPError);
   ```

5. **Remove Interceptor Tests**
   - Axios interceptors don't exist in fetch API
   - Remove all tests related to request/response interceptors
   - Focus on:
     - HTTP method tests (GET, POST, PUT, PATCH, DELETE)
     - Error handling tests
     - URL construction tests
     - Header passing tests

## Implementation Complexity

### zeniki-core-driver.unit.test.ts (Complex)
- 406 lines, 29 tests
- Extensive Axios interceptor testing
- Multiple HTTP method tests
- Authentication and CSRF token tests
- Requires significant refactoring

**Recommended Approach:**
1. Remove all interceptor-related tests (10-15 tests)
2. Keep HTTP method tests (GET, POST, PUT, PATCH, DELETE)
3. Keep error handling tests
4. Keep URL construction tests
5. Update mock structure to use `global.fetch`
6. Update assertions to match new driver behavior

### netbox-driver.unit.test.ts (Simple)
- 54 lines, 6 tests
- Basic method call testing
- Straightforward mock replacement needed

**Recommended Approach:**
1. Replace Axios mocks with fetch mocks
2. Update assertions to expect typed data or HTTPError
3. Test error cases properly

## Example: Updated NetBox Test

```typescript
describe('NetboxDriver', () => {
  let driver: NetboxDriver;

  beforeEach(() => {
    driver = new NetboxDriver({
      baseURL: 'https://netbox.example.com',
      headers: {
        Authorization: 'Token test-token',
        'Content-Type': 'application/json',
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch a prefix by ID successfully', async () => {
    const mockPrefix = {
      id: 1,
      prefix: '192.168.1.0/24',
      family: { value: 4, label: 'IPv4' },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockPrefix),
      headers: new Headers(),
    } as unknown as Response);

    const result = await driver.getPrefix(1);

    expect(result).toEqual(mockPrefix);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/ipam/prefixes/1/'),
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('should throw HTTPError on 404', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: jest.fn(),
      headers: new Headers(),
    } as unknown as Response);

    await expect(driver.getPrefix(999)).rejects.toThrow(HTTPError);
  });
});
```

## Priority

**Medium Priority** - Test files work with the old implementation but should be updated to:
1. Match the new production code using fetch API
2. Ensure proper test coverage of error handling with HTTPError
3. Remove obsolete interceptor tests
4. Provide accurate mocking for future test development

## References

- HTTPError: `src/types/shared/errors/http-error.ts`
- NetBox Driver: `src/core/tools/netbox/netbox-driver.ts`
- Core Driver: `src/core/base/zeniki-core-driver.ts`
- RequestConfig type: `src/core/base/zeniki-core-driver.ts` (line 121)
