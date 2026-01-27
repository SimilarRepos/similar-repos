import { browser } from '#imports'

export async function getActiveTabUrl() {
  if (browser.tabs) {
    const tab = await getActiveTab()
    return tab?.url
  }
  else {
    return window.location.href
  }
}

export async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  return tabs[0]
}
