# Winston HEC Logger

Winston transport for Splunk HTTP Event Collector (HEC) integration. Sends structured log events to Splunk HEC endpoint via HTTP POST with automatic authentication and error handling.

## Features

- **Splunk HEC Integration** - Direct HTTP POST to Splunk Event Collector endpoint using native fetch API
- **Token-Based Authentication** - Authorization header support for Splunk HEC tokens
- **Error Handling** - Built-in error handling with event emission for failed requests
- **Winston Transport** - Extends standard Winston transport for seamless integration
- **Lightweight** - Uses modern native fetch API, no external HTTP dependencies
- **Clean Disposal** - Proper resource cleanup to prevent memory leaks

## Installation

The WinstonHecLogger is now available for public use and can be imported directly from the main Zeniki package.

```typescript
import { WinstonHecLogger } from '@norskhelsenett/zeniki';
```

## Usage

### Basic Configuration

```typescript
import winston from 'winston';
import { WinstonHecLogger } from '@norskhelsenett/zeniki';

// Create HEC transport with native fetch configuration
const hecTransport = new WinstonHecLogger({
  baseURL: 'https://splunk.example.com:8088',
  headers: {
    'Authorization': 'Splunk YOUR-HEC-TOKEN-HERE',
    'Content-Type': 'application/json'
  }
}, {
  level: 'info',
  format: winston.format.json()
});

// Add to Winston logger
const logger = winston.createLogger({
  transports: [hecTransport]
});

// Send logs to Splunk
logger.info('Application started', { userId: 123, action: 'login' });
logger.error('Database connection failed', { error: 'Connection timeout' });
```

### Advanced Configuration with Multiple Transports

```typescript
import winston from 'winston';
import { WinstonHecLogger } from '@norskhelsenett/zeniki';

// Create HEC transport with custom headers
const hecTransport = new WinstonHecLogger({
  baseURL: 'https://splunk.company.com:8088',
  headers: {
    'Authorization': 'Splunk abc123-def456-ghi789',
    'Content-Type': 'application/json',
    'X-Splunk-Request-Channel': 'custom-channel-id'
  }
}, {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// Configure logger with multiple transports
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    hecTransport
  ]
});

// Logs will be sent to both console and Splunk HEC
logger.info('Multi-transport logging', { 
  environment: 'production',
  service: 'api-gateway',
  requestId: 'req-12345'
});

// Clean up when done
logger.remove(hecTransport);
hecTransport.dispose();
```

## Configuration Options

### Constructor Parameters

**config** (RequestConfig) - Required
- `baseURL` - Splunk HEC endpoint URL (e.g., `https://splunk.example.com:8088`)
- `headers` - HTTP headers object
  - `Authorization` - Splunk HEC token (format: `Splunk <token>`)
  - `Content-Type` - Should be `application/json`
  - Custom headers as needed

**opts** (TransportStreamOptions) - Optional
- `level` - Minimum log level to send to HEC
- `format` - Winston format to apply before sending

### Native Fetch API

The transport uses the native fetch API for HTTP communication. All fetch-compatible options can be passed through the `config` object, including:
- `method` - HTTP method (automatically set to POST)
- `headers` - Request headers
- `signal` - AbortSignal for request cancellation
- Additional fetch options as needed

## Log Format Requirements

The transport expects log messages to contain a properly formatted event structure. Use the `httpLoggerFormat` from the main logger module to ensure compatibility:

```typescript
const httpLoggerFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    return JSON.stringify({
      event: {
        timestamp,
        level,
        message,
        metadata
      },
      host: os.hostname(),
      index: process.env.SPLUNK_INDEX,
      source: process.env.SPLUNK_SOURCE,
      sourcetype: process.env.SPLUNK_SOURCE_TYPE,
      time: Date.now()
    });
  })
);
```

## Error Handling

The transport includes automatic error handling using native fetch:

- **Network Errors** - Connection failures and network errors are emitted as `error` events
- **Event Validation** - Only sends logs with valid event structure to prevent errors
- **Error Emission** - Failed requests emit Winston transport error events for upstream handling
- **Graceful Degradation** - Logging failures don't crash your application

```typescript
// Listen for transport errors
hecTransport.on('error', (error) => {
  console.error('Failed to send log to Splunk:', error);
});
```

## Integration with Zeniki Logger

The WinstonHecLogger is designed to work with the Zeniki logging system:

```typescript
import { logger, addHttpLoggerTransport } from '@norskhelsenett/zeniki';

// Set environment variables
process.env.HTTP_LOGGER_HOST = 'splunk.example.com';
process.env.HTTP_LOGGER_PORT = '8088';
process.env.SPLUNK_INDEX = 'main';
process.env.SPLUNK_SOURCE = 'zeniki-app';
process.env.SPLUNK_SOURCE_TYPE = '_json';

// Add HEC transport to existing logger
addHttpLoggerTransport();

// Use logger normally
logger.info('Integrated HEC logging', { module: 'api' });
```

## API Endpoint

The transport sends logs to the Splunk HEC event collector endpoint:

```
POST /services/collector/event
```

## Resource Cleanup

Always dispose of the transport when removing it from your logger to prevent memory leaks:

```typescript
// Remove transport from logger
logger.remove(hecTransport);

// Dispose of transport resources
hecTransport.dispose();
```

## See Also

- [Splunk HEC Documentation](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector)
- [Winston Transport Documentation](https://github.com/winstonjs/winston#transports)
