import { useEffect, useState } from 'react'

export function useElement(selector: string, parent = document.body) {
  const [element, setElement] = useState<Element | null>(() =>
    document.querySelector(selector),
  )

  useEffect(() => {
    const checkForUpdates = () => {
      const current = document.querySelector(selector)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setElement(current)
    }

    checkForUpdates()

    const observer = new MutationObserver(checkForUpdates)

    observer.observe(parent, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [selector, parent])

  return element
}
