/**
 * Builds an HTTP query string from a parameters object (async version).
 * @param params - Object or URLSearchParams to convert to query string
 * @returns Promise resolving to query string with leading '?' or empty string
 * @example
 * ```typescript
 * const query = await queryBuilder({ limit: 50, offset: 0 });
 * // Result: "?limit=50&offset=0"
 * ```
 */
export const queryBuilder = async (
  params: object | URLSearchParams,
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
 * Builds an HTTP query string from a parameters object (sync version).
 * @param params - Object or URLSearchParams to convert to query string
 * @returns Query string with leading '?' or empty string
 * @example
 * ```typescript
 * const query = queryBuilderSync({ page: 1, size: 25 });
 * // Result: "?page=1&size=25"
 * ```
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
 * @example
 * ```typescript
 * import queryBuilder from './query-builder';
 * ```
 */
export default queryBuilder;
