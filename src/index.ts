/**
 * @fileoverview Main entry point for the Zeniki library.
 * Exports all public APIs, types, utilities, and drivers for npm distribution.
 *
 * @example
 * ```typescript
 * // Import everything
 * import * as Zeniki from '@norskhelsenett/zeniki';
 *
 * // Import specific components
 * import { NetboxDriver, NetboxPrefix, queryBuilder } from '@norskhelsenett/zeniki';
 *
 * // Import with destructuring
 * import { NetboxDriver, Utils } from '@norskhelsenett/zeniki';
 * const { queryBuilder } = Utils;
 *
 * // Import namespace types for organized access
 * import { NHNTypes, NAMv2Types, FortiOSTypes } from '@norskhelsenett/zeniki';
 *
 * // Use specific namespace types
 * const env: NHNTypes.NHN_CommonNetboxExtraChoicesEnvironments = 'prod';
 * ```
 */

// ===== MAIN CLASSES AND DRIVERS =====
export { ZenikiCoreDriver } from "./core/base/zeniki-core-driver";
export { NetboxDriver } from "./core/tools/netbox/netbox-driver";
export { NAMv2Driver } from "./core/tools/nhn/nam-v2/nam-v2-driver";
export { RORv1Driver } from "./core/tools/nhn/ror-v1/ror-v1-driver";
export { FortiOSDriver } from "./core/hw/fortinet/fortios-driver";
export { VMwareNSXDriver } from "./core/hw/vmware/vmware-nsx-driver";
export { VMWareAVIDriver } from "./core/hw/vmware/avi/vmware-avi-driver";
export { Zeniki } from "./core/zeniki";

// ===== ERROR CLASSES =====
export { HTTPError } from "./types/shared/errors/http-error";

// ===== LOGGERS =====
export { WinstonHecLogger } from "./core/loggers/winston-hec-logger";

// ===== UTILITIES =====
export * as Utils from "./core/utils";
// Also export utils directly for convenience
export { queryBuilder, queryBuilderSync } from "./core/utils/query-builder";
export { ipToHash } from "./core/utils/ip-to-hash";
export { EnvLoader } from "./core/utils/env-loader";
export { isDevMode } from "./core/utils/is-dev-mode";

// ===== ALL TYPE DEFINITIONS =====
export * from "./types";

// ===== NAMESPACE EXPORTS FOR ORGANIZED ACCESS =====
export * as IPTypes from "./types/utils/ip-types";
export * as NetboxTypes from "./types/tools/netbox/shared/netbox-partial";
export * as FortiOSTypes from "./types/hw/fortios/shared/fortios-params";
export * as VMwareNSXTypes from "./types/hw/vmware/nsx/shared/vmware-nsx-common";
export * as NAMv2Types from "./types/tools/nhn/nam-v2/shared/nam-default-fields";
export * as NHNTypes from "./types/common/common-nhn-types";

// ===== DEFAULT EXPORT =====
// Export the main Zeniki class as default for simple imports
export { Zeniki as default } from "./core/zeniki";
