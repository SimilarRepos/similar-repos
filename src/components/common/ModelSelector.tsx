import { i18n } from '#imports'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  activeModelIdAtom,
  enabledModelsAtom,
  writeActiveModelIdAtom,
} from '@/configs/model-store'
import { MODEL_PROVIDERS } from '@/types/provider-config'
import { cn } from '@/utils/theme'

export function ModelSelector({
  className,
  size = 'sm',
  addCustomModelHelp,
  onChange,
}: {
  className?: string
  size?: 'sm' | 'default'
  addCustomModelHelp: string
  onChange?: (provider: string, modelId: string) => void
}) {
  const customModels = useAtomValue(enabledModelsAtom)
  const setActiveModelId = useSetAtom(writeActiveModelIdAtom)
  const activeModelId = useAtomValue(activeModelIdAtom)
  const [isOpen, setOpen] = useState(false)

  const handleModelChange = async (modelId: string) => {
    const actualId = modelId
    await setActiveModelId(actualId)
    const selectedModel = customModels.find(m => m.id === actualId)
    if (selectedModel?.displayName) {
      // eslint-disable-next-line no-console
      console.log('Switched to custom model:', selectedModel.displayName)
      onChange?.(selectedModel.provider, selectedModel.modelId)
    }
  }

  const getProviderIcon = (providerId: string) => {
    return (
      MODEL_PROVIDERS[providerId as keyof typeof MODEL_PROVIDERS]?.icon || '🔌'
    )
  }

  return (
    <Select
      value={activeModelId ? `${activeModelId}` : `${''}`}
      onValueChange={handleModelChange}
      open={isOpen}
      onOpenChange={() => setOpen(true)}
    >
      <SelectTrigger
        id="model-select"
        className={cn(
          'px-2 py-1 text-sm cursor-pointer  hover:bg-input  bg-background border-1 text-muted-foreground',
          className,
        )}
        size={size}
        onClick={() => setOpen(!isOpen)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          setOpen(false)
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault()
          setOpen(false)
        }}
      >
        <SelectGroup>
          <SelectLabel>{i18n.t('options.model.customModels')}</SelectLabel>
          {customModels.length > 0
            ? (
                customModels.map(model => (
                  <SelectItem key={`${model.id}`} value={`${model.id}`}>
                    <div className="flex items-center gap-2">
                      <img
                        className="size-4"
                        src={getProviderIcon(model.provider)}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium max-w-28 truncate">{`${model.displayName}`}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))
              )
            : (
                <SelectItem disabled value="no-custom-models" className="pr-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground/70">
                      {addCustomModelHelp}
                    </span>
                  </div>
                </SelectItem>
              )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
