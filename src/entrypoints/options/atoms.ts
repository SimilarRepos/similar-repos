import type { ModelConfigItem } from '@/types/model-config'
import { atom } from 'jotai'

export const configDialogAtom = atom<{
  isOpen: boolean
  mode: 'create' | 'edit'
  config: ModelConfigItem | null
}>({
  isOpen: false,
  mode: 'create',
  config: null,
})
