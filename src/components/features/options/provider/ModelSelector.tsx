import type { ModelProvider } from '@/types/model-config'
import { i18n } from '#imports'
import { useMemo, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getProviderModels } from '@/types/provider-config'

interface ModelSelectorProps {
  providerId: ModelProvider | ''
  value: string
  onChange: (modelId: string) => void
}

export function ModelSelector({
  providerId,
  value,
  onChange,
}: ModelSelectorProps) {
  const models = useMemo(
    () => (providerId ? getProviderModels(providerId) : []),
    [providerId],
  )
  const isCustomModel = useMemo(() => {
    if (!value)
      return false
    return !models.some(model => model.id === value)
  }, [value, models])

  const [useCustomModel, setUseCustomModel] = useState(isCustomModel)

  return (
    <div className="space-y-1">
      {useCustomModel
        ? (
            <div className="flex items-center justify-between">
              <Label>{i18n.t('options.provider.fields.model')}</Label>
              <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={i18n.t(
                  'options.provider.fields.placeholders.customModel',
                )}
                className="w-[200px]"
              />
            </div>
          )
        : (
            <div className="flex items-center justify-between">
              <Label>{i18n.t('options.provider.fields.model')}</Label>
              <Select value={value} onValueChange={onChange} disabled={!providerId}>
                <SelectTrigger className="hover:bg-input  bg-background border-1 min-w-50">
                  <SelectValue
                    placeholder={i18n.t(
                      'options.provider.fields.placeholders.selectModel',
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
      <div className="flex items-center gap-2 justify-end pr-6 pt-2">
        <Checkbox
          id="custom-model"
          checked={!!useCustomModel}
          onCheckedChange={(checked) => {
            setUseCustomModel(checked as boolean)
            if (!checked) {
              onChange(models[0]?.id || '')
            }
          }}
        />
        <label
          htmlFor="custom-model"
          className="text-sm font-medium cursor-pointer"
        >
          {i18n.t('options.provider.fields.customModel')}
        </label>
      </div>
    </div>
  )
}
