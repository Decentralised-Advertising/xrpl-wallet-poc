const path = require('path');
const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  /**
   * We have had to create a custom extension to the default jsdom environment
   */
  testEnvironment: path.resolve('tools/utils/custom-jsdom-jest-env.js'),
};
