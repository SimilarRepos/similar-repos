import { cn, isDarkMode } from './theme'

export function wrapShadowRootUI(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = cn(
    'text-base antialiased font-sans z-[2147483647]',
    isDarkMode() && 'dark',
  )
  container.append(wrapper)
  return wrapper
}

export function addStyleToShadow(shadow: ShadowRoot) {
  document.head.querySelectorAll('style').forEach((styleEl) => {
    if (styleEl.textContent?.includes('[data-sonner-toaster]')) {
      const shadowHead = shadow.querySelector('head')
      // Clone the style element instead of moving it to preserve the original
      // Otherwise, append api will move the style element to the shadow root and cause the bug
      const clonedStyle = styleEl.cloneNode(true)
      if (shadowHead) {
        shadowHead.append(clonedStyle)
      }
      else {
        shadow.append(clonedStyle)
      }
    }
  })
}
