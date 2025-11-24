import yaml from "yaml";
import fs, { FSWatcher } from "node:fs";
import process, { env } from "node:process";

/**
 * EnvLoader class for loading and managing environment variables from configuration files.
 * Supports both JSON and YAML formats with automatic file watching for hot reloading.
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
   *
   * @param secretsPath - Path to the secrets file (default: "./secrets/secrets.yaml")
   * @param configPath - Path to the configuration file (default: "./config/config.yaml")
   */
  constructor(
    private secretsPath = "./secrets/secrets.yaml",
    private configPath = "./config/config.yaml"
  ) {
    try {
      if (
        fs.statSync(secretsPath) &&
        fs.statSync(configPath) &&
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
      console.error("Error during initialization:", (error as Error).message);
      // Cleanup any watchers that might have been created
      this.close();
    }
  }

  /**
   * Loads and parses configuration and secrets files, then sets environment variables.
   * This method reads both files synchronously and populates the Deno environment.
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
   *
   * @param path - The file path to read and parse
   * @returns Parsed object or undefined if parsing fails
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
   */
  private setupWatchers(): void {
    this.setupFileWatcher(this.secretsPath);
    this.setupFileWatcher(this.configPath);
  }

  /**
   * Sets up a file system watcher for a specific file.
   *
   * @param filePath - Path to the file to watch
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
   *
   * @returns Array of secret keys
   */
  public static getSecretKeys(): string[] {
    return EnvLoader._secrets ? Object.keys(EnvLoader._secrets) : [];
  }

  /**
   * Gets the loaded configuration.
   *
   * @returns Copy of loaded configuration
   */
  public static getConfig(): Record<string, string> | undefined {
    return EnvLoader._config ? { ...EnvLoader._config } : undefined;
  }

  /**
   * Checks if secrets and config have been loaded.
   *
   * @returns True if both secrets and config are loaded
   */
  public static isLoaded(): boolean {
    return !!(EnvLoader._secrets && EnvLoader._config);
  }
}
