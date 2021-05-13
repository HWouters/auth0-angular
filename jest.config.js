module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/projects/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  modulePathIgnorePatterns: ['dist'],
  moduleNameMapper: {
    '^@thecla/auth0-angular/(.*)$': '<rootDir>/dist/auth0-angular/$1',
    '^@thecla/b2c-angular/(.*)$': '<rootDir>/dist/b2c-angular/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
