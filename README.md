<div align="center">
  <img src="zeniki-logo.png" alt="Zeniki Logo" width="300" />
</div>

# Zeniki

> A TypeScript API communication library for commonly used network hardware and tools

[![npm version](https://img.shields.io/npm/v/@norskhelsenett/zeniki.svg)](https://www.npmjs.com/package/@norskhelsenett/zeniki)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Zeniki is a modern TypeScript library that provides type-safe, well-documented drivers for network infrastructure platforms including NetBox IPAM, FortiGate firewalls, VMware NSX, and Network Automation Management (NAM) v2. Features comprehensive type safety with NHN-specific custom field types, immutable API responses, and enterprise-grade network automation capabilities.

## Installation

### Install from npm

Zeniki is now publicly available on npm:

```bash
npm install @norskhelsenett/zeniki
```

### Deno installation

```bash
# Add to your import map or import directly
deno add npm:@norskhelsenett/zeniki
```

Or import directly in your Deno code:

```typescript
import { NetboxDriver } from "npm:@norskhelsenett/zeniki";
```

## Quick Start

### NetBox Integration Example

```typescript
import { 
  NetboxDriver, 
  NetboxPrefixStatus,
  NHN_CommonNetboxExtraChoicesEnvironment,
  NHN_CommonNetboxExtraChoicesDomain 
} from '@norskhelsenett/zeniki';

const netbox = new NetboxDriver({
  baseURL: 'https://netbox.example.com/api',
  headers: {
    Authorization: 'Token your-api-token-here'
  }
});

// Create a new IP prefix with type-safe enums and NHN custom fields
const prefix = await netbox.addPrefix({
  prefix: '192.168.1.0/24',
  description: 'Development Network',
  status: NetboxPrefixStatus.Active,
  site: 1,
  custom_fields: {
    environment: NHN_CommonNetboxExtraChoicesEnvironment.dev,
    domain: NHN_CommonNetboxExtraChoicesDomain["nhn.local"]
  }
});

// Get all active prefixes
const prefixes = await netbox.getPrefixes({
  status: 'active',
  family: 4
});

console.log(`Created prefix: ${prefix.prefix}`);
console.log(`Found ${prefixes.count} active prefixes`);
```

## Documentation

### Driver Documentation
- 📖 **[NetBox Driver](src/core/tools/netbox/README.md)** - Complete IPAM and DCIM management
- 🛡️ **[FortiOS Driver](src/core/hw/fortinet/README.md)** - Enterprise firewall management  
- 🔧 **[VMware NSX Driver](src/core/hw/vmware/README.md)** - Software-defined networking
- 🌐 **[NAM v2 Driver](src/core/tools/nhn/nam-v2/README.md)** - Network automation management

### Logging
- 📊 **[Winston HEC Logger](src/core/loggers/README.md)** - Splunk HTTP Event Collector transport

### Testing & Examples
📝 **[Test Suite Documentation](test/README.md)** - Unit tests, integration tests, and examples

## Development

### Building

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Create distributable package
npm pack

# Run tests
npm test
```

### Project Structure

```
src/
├── core/                 # Core functionality
│   ├── base/            # Base classes
│   ├── tools/           # API drivers
│   └── utils/           # Utility functions
├── types/               # TypeScript definitions
└── index.ts             # Main entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- 🌐 Website: [https://www.nhn.no/](https://www.nhn.no/)
- 📝 Issues: [GitHub Issues](https://github.com/NorskHelsenett/zeniki/issues)

---

**Made with ❤️ by NHN**