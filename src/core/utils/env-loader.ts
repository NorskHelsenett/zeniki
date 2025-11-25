import yaml from "yaml";
import fs, { FSWatcher } from "node:fs";
import process, { env } from "node:process";

/**
 * EnvLoader class for loading and managing environment variables from configuration files.
 * Supports both JSON and YAML formats with singleton pattern for shared configuration state.
 * File watching functionality is temporarily disabled due to compatibility issues.
 * 
 * Features:
 * - Loads secrets and configuration from YAML or JSON files
 * - Singleton pattern ensures configuration is loaded once across the application
 * - Automatically sets environment variables from loaded files
 * - Graceful error handling in development and production modes
 * - Development mode logging: Set `process.env.NODE_ENV` or `process.env.DENO_ENV` to "development" to enable detailed error messages
 * - Clean disposal pattern to prevent memory leaks
 * 
 * File Structure Requirements:
 * - Example files are provided in the package: `examples/secrets.yaml.example` and `examples/config.yaml.example`
 * - Copy example files to your project with correct filenames:
 *   - `examples/secrets.yaml.example` → `./secrets/secrets.yaml`
 *   - `examples/config.yaml.example` → `./config/config.yaml`
 * - Create the directories if they don't exist: `./secrets/` and `./config/`
 * - Supported formats: `.yaml`, `.yml`, or `.json`
 * 
 * @class EnvLoader
 * @since 0.1.0
 * 
 * @example
 * ```typescript
 * import { EnvLoader } from '@norskhelsenett/zeniki';
 * 
 * // Setup: Copy example files to correct locations with correct filenames
 * // mkdir -p secrets config
 * // cp node_modules/@norskhelsenett/zeniki/examples/secrets.yaml.example ./secrets/secrets.yaml
 * // cp node_modules/@norskhelsenett/zeniki/examples/config.yaml.example ./config/config.yaml
 * 
 * // Initialize with default paths (./secrets/secrets.yaml and ./config/config.yaml)
 * const loader = new EnvLoader();
 * 
 * // Initialize with custom paths
 * const loader = new EnvLoader('./secrets/prod.yaml', './config/prod.yaml');
 * 
 * // Enable development mode for detailed error logging
 * process.env.NODE_ENV = 'development';
 * const devLoader = new EnvLoader();
 * 
 * // Check if configuration was loaded
 * if (EnvLoader.isLoaded()) {
 *   console.log('Configuration loaded successfully');
 * }
 * 
 * // Access loaded environment variables
 * const apiKey = process.env.MY_SECRET; // From secrets.yaml
 * const endpoint = process.env.MY_API_ENDPOINT; // From config.yaml
 * 
 * // Get configuration
 * const config = EnvLoader.getConfig();
 * 
 * // Get secret keys (without values)
 * const secretKeys = EnvLoader.getSecretKeys();
 * 
 * // Clean up when done
 * loader.close();
 * ```
 */
export class EnvLoader {
  /** Static storage for loaded secrets to ensure singleton behavior */
  private static _secrets: Record<string, string> | undefined;

  /** Static storage for loaded configuration to ensure singleton behavior */
  private static _config: Record<string, string> | undefined;

  private _watchers: FSWatcher[] = [];
  private _isDisposed: boolean = false;

