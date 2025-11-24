/**
 * @fileoverview HTTP query string builder utilities for constructing URL parameters.
 * Provides both synchronous and asynchronous functions for building query strings from objects.
 * Uses the native URLSearchParams API for reliable parameter encoding and generates complete query strings with leading '?'.
 */

/**
 * Builds an HTTP query string from a parameters object (asynchronous version).
 * Converts an object with key-value pairs into a properly formatted URL query string.
 * Uses the native URLSearchParams API for reliable query string construction and encoding.
 *
 * @param params - Object containing key-value pairs to convert to query parameters
 * @returns Promise that resolves to the constructed query string with leading '?'
 *
 * @example
 * ```typescript
 * // Building query parameters from an object
 * const params = {
 *   limit: 50,
 *   offset: 0,
 *   search: "example with spaces"
 * };
 * const queryString = await queryBuilder(params);
 * // Result: "?limit=50&offset=0&search=example+with+spaces"
 *
 * // NetBox API filtering example
 * const filters = {
 *   status: "active",
 *   family: 4,
 *   site_id: 1
 * };
 * const queryString = await queryBuilder(filters);
 * // Result: "?status=active&family=4&site_id=1"
 *
 * // Handling arrays and multiple values
 * const params = {
 *   tag: ["network", "production"],
 *   limit: 100
 * };
 * const queryString = await queryBuilder(params);
 * // Result: "?tag=network%2Cproduction&limit=100"
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams} URLSearchParams Documentation
 */
export const queryBuilder = async (
  params: object | URLSearchParams
): Promise<String> => {
  if (!params) {
    return "";
  }
  let query: URLSearchParams;
  if (params instanceof URLSearchParams === false) {
    query = new URLSearchParams();

    for (const [param, value] of Object.entries(params)) {
      query.append(param, value);
    }
    if (query.toString()) {
      return `?${query.toString()}`;
    }
  } else {
    query = params as URLSearchParams;
    if (query.toString()) {
      return `?${query.toString()}`;
    }
  }
  return "";
};

/**
 * Builds an HTTP query string from a parameters object (synchronous version).
 * Converts an object with key-value pairs into a properly formatted URL query string.
 * Uses the native URLSearchParams API for reliable query string construction and encoding.
 *
 * @param params - Object containing key-value pairs to convert to query parameters
 * @returns The constructed query string with leading '?'
 *
 * @example
 * ```typescript
 * // Building new query parameters
 * const params = {
 *   page: 1,
 *   size: 25,
 *   filter: "active status"
 * };
 * const queryString = queryBuilderSync(params);
 * // Result: "?page=1&size=25&filter=active+status"
 *
 * // NetBox prefix filtering
 * const prefixFilters = {
 *   status: "active",
 *   family: "4",
 *   within_include: "10.0.0.0/8"
 * };
 * const queryString = queryBuilderSync(prefixFilters);
 * // Result: "?status=active&family=4&within_include=10.0.0.0%2F8"
 *
 * // Empty object handling
 * const emptyParams = {};
 * const queryString = queryBuilderSync(emptyParams);
 * // Result: "?"
 *
 * // Complex values with special characters
 * const searchParams = {
 *   description__icontains: "DMZ & firewall rules",
 *   created__gte: "2025-01-01"
 * };
 * const queryString = queryBuilderSync(searchParams);
 * // Result: "?description__icontains=DMZ+%26+firewall+rules&created__gte=2025-01-01"
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams} URLSearchParams Documentation
 */
export const queryBuilderSync = (params: object | URLSearchParams): String => {
  if (!params) {
    return "";
  }
  let query: URLSearchParams;
  if (params instanceof URLSearchParams === false) {
    query = new URLSearchParams();

    for (const [param, value] of Object.entries(params)) {
      query.append(param, value);
    }
    if (query.toString()) {
      return `?${query.toString()}`;
    }
  } else {
    query = params as URLSearchParams;
    if (query.toString()) {
      return `?${query.toString()}`;
    }
  }
  return "";
};

/**
 * Default export of the async query builder function.
 * Provides convenient import syntax for the most commonly used async version.
 *
 * @example
 * ```typescript
 * import queryBuilder from './query-builder';
 * // or
 * import { queryBuilder, queryBuilderSync } from './query-builder';
 * ```
 */
export default queryBuilder;
