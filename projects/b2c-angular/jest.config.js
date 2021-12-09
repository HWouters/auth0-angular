module.exports = {
  displayName: 'b2c-angular',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
    },
  },
  transform: { '^.+\\.(ts|mjs|html)$': 'ts-jest' },
  testMatch: ['<rootDir>/**/*.spec.ts'],
};