  /**
   * Creates a new EnvLoader instance and initializes environment loading.
   * Uses singleton pattern - configuration is only loaded once even if multiple instances are created.
   * Gracefully handles missing files and logs appropriate messages based on environment mode.
   * 
   * Setup Instructions:
   * 1. Create directories and copy example files with correct filenames:
   *    ```bash
   *    mkdir -p secrets config
   *    cp node_modules/@norskhelsenett/zeniki/examples/secrets.yaml.example ./secrets/secrets.yaml
   *    cp node_modules/@norskhelsenett/zeniki/examples/config.yaml.example ./config/config.yaml
   *    ```
   * 2. Edit the copied files with your actual values:
   *    - `./secrets/secrets.yaml`: Add sensitive values like API tokens, passwords
   *    - `./config/config.yaml`: Add configuration like API endpoints, settings
   * 3. Add to `.gitignore` to prevent committing secrets:
   *    ```
   *    secrets/secrets.yaml
   *    config/config.yaml
   *    ```
   * 
   * Error Logging Behavior:
   * - Production: Only logs informational messages about missing files
   * - Development: Logs detailed error messages when `process.env.NODE_ENV` or `process.env.DENO_ENV` is set to "development"
   * 
   * @param secretsPath - Path to the secrets file (default: "./secrets/secrets.yaml")
   * @param configPath - Path to the configuration file (default: "./config/config.yaml")
   * 
   * @example
   * ```typescript
   * // Default initialization (expects ./secrets/secrets.yaml and ./config/config.yaml)
   * const loader = new EnvLoader();
   * 
   * // Custom paths with different file formats
   * const loader = new EnvLoader('./my-secrets.json', './my-config.yaml');
   * 
   * // Enable development mode for detailed error logging
   * process.env.NODE_ENV = 'development';
   * const devLoader = new EnvLoader(); // Will log detailed errors if files are missing
   * 
   * // Environment variables are now available
   * const apiKey = process.env.MY_SECRET; // From secrets file
   * const apiEndpoint = process.env.MY_API_ENDPOINT; // From config file
   * ```
   */
  constructor(
    private secretsPath = "./secrets/secrets.yaml",
    private configPath = "./config/config.yaml"
  ) {
    try {
      if (
        fs.statSync(secretsPath).isFile() &&
        fs.statSync(configPath).isFile() &&
        !EnvLoader._secrets &&
        !EnvLoader._config
      ) {
        console.log(
          `EnvLoader initialized with secrets: ${secretsPath}, config: ${configPath}`
        );
        this.load();
        // this.setupWatchers(); Temporary disable filewatchers due to bug in deno?
      }
    } catch (error: unknown) {
      console.log("EnvLoader initialized with no configuration and secrets.");
      console.log(
        `Make sure configuration and secrets can be found in paths ${secretsPath} and ${configPath}`
      );

      if (
        process.env.NODE_ENV === "development" ||
        process.env.DENO_ENV === "development"
      ) {
        console.error("Error during initialization:", (error as Error).message);
      }
      // Cleanup any watchers that might have been created
      this.close();
    }
  }

  /**
   * Loads and parses configuration and secrets files, then sets environment variables.
   * This method reads both files synchronously and populates process.env.
   * Uses singleton pattern - only loads once even if called multiple times.
   * Logs the number of secrets loaded (without exposing values) and the full configuration.
   * 
   * @private
   */
  private load() {
    // Parse the file contents based on file extension
    EnvLoader._secrets = this.parse(this.secretsPath);
    EnvLoader._config = this.parse(this.configPath);

    // Set secrets as environment variables (don't log sensitive data)
    if (EnvLoader._secrets) {
      for (const [key, value] of Object.entries(EnvLoader._secrets)) {
        process.env[key] = value as string;
      }
      console.log(
        `Secrets loaded: ${Object.keys(EnvLoader._secrets).length} variables`
      );
    }

    // Set config values as environment variables
    if (EnvLoader._config) {
      for (const [key, value] of Object.entries(EnvLoader._config)) {
        process.env[key] = value as string;
      }
      console.log("Config loaded", JSON.stringify(EnvLoader._config, null, 2));
    }
  }

  /**
   * Parses file contents as either JSON or YAML based on file extension.
   * Supported extensions: .json, .yaml, .yml
   * Logs parse errors to console and returns undefined on failure.
   * 
   * @private
   * @param path - The file path to read and parse
   * @returns Parsed object as key-value pairs, or undefined if parsing fails
   * @throws Will not throw - catches and logs errors internally
   */
  private parse(path: string): Record<string, string> | undefined {
    try {
      // Check if either file path contains .json to determine parsing method
      if (path.endsWith(".json")) {
        return JSON.parse(
          fs.readFileSync(path, { encoding: "utf-8" })
        ) as Record<string, string>;
      } else if (path.endsWith(".yaml") || path.endsWith(".yml")) {
        return yaml.parse(
          fs.readFileSync(path, { encoding: "utf-8" })
        ) as Record<string, string>;
      } else {
        throw new Error("Unsupported file format");
      }
    } catch (error: unknown) {
      console.error("Parse error: ", (error as Error).message);
      return undefined;
    }
  }

