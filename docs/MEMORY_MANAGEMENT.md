# Memory Management Guide

This document describes memory management best practices and the cleanup mechanisms implemented in Zeniki to prevent memory leaks.

## Overview

Zeniki drivers and utilities implement proper resource cleanup to prevent memory leaks in long-running applications. This is especially important when:

- Creating and destroying driver instances frequently
- Running in serverless or container environments
- Building applications with dynamic driver initialization
- Using file watchers or background processes

## Memory Leak Prevention

### 1. Resource Management

**Problem:** Long-lived references and resources can create memory leaks when driver instances are not properly cleaned up, especially in long-running applications.

**Solution:** All drivers implement proper cleanup mechanisms through the `dispose()` method.

```typescript
// ✅ GOOD: Proper cleanup
const driver = new NetboxDriver(config);
// ... use driver
driver.dispose(); // Cleans up references and resources

// ❌ BAD: No cleanup - potential memory leak
const driver = new NetboxDriver(config);
// ... use driver
// driver goes out of scope but resources may remain
```

### 2. Driver Lifecycle Management

All Zeniki drivers extending `ZenikiCoreDriver` now include a `dispose()` method:

```typescript
import { NetboxDriver } from '@norskhelsenett/zeniki';

class MyService {
  private driver: NetboxDriver;

  async initialize() {
    this.driver = new NetboxDriver({
      baseURL: 'https://netbox.example.com/api',
      headers: { Authorization: 'Token abc123' }
    });
  }

  async shutdown() {
    // Always dispose drivers when done
    if (this.driver) {
      this.driver.dispose();
    }
  }
}
```

### 3. Logger Transport Cleanup

**Problem:** Winston transports with HTTP clients can accumulate resources if not properly disposed.

**Solution:** `WinstonHecLogger` includes a dispose method for cleanup:

```typescript
import winston from 'winston';
import { WinstonHecLogger } from '@norskhelsenett/zeniki';

// Create transport
const hecTransport = new WinstonHecLogger({
  baseURL: 'https://splunk.example.com:8088',
  headers: { Authorization: 'Splunk token123' }
});

const logger = winston.createLogger({
  transports: [hecTransport]
});

// ... use logger

// Cleanup when shutting down
logger.remove(hecTransport);
hecTransport.dispose(); // Clean up resources
```

### 4. File Watcher Cleanup

**Problem:** File system watchers created by `EnvLoader` can prevent garbage collection if not properly closed.

**Solution:** Always close EnvLoader instances when done:

```typescript
import { EnvLoader } from '@norskhelsenett/zeniki';

const loader = new EnvLoader('./secrets.yaml', './config.yaml');

// ... environment loaded

// Cleanup when shutting down
loader.close();

// Check if disposed
if (loader.isDisposed()) {
  console.log('EnvLoader properly cleaned up');
}
```

## Best Practices

### Application Lifecycle Hooks

Integrate cleanup into your application's lifecycle:

```typescript
// Express.js example
import express from 'express';
import { NetboxDriver, WinstonHecLogger } from '@norskhelsenett/zeniki';

const app = express();
const drivers: NetboxDriver[] = [];
const loggers: WinstonHecLogger[] = [];

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, cleaning up...');
  
  // Dispose all drivers
  for (const driver of drivers) {
    driver.dispose();
  }
  
  // Dispose all loggers
  for (const logger of loggers) {
    logger.dispose();
  }
  
  process.exit(0);
});
```

### Serverless Functions

Clean up resources at the end of each invocation:

```typescript
// AWS Lambda example
import { NetboxDriver } from '@norskhelsenett/zeniki';

export const handler = async (event: any) => {
  const driver = new NetboxDriver({
    baseURL: process.env.NETBOX_URL,
    headers: { Authorization: `Token ${process.env.NETBOX_TOKEN}` }
  });

  try {
    // Use driver
    const result = await driver.getPrefix(123);
    return { statusCode: 200, body: JSON.stringify(result.data) };
  } finally {
    // Always cleanup, even if error occurs
    driver.dispose();
  }
};
```

### Singleton Pattern with Cleanup

If using singleton drivers, provide cleanup method:

