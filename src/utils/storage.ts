import type {
  ModelConfigData,
  ModelConfigItem,
  ModelConfigs,
} from '@/types/model-config'
import { storage } from '#imports'
import { STORAGE_KEYS } from '../configs/constants'

export async function getModelConfigs(): Promise<ModelConfigData['models']> {
  const config = await storage.getItem<ModelConfigs>(
    `local:${STORAGE_KEYS.MODEL_CONFIGS}`,
  )
  return config?.data.models || []
}

export async function getActiveModelId(): Promise<string> {
  return (
    (await storage.getItem<string>(`local:${STORAGE_KEYS.ACTIVE_MODEL_ID}`))
    || ''
  )
}

export async function getPrompt(): Promise<string> {
  return (
    (await storage.getItem<string>(`local:${STORAGE_KEYS.CUSTOM_PROMPT}`)) || ''
  )
}

export async function getActiveModel(): Promise<ModelConfigItem | null> {
  const [models, activeId] = await Promise.all([
    getModelConfigs(),
    getActiveModelId(),
  ])
  return activeId ? models.find(m => m.id === activeId) || null : null
}

export async function getByConfigId(
  id: string,
): Promise<ModelConfigItem | null> {
  const models = await getModelConfigs()
  for (const m of models) {
    if (m.id === id) {
      return m
    }
  }
  return null
}
