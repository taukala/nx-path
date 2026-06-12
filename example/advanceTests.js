import checkPath from '../checkPath.js';

const advanceTests = {
  // Inventory paths with multiple parameters
  inventory: {
    pattern: '/system/inventory/[id]/in/[inId]/add-items/*',
    paths: [
      '/system/inventory/cjld2cjxh0000qzrmn831i7rn/in/1/add-items',
      '/system/inventory/abc123/in/2/add-items/3',
      '/system/inventory/test-id/in/456/add-items/789/details',
      '/system/inventory/wrong/path' // should not match
    ]
  },

  // Encoded paths
  encoded: {
    pattern: '/products/[category]/[id]',
    paths: [
      '/products/summer%20collection/item-123',
      '/products/winter%2Ffall/item-456',
      '/products/special%26items/item-789'
    ]
  },

  // Case sensitivity test
  caseSensitive: {
    pattern: {
      path: '/API/[version]/[endpoint]',
      caseSensitive: true,
      end: true
    },
    paths: [
      '/API/v1/users',
      '/api/v1/users', // should not match with caseSensitive
      '/API/v2/posts'
    ]
  }
};

export function runAdvanceTests() {
  Object.entries(advanceTests).forEach(([testName, { pattern, paths }]) => {
    console.log(`\n=== ${testName.toUpperCase()} TESTS ===`);

    paths.forEach((path, index) => {
      console.log(`\nTest ${index + 1}: ${path}`);
      console.log('Result:', JSON.stringify(checkPath(pattern, path), null, 2));
    });
  });
}
