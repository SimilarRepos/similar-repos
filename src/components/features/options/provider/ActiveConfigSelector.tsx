import { i18n } from '#imports'
import { ModelSelector } from '@/components/common/ModelSelector'
import OptionsLine from '@/components/features/options/OptionsLine'
import { EVENTS } from '@/configs/events'
import { track } from '@/utils/events'

export function ActiveConfigSelector() {
  return (
    <OptionsLine>
      <span>{i18n.t('options.provider.label')}</span>
      <ModelSelector
        size="default"
        addCustomModelHelp={i18n.t('options.provider.addCustomModelsHelp')}
        onChange={(provider, modelId) =>
          track(EVENTS.OPTIONS.CHANGE_MODEL, {
            provider,
            modelId,
            source: 'dropdown',
          })}
      />
    </OptionsLine>
  )
}
