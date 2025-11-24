/**
 * @fileoverview Common type definitions and enumerations for Zeniki network management platform.
 *
 * Shared types and enums used across FortiOS, NetBox, and other network infrastructure
 * management integrations. Provides standardized value sets for common configuration
 * patterns, HTTP operations, and boolean state representations used throughout the
 * enterprise network automation and management system.
 *
 * Supports FortiOS 7.4.x configuration standards, RESTful API operations, and
 * cross-platform integration patterns for comprehensive network device management.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/cli-reference} FortiOS CLI Reference
 */

/**
 * Standard enable/disable enumeration for network device configuration.
 * @enum CommonEnableDisable
 * @see {@link https://docs.fortinet.com/document/fortigate/7.4.0/cli-reference} FortiOS Configuration Standards
 */
export enum CommonEnableDisable {
  // Enable state for network features and services
  Enable = "enable",

  // Disable state for network features and services
  Disable = "disable",
}

/**
 * Type alias for enable/disable string literals.
 * @see CommonEnableDisable for enum values
 */
export type CommonEnableDisables = "enable" | "disable";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
 * Standard HTTP methods supported by REST API operations.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods} HTTP Methods Reference
 */
export type HttpMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type CommonKeyValueStore<K extends string | number | symbol, V> = {
  [key in K]: V;
};

export enum SyncPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export type SyncPriorities = "low" | "medium" | "high";
