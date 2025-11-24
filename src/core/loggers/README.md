# Winston HEC Logger

Winston transport for Splunk HTTP Event Collector (HEC) integration. Sends structured log events to Splunk HEC endpoint via HTTP POST with automatic authentication and error handling.

## Features

- **Splunk HEC Integration** - Direct HTTP POST to Splunk Event Collector endpoint
- **Token-Based Authentication** - Automatic authorization header injection via interceptors
- **Error Handling** - Built-in request/response error interceptors with debug logging
- **Winston Transport** - Extends standard Winston transport for seamless integration
- **Development Mode** - Detailed error logging when running in development environment

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

// Create HEC transport
const hecTransport = new WinstonHecLogger({
  baseURL: 'https://splunk.example.com:8088',
  headers: {
    Authorization: 'Splunk YOUR-HEC-TOKEN-HERE'
  },
  timeout: 5000
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

### Advanced Configuration with SSL and Retry

```typescript
import winston from 'winston';
import https from 'https';
import { WinstonHecLogger } from '@norskhelsenett/zeniki';

// Create HEC transport with custom HTTPS agent
const hecTransport = new WinstonHecLogger({
  baseURL: 'https://splunk.company.com:8088',
  headers: {
    Authorization: 'Splunk abc123-def456-ghi789'
  },
  timeout: 10000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // For self-signed certificates
  })
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
```

## Configuration Options

### Constructor Parameters

**config** (RequestConfig) - Required
- `baseURL` - Splunk HEC endpoint URL (e.g., `https://splunk.example.com:8088`)
- `headers.Authorization` - Splunk HEC token (format: `Splunk <token>`)
- `timeout` - Request timeout in milliseconds
- `httpsAgent` - Custom HTTPS agent for SSL configuration

**opts** (TransportStreamOptions) - Optional
- `level` - Minimum log level to send to HEC
- `format` - Winston format to apply before sending

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

The transport includes automatic error handling:

- **401/403 Errors** - Unauthorized/Forbidden errors are logged in development mode
- **Request Errors** - Network and connection errors are logged with full details
- **Response Errors** - HTTP error responses are intercepted and logged
- **Event Validation** - Only sends logs with valid event structure to prevent errors

## Environment Variables

For development debugging, the transport respects the following:

- `NODE_ENV=development` or `DENO_ENV=development` - Enables detailed error logging

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

## See Also

- [Splunk HEC Documentation](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector)
- [Winston Transport Documentation](https://github.com/winstonjs/winston#transports)
