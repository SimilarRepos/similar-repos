import { i18n } from '#imports'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function ApiKeyInput({
  value,
  onChange,
  required = true,
}: ApiKeyInputProps) {
  return (
    <div className="flex items-center justify-between">
      <Label>
        {i18n.t('options.provider.fields.apiKey')}
        {required && (
          <span className="text-destructive ml-1">
            {i18n.t('options.provider.validation.required')}
          </span>
        )}
      </Label>
      <Input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={i18n.t('options.provider.fields.placeholders.apiKey')}
        required={required}
        className="w-50"
      />
    </div>
  )
}
