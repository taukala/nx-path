import checkPath from '../checkPath.js';

const basicTests = {
  // Basic path matching
  simple: {
    pattern: '/users/[id]',
    paths: [
      '/users/123',
      '/users/abc',
      '/users/', // should not match
      '/users/123/extra' // should not match
    ]
  },

  // Multiple parameters
  multiParam: {
    pattern: '/users/[userId]/posts/[postId]',
    paths: [
      '/users/123/posts/456',
      '/users/abc/posts/def',
      '/users/123/posts/', // should not match
      '/users/123/posts/456/comments' // should not match
    ]
  },

  // Optional trailing parameter
  optionalParam: {
    pattern: '/blog/[slug]/comments/*',
    paths: [
      '/blog/my-post/comments',
      '/blog/my-post/comments/123',
      '/blog/my-post/comments/123/replies'
    ]
  }
};

export function runBasicTests() {
  Object.entries(basicTests).forEach(([testName, { pattern, paths }]) => {
    console.log(`\n=== ${testName.toUpperCase()} TESTS ===`);

    paths.forEach((path, index) => {
      console.log(`\nTest ${index + 1}: ${path}`);
      console.log('Result:', JSON.stringify(checkPath(pattern, path), null, 2));
    });
  });
}
