/**
 * Path utilities for handling URL paths and pattern matching.
 *
 * Based on react-router utilities but modified to support Next.js-style [param] syntax
 * and specific use cases
 *
 * @module utils/nx-path
 */

export { default as decodePath } from './decodePath.js';
export { default as matchPath } from './matchPath.js';
export { default as checkPath } from './checkPath.js';