```typescript
class NetboxService {
  private static instance: NetboxService;
  private driver: NetboxDriver;

  private constructor() {
    this.driver = new NetboxDriver({
      baseURL: process.env.NETBOX_URL,
      headers: { Authorization: `Token ${process.env.NETBOX_TOKEN}` }
    });
  }

  static getInstance(): NetboxService {
    if (!NetboxService.instance) {
      NetboxService.instance = new NetboxService();
    }
    return NetboxService.instance;
  }

  // Provide cleanup for application shutdown
  static cleanup(): void {
    if (NetboxService.instance) {
      NetboxService.instance.driver.dispose();
      NetboxService.instance = null as any;
    }
  }

  getDriver(): NetboxDriver {
    return this.driver;
  }
}

// At application shutdown
NetboxService.cleanup();
```

### Testing

Always clean up in test teardown:

```typescript
import { NetboxDriver } from '@norskhelsenett/zeniki';

describe('NetBox Integration', () => {
  let driver: NetboxDriver;

  beforeEach(() => {
    driver = new NetboxDriver({
      baseURL: 'https://netbox.test.com/api',
      headers: { Authorization: 'Token test123' }
    });
  });

  afterEach(() => {
    // Clean up after each test
    driver.dispose();
  });

  test('should retrieve prefix', async () => {
    const result = await driver.getPrefix(1);
    expect(result.data).toBeDefined();
  });
});
```

## Memory Profiling

To verify there are no memory leaks in your application:

### Node.js Heap Snapshots

```typescript
import { writeHeapSnapshot } from 'v8';

// Take snapshot before
writeHeapSnapshot('./heap-before.heapsnapshot');

// Create and destroy many drivers
for (let i = 0; i < 1000; i++) {
  const driver = new NetboxDriver(config);
  // use driver
  driver.dispose();
}

// Force garbage collection (run with --expose-gc)
if (global.gc) {
  global.gc();
}

// Take snapshot after
writeHeapSnapshot('./heap-after.heapsnapshot');

// Compare in Chrome DevTools to identify retained objects
```

## API Reference

### ZenikiCoreDriver.dispose()

Disposes of the driver instance and cleans up resources. Clears references to prevent memory leaks.

**Returns:** `void`

**Example:**
```typescript
const driver = new NetboxDriver(config);
driver.dispose();
```

### WinstonHecLogger.dispose()

Disposes of the logger instance and cleans up resources. Clears references and removes event listeners.

**Returns:** `void`

**Example:**
```typescript
const hecTransport = new WinstonHecLogger(config);
hecTransport.dispose();
```

### EnvLoader.close()

Closes all file watchers and disposes of the EnvLoader instance. Marks the instance as disposed to prevent further operations.

**Returns:** `void`

**Example:**
```typescript
const loader = new EnvLoader();
loader.close();
```

### EnvLoader.isDisposed()

Checks if the EnvLoader instance has been disposed.

**Returns:** `boolean` - True if the instance has been disposed

**Example:**
```typescript
const loader = new EnvLoader();
console.log(loader.isDisposed()); // false
loader.close();
console.log(loader.isDisposed()); // true
```

## Troubleshooting

### High Memory Usage

If you notice increasing memory usage:

1. Verify all drivers are disposed when no longer needed
2. Check that logger transports are removed and disposed
3. Ensure EnvLoader instances are closed
4. Use memory profiling tools to identify retained objects
5. Monitor for undisposed resources using heap snapshots

## Migration Guide

### Updating Existing Code

If you have existing code that doesn't call `dispose()`:

1. Identify where drivers are created
2. Find the corresponding cleanup/shutdown points
3. Add `dispose()` calls at those points

**Before:**
```typescript
const driver = new NetboxDriver(config);
await driver.getPrefix(123);
// No cleanup
```

**After:**
```typescript
const driver = new NetboxDriver(config);
try {
  await driver.getPrefix(123);
} finally {
  driver.dispose(); // Clean up
}
```

## Summary

✅ **Always call `dispose()` on drivers when done**
✅ **Remove and dispose logger transports on shutdown**
✅ **Close EnvLoader instances when no longer needed**
✅ **Integrate cleanup into application lifecycle hooks**
✅ **Add cleanup to test teardown methods**
✅ **Use try-finally blocks for guaranteed cleanup**
✅ **Monitor memory usage in production**

By following these practices, you can ensure your Zeniki-based applications remain memory-efficient and leak-free.
