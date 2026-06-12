/* eslint-disable no-unused-vars */
/**
 * Path utilities for handling URL paths and pattern matching.
 *
 * Based on react-router utilities but modified to support Next.js-style [param] syntax
 * and specific use cases
 */

/**
 * A path pattern with matching options.
 */
export interface PathPattern {
  /** The path pattern, e.g. '/users/[id]' or '/files/*' */
  path: string;
  /** Whether to match case sensitively. Default: false */
  caseSensitive?: boolean;
  /** Whether the pattern must match to the end of the path. Default: true */
  end?: boolean;
}

/**
 * Extracted path parameters. Bracket params are keyed by name;
 * a trailing splat is keyed by '*'.
 */
export type PathParams = Record<string, string>;

/**
 * The result of a successful match.
 */
export interface PathMatch {
  /** The extracted parameters, e.g. { id: '123', '*': 'a/b' } */
  params: PathParams;
  /** The portion of the pathname that was matched */
  pathname: string;
  /** The matched pathname without trailing slashes */
  pathnameBase: string;
  /** The normalized pattern used for matching */
  pattern: Required<PathPattern>;
}

/**
 * Options for checkPath.
 */
export interface CheckPathOptions {
  /**
   * Whether a query string (?key=value) is allowed in the path.
   * When true it is stripped before matching and returned as result.query.
   * When false a path containing '?' never matches.
   * Default: false
   */
  allowQuery?: boolean;
  /**
   * Whether a hash fragment (#section) is allowed in the path.
   * When true it is stripped before matching and returned as result.hash.
   * When false a path containing '#' never matches.
   * Default: false
   */
  allowHash?: boolean;
}

/**
 * The result of checkPath.
 */
export interface CheckPathResult {
  /** The original input path, untouched */
  originalPath: string;
  /** The decoded pathname (query/hash excluded) */
  decodedPath: string;
  /** The match object, or null if no match */
  match: PathMatch | null;
  /** Whether the path matches the pattern */
  isMatch: boolean;
  /** The extracted parameters, or undefined if no match */
  params: PathParams | undefined;
  /** The raw query string without the leading '?', or null if none */
  query: string | null;
  /** The hash fragment without the leading '#', or null if none */
  hash: string | null;
}

/**
 * Checks if a given path matches a pattern by first decoding the path and then
 * matching it against the pattern.
 *
 * By default the path must be a clean pathname: if it contains a query string (?)
 * or hash fragment (#), the result is isMatch: false. Use the allowQuery / allowHash
 * options to accept such paths.
 *
 * @example
 * checkPath('/users/[id]', '/users/123')
 * // => { isMatch: true, params: { id: '123' }, query: null, hash: null, ... }
 *
 * @example
 * checkPath('/users/[id]', '/users/123?tab=a', { allowQuery: true })
 * // => { isMatch: true, params: { id: '123' }, query: 'tab=a', ... }
 */
export function checkPath(
  pattern: string | PathPattern,
  path: string,
  options?: CheckPathOptions
): CheckPathResult;

/**
 * Matches a URL pathname against a path pattern using Next.js-style bracket
 * parameters. No decoding or query/hash handling.
 *
 * @example
 * matchPath('/users/[id]/profile', '/users/123/profile')
 * // => { params: { id: '123' }, pathname: '/users/123/profile', ... }
 */
export function matchPath(
  pattern: string | PathPattern,
  pathname: string
): PathMatch | null;

/**
 * Decodes a URL path by handling percent-encoded characters while preserving
 * forward slashes (%2F stays encoded). Returns the input unchanged if it
 * contains a malformed percent encoding.
 *
 * @example
 * decodePath('/products/summer%20collection')
 * // => '/products/summer collection'
 */
export function decodePath(value: string): string;
