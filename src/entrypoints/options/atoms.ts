import type { ModelConfigItem } from '@/types/model-config'
import { atom } from 'jotai'

// Dialog state - only manages dialog visibility and editing context
export const configDialogAtom = atom<{
  isOpen: boolean
  mode: 'create' | 'edit'
  config: ModelConfigItem | null
}>({
  isOpen: false,
  mode: 'create',
  config: null,
})
