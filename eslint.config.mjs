import antfu from '@antfu/eslint-config'

const antfuConfig = {
  formatters: {
    css: true,
    html: true,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'no-inner-declarations': 'error',
  },
}

function createConfig(additionalOptions = {}) {
  return antfu({
    ...antfuConfig,
    ...additionalOptions,
  })
}

const config = createConfig({
  react: true,
}).append(
  {
    ignores: ['**/*.md'],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
      'react/no-context-provider': 'off',
      'test/consistent-test-it': 'error',
      'test/no-identical-title': 'error',
      'test/prefer-hooks-on-top': 'error',
    },
  },
)

export default config
