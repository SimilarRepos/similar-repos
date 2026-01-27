import type { TestResult } from '@/types/test-model'
import { i18n } from '#imports'
import { useAtomValue, useSetAtom } from 'jotai'
import { Edit, Key, Server, Trash2, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { EVENTS } from '@/configs/events'
import {
  activeModelIdAtom,
  deleteModelAtom,
  modelsAtom,
  writeActiveModelIdAtom,
} from '@/configs/model-store'
import { configDialogAtom } from '@/entrypoints/options/atoms'
import { MODEL_PROVIDERS } from '@/types/provider-config'
import { track } from '@/utils/events'
import { cn } from '@/utils/theme'
import { ConnectionTestMini } from './ConnectionTestMini'

interface ConfigCardProps {
  configId: string
  testResult?: TestResult
  isTesting?: boolean
  onTest?: () => void
}

export function ConfigCard({
  configId,
  testResult,
  isTesting,
  onTest,
}: ConfigCardProps) {
  const models = useAtomValue(modelsAtom)
  const activeId = useAtomValue(activeModelIdAtom)
  const setActiveId = useSetAtom(writeActiveModelIdAtom)
  const setDialog = useSetAtom(configDialogAtom)
  const deleteModel = useSetAtom(deleteModelAtom)

  const config = models.find(m => m.id === configId)
  if (!config)
    return null

  const isActive = configId === activeId
  const provider = MODEL_PROVIDERS[config.provider]

  const handleEdit = () => {
    setDialog({
      isOpen: true,
      mode: 'edit',
      config,
    })
  }

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!confirm(i18n.t('options.provider.alert.deleteConfirm')))
      return
    await deleteModel(configId)
  }

  const handleSetActive = async () => {
    await setActiveId(configId)
    track(EVENTS.OPTIONS.CHANGE_MODEL, {
      provider: config.provider,
      modelId: config.modelId,
      source: 'list',
    })
  }

  return (
    <div
      className={cn(
        'p-4 mx-4 my-1 border rounded-lg transition-all',
        isActive
          ? 'border-primary border bg-primary/5'
          : 'border-border grip-background',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center mr-3">
          <input
            type="radio"
            name="active-config"
            checked={isActive}
            onChange={handleSetActive}
            className="appearance-none size-4 rounded-full border checked:border-primary/30 checked:ring-2 checked:ring-inset checked:ring-white cursor-pointer transition-all border-gray-300 bg-background checked:bg-primary"
          />
        </div>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Server className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-semibold text-sm truncate max-w-36"
                title={config.displayName || provider?.name}
              >
                {config.displayName || provider?.name}
              </h3>
              <Badge variant="outline" className="border border-current">
                <img className="size-3" src={provider.icon} />
                {provider?.name}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div className="flex items-center gap-1">
                <Wand2 className="h-3 w-3" />
                <span className="truncate">{config.modelId}</span>
              </div>
              <div className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                <span className="flex items-center">
                  <span
                    className={cn(
                      'inline-block w-1.5 h-1.5 rounded-full mr-1',
                      config.apiKey ? 'bg-green-500' : 'bg-red-500',
                    )}
                  />
                  {config.apiKey
                    ? i18n.t('options.provider.status.configured')
                    : i18n.t('options.provider.configCard.noApiKey')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {onTest && (
            <Button
              onClick={onTest}
              disabled={isTesting}
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
            >
              {isTesting
                ? (
                    <span className="flex items-center">
                      <Spinner className="mr-1 size-4" />
                      <span>{i18n.t('options.provider.status.testing')}</span>
                    </span>
                  )
                : (
                    i18n.t('options.provider.status.test')
                  )}
            </Button>
          )}
          <Button
            onClick={handleEdit}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            onClick={handleDelete}
            size="sm"
            variant="ghost"
            className="size-7 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {testResult && (
        <ConnectionTestMini
          isTesting={!!isTesting}
          testResult={testResult}
          className="mt-2"
        />
      )}
    </div>
  )
}
