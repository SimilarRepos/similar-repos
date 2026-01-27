import type { ModelProvider } from '@/types/model-config'
import { i18n } from '#imports'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MODEL_PROVIDERS } from '@/types/provider-config'

interface ProviderSelectorProps {
  value: ModelProvider | ''
  onChange: (provider: ModelProvider) => void
}

export function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="space-y-2 flex items-center justify-between">
      <Label>{i18n.t('options.provider.fields.provider')}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="hover:bg-input  bg-background border-1 min-w-50">
          <SelectValue
            placeholder={i18n.t(
              'options.provider.fields.placeholders.selectProvider',
            )}
          />
        </SelectTrigger>
        <SelectContent>
          {Object.values(MODEL_PROVIDERS).map(provider => (
            <SelectItem key={provider.id} value={provider.id}>
              <div className="flex items-center gap-2">
                <img className="size-4" src={provider.icon} />
                {provider.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
