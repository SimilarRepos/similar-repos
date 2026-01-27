import { i18n } from '#imports'
import { useAtomValue } from 'jotai'
import OptionsLine from '@/components/features/options/OptionsLine'
import { activeModelAtom } from '@/configs/model-store'
import { MODEL_PROVIDERS } from '@/types/provider-config'
import { cn } from '@/utils/theme'

export function ActiveConfigDetails() {
  const config = useAtomValue(activeModelAtom)

  if (!config) {
    return <div className="hidden" />
  }

  return (
    <div className="flex flex-col">
      <OptionsLine>
        <div>{i18n.t('options.provider.activeConfig.title')}</div>
      </OptionsLine>
      <OptionsLine>
        <div className="flex flex-1 flex-col gap-2 text-sm p-4 bg-card border rounded-lg mx-4">
          <div className="flex items-center gap-4 ">
            <div>
              <strong className="text-muted-foreground">
                {i18n.t('options.provider.activeConfig.provider')}
              </strong>
              <span className="ml-2">
                {MODEL_PROVIDERS[config.provider]?.name}
              </span>
            </div>
            <div>
              <strong className="text-muted-foreground">
                {i18n.t('options.provider.activeConfig.model')}
              </strong>
              <span className="ml-2">{config.modelId}</span>
            </div>
            <div>
              <strong className="text-muted-foreground">
                {i18n.t('options.provider.activeConfig.apiKey')}
              </strong>
              <span
                className={cn(
                  'ml-2',
                  config.apiKey ? 'text-green-600' : 'text-red-600',
                )}
              >
                {config.apiKey
                  ? i18n.t('options.provider.status.configured')
                  : i18n.t('options.provider.status.notConfigured')}
              </span>
            </div>
          </div>
          <div>
            <strong className="text-muted-foreground">
              {i18n.t('options.provider.activeConfig.endpoint')}
            </strong>
            <span className="ml-2 text-muted-foreground">
              {config.baseUrl
                || MODEL_PROVIDERS[config.provider]?.defaultBaseUrl}
            </span>
          </div>
        </div>
      </OptionsLine>
    </div>
  )
}
