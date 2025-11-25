# EnvLoader

Simple environment variable loader for managing configuration and secrets from YAML or JSON files.

## Features

- 🔒 Separate secrets and configuration management
- 🔄 Singleton pattern - load once, use everywhere
- 📁 Supports YAML (`.yaml`, `.yml`) and JSON (`.json`) formats
- 🛡️ Development mode with detailed error logging
- ♻️ Clean disposal to prevent memory leaks

## Quick Start

### 1. Setup Files

Copy example files to your project:

```bash
# Create directories
mkdir -p secrets config

# Copy example files with correct filenames
cp node_modules/@norskhelsenett/zeniki/examples/secrets.yaml.example ./secrets/secrets.yaml
cp node_modules/@norskhelsenett/zeniki/examples/config.yaml.example ./config/config.yaml
```

### 2. Edit Configuration

Edit the copied files with your values:

**`./secrets/secrets.yaml`** - Sensitive data:
```yaml
API_TOKEN: "your-secret-token"
DB_PASSWORD: "your-password"
JWT_SECRET: "your-jwt-secret"
```

**`./config/config.yaml`** - Application config:
```yaml
API_ENDPOINT: "https://api.example.com"
ENVIRONMENT: "production"
LOG_LEVEL: "info"
```

### 3. Secure Your Secrets

Add to `.gitignore`:
```
secrets/secrets.yaml
config/config.yaml
```

### 4. Use in Your Code

```typescript
import { EnvLoader } from '@norskhelsenett/zeniki';

// Initialize (loads files automatically)
const loader = new EnvLoader();

// Check if loaded successfully
if (EnvLoader.isLoaded()) {
  console.log('Configuration loaded!');
}

// Access environment variables
const apiToken = process.env.API_TOKEN;
const apiEndpoint = process.env.API_ENDPOINT;

// Get configuration object
const config = EnvLoader.getConfig();
console.log(config?.ENVIRONMENT); // "production"

// Get secret keys (without values)
const secretKeys = EnvLoader.getSecretKeys();
console.log(secretKeys); // ["API_TOKEN", "DB_PASSWORD", "JWT_SECRET"]

// Clean up when done
loader.close();
```

## Custom Paths

Use custom file locations:

```typescript
const loader = new EnvLoader(
  './my-secrets.yaml',
  './my-config.json'
);
```

## Development Mode

Enable detailed error logging:

```typescript
process.env.NODE_ENV = 'development';
const loader = new EnvLoader(); // Will log detailed errors if files missing
```

## API Reference

### Constructor

```typescript
new EnvLoader(secretsPath?: string, configPath?: string)
```

- `secretsPath` - Path to secrets file (default: `"./secrets/secrets.yaml"`)
- `configPath` - Path to config file (default: `"./config/config.yaml"`)

### Static Methods

#### `EnvLoader.isLoaded(): boolean`
Check if configuration was loaded successfully.

#### `EnvLoader.getConfig(): Record<string, string> | undefined`
Get loaded configuration as key-value pairs.

#### `EnvLoader.getSecretKeys(): string[]`
Get secret keys without exposing values.

### Instance Methods

#### `loader.close(): void`
Clean up and dispose of the loader instance.

#### `loader.isDisposed(): boolean`
Check if the loader has been disposed.

## File Format Examples

### YAML Format

```yaml
API_KEY: "abc123"
DATABASE_URL: "postgresql://localhost:5432/mydb"
ENABLE_FEATURE: "true"
```

### JSON Format

```json
{
  "API_KEY": "abc123",
  "DATABASE_URL": "postgresql://localhost:5432/mydb",
  "ENABLE_FEATURE": "true"
}
```

## Notes

- Environment variables are loaded into `process.env`
- Singleton pattern ensures configuration loads only once
- File watching is temporarily disabled
- Production mode silently handles missing files
- Development mode (`NODE_ENV=development` or `DENO_ENV=development`) shows detailed errors

## Security Best Practices

1. ✅ Never commit `secrets.yaml` or `config.yaml` files
2. ✅ Use `.gitignore` to exclude these files
3. ✅ Keep example files (`.example` extension) in version control
4. ✅ Use different secrets for different environments
5. ✅ Rotate secrets regularly