  /**
   * Sets up file system watchers for both configuration files.
   * NOTE: Currently disabled in constructor due to compatibility issues.
   * 
   * @private
   * @deprecated Temporarily disabled - not called in current implementation
   */
  private setupWatchers(): void {
    this.setupFileWatcher(this.secretsPath);
    this.setupFileWatcher(this.configPath);
  }

  /**
   * Sets up a file system watcher for a specific file.
   * Automatically reloads configuration when file changes are detected.
   * Handles errors gracefully and cleans up on failure.
   * 
   * @private
   * @param filePath - Path to the file to watch
   * @deprecated Temporarily disabled - not called in current implementation
   */
  private setupFileWatcher(filePath: string): void {
    try {
      const watcher = fs.watch(filePath);
      this._watchers.push(watcher);

      // Start watching in the background
      (async () => {
        try {
          for await (const watch of this._watchers) {
            watch.on("change", (changed) => {
              console.log(`File ${filePath} modified, reloading...`);
              this.load();
            });
          }
        } catch (_error: unknown) {
          console.log(`Error while watching file ${filePath}`);
          this.close();
        }
      })();
    } catch (_error: unknown) {
      console.log(`Failed to setup watcher for ${filePath}`);
      this.close();
    }
  }

  /**
   * Closes all file watchers and disposes of the EnvLoader instance.
   * Prevents memory leaks by properly cleaning up file system watchers.
   * Marks the instance as disposed to prevent further operations.
   *
   * @public
   *
   * @example
   * ```typescript
   * const loader = new EnvLoader('./secrets.yaml', './config.yaml');
   * // ... use loader
   * loader.close(); // Clean up when done
   * ```
   */
  public close(): void {
    if (this._isDisposed) {
      return; // Already disposed
    }

    try {
      // Close all file watchers
      for (const watcher of this._watchers) {
        watcher.close();
      }
      this._watchers = [];

      // Mark as disposed
      this._isDisposed = true;

      // Clear paths to allow garbage collection
      (this.secretsPath as any) = null;
      (this.configPath as any) = null;
    } catch (_error) {
      console.log("Unable to close all watchers ", (_error as Error).message);
    }
  }

  /**
   * Checks if the EnvLoader instance has been disposed.
   *
   * @returns True if the instance has been disposed
   *
   * @example
   * ```typescript
   * const loader = new EnvLoader();
   * console.log(loader.isDisposed()); // false
   * loader.close();
   * console.log(loader.isDisposed()); // true
   * ```
   */
  public isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Gets the loaded secrets keys (without exposing sensitive values).
   * Returns only the keys, not the values, to avoid logging sensitive information.
   * 
   * @static
   * @returns Array of secret keys, or empty array if secrets not loaded
   * 
   * @example
   * ```typescript
   * const keys = EnvLoader.getSecretKeys();
   * console.log(`Loaded secrets: ${keys.join(', ')}`);
   * // Example output: "Loaded secrets: API_KEY, DB_PASSWORD, JWT_SECRET"
   * ```
   */
  public static getSecretKeys(): string[] {
    return EnvLoader._secrets ? Object.keys(EnvLoader._secrets) : [];
  }

  /**
   * Gets the loaded configuration.
   * Returns a shallow copy to prevent external modifications to the singleton state.
   * 
   * @static
   * @returns Copy of loaded configuration as key-value pairs, or undefined if not loaded
   * 
   * @example
   * ```typescript
   * const config = EnvLoader.getConfig();
   * if (config) {
   *   console.log(`API URL: ${config.API_URL}`);
   *   console.log(`Environment: ${config.ENVIRONMENT}`);
   * }
   * ```
   */
  public static getConfig(): Record<string, string> | undefined {
    return EnvLoader._config ? { ...EnvLoader._config } : undefined;
  }

  /**
   * Checks if secrets and config have been loaded.
   * Useful for validating that configuration is available before proceeding.
   * 
   * @static
   * @returns True if both secrets and config are loaded, false otherwise
   * 
   * @example
   * ```typescript
   * if (!EnvLoader.isLoaded()) {
   *   console.warn('Configuration not loaded, using defaults');
   * }
   * ```
   */
  public static isLoaded(): boolean {
    return !!(EnvLoader._secrets && EnvLoader._config);
  }
}
