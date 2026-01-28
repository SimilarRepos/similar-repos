import { i18n } from '#imports'

import { useAtom } from 'jotai'
import OptionsLine from '@/components/features/options/OptionsLine'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  configEnabledAtom,
  configSimilarCountAtom,
} from '@/configs/model-store'

export default function GeneralPage() {
  const [enabled, setEnabled] = useAtom(configEnabledAtom)
  const [similarCount, setSimilarCount] = useAtom(configSimilarCountAtom)

  const handleSimilarCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!Number.isNaN(value) && value >= 1 && value <= 1000) {
      setSimilarCount(value)
    }
  }

  return (
    <div className="flex flex-col">
      <OptionsLine>
        <span className="text-sm font-medium">
          {i18n.t('options.general.enableExtension')}
        </span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </OptionsLine>
      <OptionsLine>
        <span className="text-sm font-medium">
          {i18n.t('options.general.similarReposCount')}
        </span>
        <Input
          type="number"
          min="1"
          max="1000"
          value={similarCount}
          onChange={handleSimilarCountChange}
          className="w-20 h-8 text-center"
        />
      </OptionsLine>
    </div>
  )
}
