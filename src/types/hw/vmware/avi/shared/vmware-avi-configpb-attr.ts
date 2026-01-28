/**
 * Configuration protocol buffer attributes for AVI objects.
 * @interface
 * @example
 * ```typescript
 * const attr: VMwareAVIConfigPbAttributes = { version: 1 };
 * ```
 */
export interface VMwareAVIConfigPbAttributes {
  /** Protocol buffer version */
  version?: number; // Default: 1
}
