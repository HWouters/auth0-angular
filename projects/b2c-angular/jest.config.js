module.exports = {
  testEnvironment: 'jsdom',
  displayName: 'b2c-angular',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {},
  testMatch: ['<rootDir>/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  transformIgnorePatterns: ['<rootDir>../../node_modules/(?!.*\\.mjs$)'],
  transform: {
    '^.+\\.(ts|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
};
