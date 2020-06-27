module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer',
      ],
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
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ]
};
