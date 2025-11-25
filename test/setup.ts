/**
 * @fileoverview Jest setup file
 * Runs before each test suite to configure the testing environment
 */

// Set test environment variables if needed
process.env.NODE_ENV = 'test';

// Configure global test timeouts
jest.setTimeout(10000);

// Add any custom matchers or global test configuration here
// Example:
// expect.extend({
//   customMatcher(received, expected) {
//     // custom matcher implementation
//   }
// });
