# Playground - Manual Driver Testing

Quick testing scripts for manual verification of Zeniki drivers and utilities.

> **Note:** All `.ts` files in the playground directory are excluded from git via `.gitignore`. This directory is for local testing only.

## Prerequisites

Ensure environment variables are configured in `secrets/secrets.yaml` and `config/config.yaml`:

```yaml
# secrets/secrets.yaml
NETBOX_TOKEN: "your-api-token-here"
```

```yaml
# config/config.yaml
NETBOX_URL: "https://netbox.example.com/api"
NETBOX_PREFIX: "192.168.0.0/16"
```

## Running Tests

### NetBox Driver Test

First, copy the example file to create your test file:

```bash
cp playground/test_driver.ts.example playground/test_driver.ts
```

Then run the NetBox API integration test:

```bash
npx tsx playground/test_driver.ts
```

**What it does:**
- Loads environment variables via EnvLoader
- Initializes NetboxDriver with authentication
- Fetches custom fields from NetBox
- Retrieves custom field choice sets
- Displays results in console

**Expected output:**
```
Custom fields found { count: 10, results: [...] }
Choice sets found { count: 5, results: [...] }
```

## Creating Your Own Test

1. **Create a new test file** in the `playground/` directory
2. **Import required drivers** from `../src/`
3. **Use EnvLoader** to load configuration
4. **Initialize driver** with credentials from `process.env`
5. **Run operations** and log results

### Example Template

```typescript
/**
 * @fileoverview Test driver for [Driver Name].
 * 
 * Run with: `npx tsx playground/my_test.ts`
 */

import { SomeDriver } from "../src/core/tools/some-driver";
import { EnvLoader } from "../src/core/utils";

const envLoader = new EnvLoader();

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

const testDriver = async () => {
  try {
    if (!API_URL || !API_TOKEN) {
      console.log("Required parameters missing");
      return;
    }

    const driver = new SomeDriver({
      baseURL: API_URL,
      headers: { Authorization: `Token ${API_TOKEN}` }
    });

    // Test your operations here
    const result = await driver.someMethod();
    console.log("Result:", result);

  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

testDriver();
```

## Available Drivers

Test any Zeniki driver manually:

- **NetboxDriver** - NetBox IPAM/DCIM operations
- **NAMv2Driver** - Network Architecture Management
- **FortiOSDriver** - FortiGate firewall management
- **NSXDriver** - VMware NSX policy management

## Tips

- Use `console.log()` for debugging output
- Check `test/` directory for unit test examples
- Set `NODE_ENV=development` for detailed EnvLoader logging
- Validate credentials before running tests
