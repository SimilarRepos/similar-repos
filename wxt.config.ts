import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  imports: false,
  modules: [
    '@wxt-dev/module-react',
    '@wxt-dev/i18n/module',
    '@wxt-dev/analytics/module',
  ],
  vite: ({ mode }) => ({
    build:
      mode === 'development'
        ? {
            sourcemap: true,
            minify: false,
          }
        : {
            sourcemap: false,
            minify: 'terser',
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                passes: 3,
              },
              mangle: {
                reserved: ['chrome', 'window', 'self'],
                toplevel: false,
              },
              format: {
                comments: false,
              },
            },
          },
  }),
  manifest: ({ mode, browser }) => ({
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['storage', 'tabs'],
    host_permissions: [
      'https://www.google-analytics.com/*',
      ...(mode === 'development' ? ['http://localhost:3000/*'] : []),
    ],
    browser_specific_settings: {
      gecko: {
        id: 'similar-repos@robby',
        strict_min_version: '88.0',
        data_collection_permissions: {
          "required": ["none"]
        }
      },
    },
    ...(browser === 'firefox' && {
      content_security_policy: {
        extension_pages:
          'script-src \'self\' \'wasm-unsafe-eval\' \'unsafe-eval\'; object-src \'self\';',
        sandbox:
          'sandbox allow-scripts allow-forms allow-popups allow-modals; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; worker-src \'self\' blob: data:',
      },
    }),
  }),
  dev: {
    server: {
      port: 3030,
    },
  },
})
