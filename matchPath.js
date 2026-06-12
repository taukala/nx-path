/**
 * Matches a URL pathname against a path pattern using Next.js-style bracket parameters.
 *
 * Modified from react-router's matchPath utility to support [param] syntax instead of :param
 *
 * @param {(string|Object)} pattern - The path pattern to match against
 * @param {string} pathname - The URL pathname to match
 * @returns {Object|null} Match object containing params and path information, or null if no match
 *
 * @example
 * // Basic usage
 * matchPath('/users/[id]/profile', '/users/123/profile')
 * // => {
 * //   params: { id: '123' },
 * //   pathname: '/users/123/profile',
 * //   pathnameBase: '/users/123/profile',
 * //   pattern: { path: '/users/[id]/profile', ... }
 * // }
 *
 * // With splat parameter
 * matchPath('/system/inventory/[id]/in/[inId]/add-items/*',
 *          '/system/inventory/abc123/in/456/add-items/789')
 * // => {
 * //   params: { id: 'abc123', inId: '456', '*': '789' },
 * //   pathname: '/system/inventory/abc123/in/456/add-items/789',
 * //   ...
 * // }
 *
 * // With options
 * matchPath(
 *   {
 *     path: '/users/[id]',
 *     caseSensitive: true,
 *     end: true
 *   },
 *   '/users/123'
 * )
 */
function matchPath(pathPattern, pathname) {
  const isStringPattern = typeof pathPattern === 'string';
  const normalizedPattern = {
    path: isStringPattern ? pathPattern : pathPattern.path,
    caseSensitive: isStringPattern ? false : !!pathPattern.caseSensitive,
    end: isStringPattern ? true : !!pathPattern.end
  };

  const convertedPattern = normalizedPattern.path.replace(/\[([^\]]+)\]/g, ':$1');
  const regexPattern = convertedPattern
    .replace(/:[a-zA-Z0-9_]+/g, '([^/]+)')
    .replace(/\/\*$/, '(?:/(.*))?');
    // .replace(/\*/g, '(.*)');

  const regex = new RegExp(
    `^${regexPattern}${normalizedPattern.end ? '$' : ''}`,
    normalizedPattern.caseSensitive ? '' : 'i'
  );

  const match = pathname.match(regex);
  if (!match) return null;

  const paramNames = [...convertedPattern.matchAll(/:[a-zA-Z0-9_]+/g)]
    .map((matchResult) => matchResult[0].substring(1));

  const params = paramNames.reduce((acc, name, index) => ({
    ...acc,
    [name]: match[index + 1]
  }), {});

  if (convertedPattern.includes('*')) {
    params['*'] = match[match.length - 1] || '';
  }

  const matchedPathname = match[0];

  return {
    params,
    pathname: matchedPathname,
    pathnameBase: matchedPathname.replace(/(.)\/+$/, '$1'),
    pattern: normalizedPattern
  };
}

export default matchPath;
