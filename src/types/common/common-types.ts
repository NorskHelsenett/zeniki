// Standard enable/disable enumeration for network device configuration
export enum CommonEnableDisable {
  Enable = "enable",
  Disable = "disable",
}

// String literal union for enable/disable values
export type CommonEnableDisables = "enable" | "disable";

// HTTP method enumeration for REST API operations
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

// String literal union for HTTP methods
export type HttpMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

// Generic key-value store type
export type CommonKeyValueStore<K extends string | number | symbol, V> = {
  [key in K]: V;
};

// Synchronization priority enumeration
export enum SyncPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// String literal union for sync priorities
export type SyncPriorities = "low" | "medium" | "high";
