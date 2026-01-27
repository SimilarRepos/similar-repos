import antfu from '@antfu/eslint-config'

const antfuConfig = {
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',
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
  ignores: ['public/interceptor.js'],
}).append({
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/no-context-provider': 'off', // Disable React 19 context provider syntax rule
    // vitest rule - use antfu built-in test/* prefix
    'test/consistent-test-it': 'error',
    'test/no-identical-title': 'error',
    'test/prefer-hooks-on-top': 'error',
  },
})

export default config
