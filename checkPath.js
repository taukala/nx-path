import decodePath from './decodePath.js';
import matchPath from './matchPath.js';

/**
 * Checks if a given path matches a pattern by first decoding the path and then matching it against the pattern.
 * This utility combines decodePath and matchPath functions to provide a complete path checking solution.
 *
 * By default the path must be a clean pathname: if it contains a query string (?) or
 * hash fragment (#), the result is isMatch: false. Use the allowQuery / allowHash
 * options to accept such paths — the query/hash is stripped before matching and
 * returned in the result.
 *
 * @param {(string|Object)} pattern - The path pattern to match against
 * @param {string} pattern.path - The path string when pattern is an object
 * @param {boolean} [pattern.caseSensitive] - Whether to match case sensitively when pattern is an object
 * @param {boolean} [pattern.end] - Whether to match until the end when pattern is an object
 * @param {string} path - The URL path to check
 * @param {Object} [options] - Matching options
 * @param {boolean} [options.allowQuery=false] - Whether a query string (?key=value) is allowed in the path.
 *   When true it is stripped before matching and returned as result.query.
 *   When false a path containing '?' never matches.
 * @param {boolean} [options.allowHash=false] - Whether a hash fragment (#section) is allowed in the path.
 *   When true it is stripped before matching and returned as result.hash.
 *   When false a path containing '#' never matches.
 *
 * @returns {Object} Result object containing match information
 * @returns {string} result.originalPath - The original input path
 * @returns {string} result.decodedPath - The decoded version of the path (query/hash excluded)
 * @returns {(Object|null)} result.match - The match result object or null if no match
 * @returns {boolean} result.isMatch - Whether the path matches the pattern
 * @returns {Object} result.params - The extracted parameters from the path
 * @returns {(string|null)} result.query - The raw query string without the leading '?', or null if none
 * @returns {(string|null)} result.hash - The hash fragment without the leading '#', or null if none
 *
 * @example
 * // Basic usage with string pattern
 * checkPath('/users/[id]', '/users/123')
 * // => {
 * //   originalPath: '/users/123',
 * //   decodedPath: '/users/123',
 * //   match: { params: { id: '123' }, ... },
 * //   isMatch: true,
 * //   params: { id: '123' },
 * //   query: null,
 * //   hash: null
 * // }
 *
 * @example
 * // With encoded path
 * checkPath(
 *   '/products/[category]/[id]',
 *   '/products/summer%20collection/item-123'
 * )
 * // => {
 * //   originalPath: '/products/summer%20collection/item-123',
 * //   decodedPath: '/products/summer collection/item-123',
 * //   match: { params: { category: 'summer collection', id: 'item-123' }, ... },
 * //   isMatch: true,
 * //   params: { category: 'summer collection', id: 'item-123' }
 * // }
 *
 * @example
 * // With object pattern and case sensitivity
 * checkPath(
 *   {
 *     path: '/API/[version]/[endpoint]',
 *     caseSensitive: true,
 *     end: true
 *   },
 *   '/API/v1/users'
 * )
 *
 * @example
 * // With splat parameter
 * checkPath(
 *   '/system/inventory/[id]/in/[inId]/add-items/*',
 *   '/system/inventory/abc123/in/456/add-items/789'
 * )
 * // => {
 * //   originalPath: '/system/inventory/abc123/in/456/add-items/789',
 * //   decodedPath: '/system/inventory/abc123/in/456/add-items/789',
 * //   match: { params: { id: 'abc123', inId: '456', '*': '789' }, ... },
 * //   isMatch: true,
 * //   params: { id: 'abc123', inId: '456', '*': '789' }
 * // }
 *
 * @example
 * // Query string rejected by default (strict mode)
 * checkPath('/users/[id]', '/users/123?tab=profile')
 * // => { isMatch: false, match: null, query: 'tab=profile', hash: null, ... }
 *
 * @example
 * // Query string allowed
 * checkPath('/users/[id]', '/users/123?tab=profile', { allowQuery: true })
 * // => {
 * //   originalPath: '/users/123?tab=profile',
 * //   decodedPath: '/users/123',
 * //   isMatch: true,
 * //   params: { id: '123' },
 * //   query: 'tab=profile',
 * //   hash: null
 * // }
 *
 * @example
 * // Query and hash allowed together
 * checkPath('/users/[id]', '/users/123?tab=a#top', { allowQuery: true, allowHash: true })
 * // => { isMatch: true, params: { id: '123' }, query: 'tab=a', hash: 'top', ... }
 *
 * @example
 * // No match case
 * checkPath('/users/[id]', '/posts/123')
 * // => {
 * //   originalPath: '/posts/123',
 * //   decodedPath: '/posts/123',
 * //   match: null,
 * //   isMatch: false,
 * //   params: undefined,
 * //   query: null,
 * //   hash: null
 * // }
 */
function checkPath(pattern, path, options = {}) {
  const { allowQuery = false, allowHash = false } = options;

  // The fragment starts at the first '#' and runs to the end of the string,
  // so it must be split off before looking for '?' (a '?' after '#' belongs
  // to the fragment, not the query).
  const hashIndex = path.indexOf('#');
  const hash = hashIndex !== -1 ? path.slice(hashIndex + 1) : null;
  const beforeHash = hashIndex !== -1 ? path.slice(0, hashIndex) : path;

  const queryIndex = beforeHash.indexOf('?');
  const query = queryIndex !== -1 ? beforeHash.slice(queryIndex + 1) : null;
  const pathname = queryIndex !== -1 ? beforeHash.slice(0, queryIndex) : beforeHash;

  const decodedPath = decodePath(pathname);

  if ((query !== null && !allowQuery) || (hash !== null && !allowHash)) {
    return {
      originalPath: path,
      decodedPath,
      match: null,
      isMatch: false,
      params: undefined,
      query,
      hash
    };
  }

  const match = matchPath(pattern, decodedPath);

  return {
    originalPath: path,
    decodedPath,
    match,
    isMatch: !!match,
    params: match?.params,
    query,
    hash
  };
}

export default checkPath;
