module.exports = {
  displayName: 'auth0-angular',
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
