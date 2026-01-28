/**
 * Rate limiter configuration for AVI DataScripts.
 * @interface
 * @example
 * ```typescript
 * const limiter: VMwareAVIRateLimiter = {
 *   name: 'api-limiter',
 *   count: 1000,
 *   period: 60,
 *   burst_sz: 100
 * };
 * ```
 */
export interface VMwareAVIRateLimiter {
  /** Burst size (0-1000000000) */
  burst_sz?: number; // min: 0, max: 1000000000
  /** Maximum count per period (default: 1000000000, min: 1, max: 1000000000) */
  count: number; // default: 1000000000, min: 1, max: 1000000000
  /** Descriptive name */
  name?: string;
  /** Time period in seconds (default: 1, min: 1, max: 1000000000) */
  period: number; // default: 1, min: 1, max: 1000000000
}
