import type { ModelProvider } from '@/types/model-config'
import type { FormData } from '@/types/model-provider'
import { i18n } from '#imports'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { addModelAtom, updateModelAtom } from '@/configs/model-store'
import { configDialogAtom } from '@/entrypoints/options/atoms'
import { useTestConnection } from '@/hooks/useTestConnection'
import { formFromConfig, initialForm } from '@/types/model-provider'
import { MODEL_PROVIDERS } from '@/types/provider-config'
import { ApiBaseUrl } from './ApiBaseUrl'
import { ApiKeyInput } from './ApiKeyInput'
import { ConfigurationNameInput } from './ConfigurationNameInput'
import { ConnectionTest } from './ConnectionTest'
import { ModelSelector } from './ModelSelector'
import { ProviderSelector } from './ProviderSelector'

export function ConfigDialog() {
  const [{ isOpen, mode, config }, setDialog] = useAtom(configDialogAtom)
  const addModel = useSetAtom(addModelAtom)
  const updateModel = useSetAtom(updateModelAtom)
  const [form, setForm] = useState<FormData>(initialForm)
  const { testing, result, test, reset } = useTestConnection()

  useEffect(() => {
    if (isOpen) {
      setForm(config ? formFromConfig(config) : initialForm)
      reset()
    }
  }, [isOpen, config])

  const isValid
    = form.displayName
      && form.provider
      && form.modelId
      && form.apiKey
      && form.baseUrl

  const close = () =>
    setDialog({ isOpen: false, mode: 'create', config: null })

  const updateForm = (updates: Partial<FormData>) =>
    setForm(prev => ({ ...prev, ...updates }))

  const changeProvider = (providerId: string) => {
    const provider = MODEL_PROVIDERS[providerId as ModelProvider]
    if (!provider)
      return

    updateForm({
      provider: providerId as ModelProvider,
      baseUrl: provider.defaultBaseUrl || '',
      modelId: provider.models[0]?.id || '',
    })
  }

  const submit = async () => {
    if (!isValid || !form.provider)
      return

    if (mode === 'edit' && config) {
      await updateModel({
        id: config.id,
        updates: {
          provider: form.provider,
          modelId: form.modelId,
          apiKey: form.apiKey,
          baseUrl: form.baseUrl,
          displayName: form.displayName,
          enabled: form.enabled,
        },
      })
    }
    else {
      await addModel({
        provider: form.provider,
        modelId: form.modelId,
        apiKey: form.apiKey,
        baseUrl: form.baseUrl,
        displayName: form.displayName,
        enabled: form.enabled,
      })
    }

    close()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && close()}>
      <DialogContent className="p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold">
            {i18n.t(`options.provider.configDialog.title.${mode}`)}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ProviderSelector value={form.provider} onChange={changeProvider} />
          <ConfigurationNameInput
            value={form.displayName}
            onChange={displayName => updateForm({ displayName })}
            required={false}
          />

          <ModelSelector
            providerId={form.provider}
            value={form.modelId}
            onChange={modelId => updateForm({ modelId })}
          />

          <ApiKeyInput
            value={form.apiKey}
            onChange={apiKey => updateForm({ apiKey })}
            required={false}
          />

          <ApiBaseUrl
            value={form.baseUrl}
            onChange={baseUrl => updateForm({ baseUrl })}
          />

          <div className="space-y-2">
            <ConnectionTest
              testResult={result}
              isTesting={testing}
              onTest={() => test(form)}
              disabled={!form.apiKey || !form.baseUrl}
            />
            <p className="text-xs text-muted-foreground">
              {i18n.t('options.provider.configDialog.test.title')}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t px-6 py-4">
          <Button variant="outline" onClick={close}>
            {i18n.t('options.provider.configDialog.cancel')}
          </Button>
          <Button onClick={submit} disabled={!isValid}>
            {i18n.t(`options.provider.configDialog.submit.${mode}`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
