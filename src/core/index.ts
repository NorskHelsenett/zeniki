/**
 * @fileoverview Core functionality exports for Zeniki library.
 * Exports all core classes, drivers, and utilities for internal and external use.
 *
 * @example
 * ```typescript
 * // Import all core functionality
 * import * as ZenikiCore from '@norskhelsenett/zeniki/core';
 *
 * // Import specific drivers
 * import { NetboxDriver, NAMv2Driver } from '@norskhelsenett/zeniki/core';
 *
 * // Import utilities
 * import { Utils, queryBuilder } from '@norskhelsenett/zeniki/core';
 * ```
 */

// ===== BASE CLASSES =====
export { ZenikiCoreDriver } from "./base/zeniki-core-driver";
export { Zeniki } from "./zeniki";

// ===== NETWORK TOOL DRIVERS =====
export { NetboxDriver } from "./tools/netbox/netbox-driver";
export { NAMv2Driver } from "./tools/nhn/nam-v2/nam-v2-driver";
export { RORv1Driver } from "./tools/nhn/ror-v1/ror-v1-driver";

// ===== HARDWARE DRIVERS =====
export { FortiOSDriver } from "./hw/fortinet/fortios-driver";
export { VMwareNSXDriver } from "./hw/vmware/vmware-nsx-driver";
export { VMwareAVIDriver } from "./hw/vmware/avi/vmware-avi-driver";

// ===== LOGGERS =====
export { WinstonHecLogger } from "./loggers/winston-hec-logger";

// ===== UTILITIES =====
export * as Utils from "./utils";
// Export utilities directly for convenience
export { queryBuilder, queryBuilderSync } from "./utils/query-builder";
export { ipToHash } from "./utils/ip-to-hash";
export { EnvLoader } from "./utils/env-loader";
export { isDevMode } from "./utils/is-dev-mode";
