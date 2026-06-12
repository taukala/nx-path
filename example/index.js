import { runBasicTests } from './basicTests.js';
import { runAdvanceTests } from './advanceTests.js';
import { runPracticalTests } from './practicalTests.js';
import { runQueryHashTests } from './queryHashTests.js';

const runTests = () => {
  runBasicTests();
  runAdvanceTests();
  runPracticalTests();
  runQueryHashTests();
};

export default runTests;

runTests();
