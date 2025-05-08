const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};