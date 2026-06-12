import checkPath from '../checkPath.js';

const queryHashTests = {
  // Default (strict) mode: query string or hash means no match
  strictDefault: {
    pattern: '/users/[id]',
    options: undefined,
    paths: [
      '/users/123',
      '/users/123?tab=profile', // should not match (query not allowed)
      '/users/123#section', // should not match (hash not allowed)
      '/users/123?tab=a#section' // should not match (both present)
    ]
  },

  // allowQuery: query is stripped before matching and returned as result.query
  allowQuery: {
    pattern: '/users/[id]',
    options: { allowQuery: true },
    paths: [
      '/users/123?tab=profile',
      '/users/123?tab=profile&sort=asc',
      '/users/123?redirect=%2Fhome', // encoded value stays raw in result.query
      '/users/123?', // empty query string
      '/users/123', // still matches without query
      '/users/123#section' // should not match (hash still not allowed)
    ]
  },

  // allowHash: hash is stripped before matching and returned as result.hash
  allowHash: {
    pattern: '/users/[id]',
    options: { allowHash: true },
    paths: [
      '/users/123#section',
      '/users/123#', // empty hash
      '/users/123?tab=a#section' // should not match (query still not allowed)
    ]
  },

  // Both allowed
  allowBoth: {
    pattern: '/users/[id]',
    options: { allowQuery: true, allowHash: true },
    paths: [
      '/users/123?tab=profile#section',
      '/users/123#section?weird', // everything after '#' is hash, including '?'
      '/users/123?a=1&b=2#top'
    ]
  },

  // Query/hash combined with splat pattern
  withSplat: {
    pattern: '/blog/[slug]/comments/*',
    options: { allowQuery: true, allowHash: true },
    paths: [
      '/blog/my-post/comments/123?page=2',
      '/blog/my-post/comments?sort=new#latest'
    ]
  },

  // Param names with digits and underscores (regex fix)
  paramNames: {
    pattern: '/items/[item_id]/page/[page2]',
    options: undefined,
    paths: [
      '/items/abc-123/page/2',
      '/items/abc-123/page/' // should not match
    ]
  }
};

export function runQueryHashTests() {
  Object.entries(queryHashTests).forEach(([testName, { pattern, options, paths }]) => {
    console.log(`\n=== ${testName.toUpperCase()} TESTS ===`);
    console.log('Options:', JSON.stringify(options) || 'default');

    paths.forEach((path, index) => {
      console.log(`\nTest ${index + 1}: ${path}`);
      console.log('Result:', JSON.stringify(checkPath(pattern, path, options), null, 2));
    });
  });
}
