import { browser, i18n } from '#imports'
import { RefreshCw, Settings } from 'lucide-react'
import { EVENTS } from '@/configs/events'
import { track } from '@/utils/events'
import { sendMessage } from '@/utils/messaging'

interface SimilarReposHeaderProps {
  onRefresh?: () => void
}

export function SimilarReposHeader({ onRefresh }: SimilarReposHeaderProps) {
  const handleSettingsClick = () => {
    const optionsUrl = browser.runtime.getURL('/options.html')
    sendMessage('openPage', { url: optionsUrl, active: true })
    track(EVENTS.CONTENT_SCRIPT.OPEN_OPTIONS)
  }

  const handleRefreshClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <div className="flex items-center justify-between pb-3">
      <h2 className="text-lg font-semibold">
        {i18n.t('host.similarRepos.header.title')}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={handleRefreshClick}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          title={i18n.t('host.similarRepos.header.refresh')}
        >
          <RefreshCw className="size-4 opacity-70 hover:opacity-100" />
        </button>
        <button
          onClick={handleSettingsClick}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          title={i18n.t('host.similarRepos.header.settings')}
        >
          <Settings className="size-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </div>
  )
}
