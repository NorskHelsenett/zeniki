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
│   │   │   ├── fortinet/    # FortiOS driver
│   │   │   └── vmware/      # VMware NSX driver
│   │   ├── tools/           # API tool drivers
│   │   │   ├── netbox/      # NetBox driver
│   │   │   └── nhn/         # NHN-specific tools
│   │   │       └── nam-v2/  # NAM v2 driver
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
