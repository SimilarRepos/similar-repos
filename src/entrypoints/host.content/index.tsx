import { createShadowRootUi, defineContentScript } from '#imports'
import { Provider as JotaiProvider } from 'jotai'
import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { APP_NAME } from '@/configs/constants'
import { addStyleToShadow, wrapShadowRootUI } from '@/utils/dom'
import App from './App'
import { defaultStore } from './atoms'
import '@/assets/tailwind/theme.css'

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: `${APP_NAME}-host`,
      position: 'overlay',
      anchor: 'body',
      append: 'last',
      onMount: (container, shadow, _shadowHost) => {
        const wrapper = wrapShadowRootUI(container)
        addStyleToShadow(shadow)
        const root = ReactDOM.createRoot(wrapper)
        root.render(
          <React.StrictMode>
            <JotaiProvider store={defaultStore}>
              <App />
            </JotaiProvider>
          </React.StrictMode>,
        )
        return root
      },
      onRemove: (root) => {
        root?.unmount()
      },
    })

    ui.mount()
  },
})
