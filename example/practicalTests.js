import checkPath from '../checkPath.js';

const routes = [
  {
    pattern: '/system/inventory/[id]/in/[inId]/add-items/*',
    handler: (params) => `Handling inventory ${params.id}, in ${params.inId}, item ${params['*']}`
  },
  {
    pattern: '/users/[userId]/profile',
    handler: (params) => `Showing profile for user ${params.userId}`
  },
  {
    pattern: '/products/[category]/[itemId]',
    handler: (params) => `Showing ${params.itemId} from ${params.category}`
  }
];

export function runPracticalTests() {
  console.log('\n=== PRACTICAL USAGE EXAMPLES ===');

  const testPaths = [
    '/system/inventory/abc123/in/456/add-items/789',
    '/users/john-doe/profile',
    '/products/electronics/laptop-123',
    '/invalid/path'
  ];

  testPaths.forEach((path) => {
    console.log('\nTesting path:', path);

    // Find matching route
    const matchingRoute = routes.find((route) => checkPath(route.pattern, path).isMatch);

    if (matchingRoute) {
      const result = checkPath(matchingRoute.pattern, path);
      console.log('Match found:', JSON.stringify(result, null, 2));
      console.log('Handler result:', matchingRoute.handler(result.params));
    } else {
      console.log('No matching route found');
    }
  });

  // Additional specific test cases
  console.log('\n=== SPECIFIC TEST CASES ===');

  // Test encoded URLs
  const encodedPath = '/products/summer%20collection%2F2023/item%20123';
  console.log('\nEncoded URL Test:');
  console.log('Path:', encodedPath);
  console.log('Result:', JSON.stringify(
    checkPath('/products/[category]/[itemId]', encodedPath),
    null,
    2
  ));

  // Test case sensitive matching
  const caseSensitivePath = '/API/v1/users';
  console.log('\nCase Sensitive Test:');
  console.log('Result:', JSON.stringify(
    checkPath({
      path: '/API/[version]/[endpoint]',
      caseSensitive: true,
      end: true
    }, caseSensitivePath),
    null,
    2
  ));
}
