import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      // VSCode extensions commonly use single file for activate/deactivate
      'single-export/single-export': 'off',
      // VSCode API uses namespace imports
      'import/no-namespace': 'off',
      // Disable import/order due to vscode types compatibility issues
      'import/order': 'off',
      // VSCode extension files require complex mocking setup, disable spec requirement
      'ddd/require-spec-file': 'off',
      // Type assertions needed for mocking VSCode APIs in tests
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'TSTypeAssertion:not([typeAnnotation.typeName.name="ExtensionContext"])',
          message: 'Type assertions with "as" are not allowed except for mocking',
        },
      ],
    },
  },
]
