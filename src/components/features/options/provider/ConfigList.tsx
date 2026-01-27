import { i18n } from '#imports'
import { useAtomValue, useSetAtom } from 'jotai'
import { Globe, Plus } from 'lucide-react'
import OptionsLine from '@/components/features/options/OptionsLine'
import { Button } from '@/components/ui/button'
import { modelsAtom } from '@/configs/model-store'
import { configDialogAtom } from '@/entrypoints/options/atoms'
import { useTestConnectionBatch } from '@/hooks/useTestConnection'
import { ConfigCard } from './ConfigCard'

export function ConfigList() {
  const models = useAtomValue(modelsAtom)
  const setDialog = useSetAtom(configDialogAtom)
  const { test, getResult, isTesting } = useTestConnectionBatch()

  const openDialog = () => {
    setDialog({
      isOpen: true,
      mode: 'create',
      config: null,
    })
  }

  return (
    <>
      <OptionsLine>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <span>{i18n.t('options.provider.manageConfigurations.title')}</span>
            <span className="text-xs text-muted-foreground">
              {i18n.t('options.provider.manageConfigurations.description')}
            </span>
          </div>
          <Button onClick={openDialog} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {i18n.t('options.provider.manageConfigurations.addConfig')}
          </Button>
        </div>
      </OptionsLine>

      {models.length === 0
        ? (
            <OptionsLine>
              <div className="flex-1 rounded-lg border-2 border-dashed p-6 text-center text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{i18n.t('options.provider.manageConfigurations.noConfigs')}</p>
                <p className="text-sm mt-1">
                  {i18n.t('options.provider.manageConfigurations.noConfigsHelp')}
                </p>
              </div>
            </OptionsLine>
          )
        : (
            models.map(model => (
              <ConfigCard
                key={model.id}
                configId={model.id}
                testResult={getResult(model.id)}
                isTesting={isTesting(model.id)}
                onTest={() => test(model)}
              />
            ))
          )}
    </>
  )
}
