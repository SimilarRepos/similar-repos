import type { ModelConfigData, ModelConfigs } from '@/types/model-config'
import { storage } from '#imports'
import deepmerge from 'deepmerge'
import { atom } from 'jotai'
import { nanoid8 } from '@/utils/nanoid'
import { STORAGE_KEYS } from './constants'
import { promptTemplates } from './prompts'

export const DEFAULT_MODEL_CONFIG: ModelConfigs = {
  version: 1,
  data: {
    models: [],
    enabled: true,
    similarCount: 3,
  },
}

const MODEL_CONFIG_STORAGE_KEY = STORAGE_KEYS.MODEL_CONFIGS

export const modelConfigAtom = atom<ModelConfigs>(DEFAULT_MODEL_CONFIG)
const overwriteMerge = (_target: unknown[], source: unknown[]) => source
let isStoredConfigLoaded = false
let storedConfigPromise: Promise<ModelConfigs> | null = null

const storageAdapter = {
  async get<T>(key: string, fallback: T): Promise<T> {
    const value = await storage.getItem<T>(`local:${key}`)
    return value ?? fallback
  },

  async set<T>(key: string, value: T): Promise<void> {
    await storage.setItem(`local:${key}`, value)
  },

  watch<T>(key: string, callback: (newValue: T) => void): () => void {
    const unwatch = storage.watch<T>(`local:${key}`, (newValue) => {
      if (newValue !== null)
        callback(newValue)
    })
    return unwatch
  },
}

// 写入配置 Atom
const writeModelConfigAtom = atom(
  null,
  async (get, set, patch: Partial<ModelConfigs>) => {
    if (!isStoredConfigLoaded && !storedConfigPromise) {
      storedConfigPromise = storageAdapter.get<ModelConfigs>(
        MODEL_CONFIG_STORAGE_KEY,
        DEFAULT_MODEL_CONFIG,
      )
    }

    if (storedConfigPromise) {
      const storedConfig = await storedConfigPromise
      isStoredConfigLoaded = true

      const currentConfig = get(modelConfigAtom)
      const baseConfig
        = currentConfig === DEFAULT_MODEL_CONFIG
          && storedConfig !== DEFAULT_MODEL_CONFIG
          ? storedConfig
          : currentConfig

      const next = deepmerge(baseConfig, patch, {
        arrayMerge: overwriteMerge,
      }) as ModelConfigs

      // 更新版本号
      next.version = (baseConfig.version || 1) + 1

      set(modelConfigAtom, next)
      await storageAdapter.set(MODEL_CONFIG_STORAGE_KEY, next)
    }
    else {
      // 备用方案
      const currentConfig = get(modelConfigAtom)
      const next = deepmerge(currentConfig, patch, {
        arrayMerge: overwriteMerge,
      }) as ModelConfigs

      next.version = (currentConfig.version || 1) + 1

      set(modelConfigAtom, next)
      await storageAdapter.set(MODEL_CONFIG_STORAGE_KEY, next)
    }
  },
)

modelConfigAtom.onMount = (setAtom: (newValue: ModelConfigs) => void) => {
  storedConfigPromise = storageAdapter.get<ModelConfigs>(
    MODEL_CONFIG_STORAGE_KEY,
    DEFAULT_MODEL_CONFIG,
  )

  storedConfigPromise.then((config) => {
    isStoredConfigLoaded = true
    setAtom(config)
  })

  // 监听其他标签页的变化
  const unwatch = storageAdapter.watch<ModelConfigs>(
    MODEL_CONFIG_STORAGE_KEY,
    setAtom,
  )

  return unwatch
}

// ==================== 派生 Atoms ====================

export const modelsAtom = atom(
  get => get(modelConfigAtom).data.models,
  async (get, set, models: ModelConfigData['models']) => {
    const currentConfig = get(modelConfigAtom)
    await set(writeModelConfigAtom, {
      data: {
        models,
        enabled: currentConfig.data.enabled,
        similarCount: currentConfig.data.similarCount,
      },
    })
  },
)

const activeModelId = STORAGE_KEYS.ACTIVE_MODEL_ID

export const activeModelIdAtom = atom<string>('')
activeModelIdAtom.onMount = (setAtom) => {
  storageAdapter.get<string>(activeModelId, '').then(setAtom)
  return storageAdapter.watch<string>(activeModelId, setAtom)
}

export const writeActiveModelIdAtom = atom(
  get => get(activeModelIdAtom),
  async (_get, set, id: string) => {
    set(activeModelIdAtom, id)
    await storageAdapter.set(activeModelId, id)
  },
)

export const activeModelAtom = atom((get) => {
  const models = get(modelsAtom)
  const activeId = get(activeModelIdAtom)
  return models.find(m => m.id === activeId) || null
})

export const enabledModelsAtom = atom((get) => {
  const models = get(modelsAtom)
  return models.filter(m => m.enabled)
})

// ==================== 便捷操作 Atoms ====================

export const configEnabledAtom = atom(
  get => get(modelConfigAtom).data.enabled,
  async (get, set, enabled: boolean) => {
    const currentConfig = get(modelConfigAtom)
    await set(writeModelConfigAtom, {
      data: {
        ...currentConfig.data,
        enabled,
      },
    })
  },
)

export const configSimilarCountAtom = atom(
  get => get(modelConfigAtom).data.similarCount,
  async (get, set, similarCount: number) => {
    const currentConfig = get(modelConfigAtom)
    await set(writeModelConfigAtom, {
      data: {
        ...currentConfig.data,
        similarCount,
      },
    })
  },
)

export const customPromptAtom = atom<string>('')
customPromptAtom.onMount = (setAtom) => {
  storageAdapter.get<string>(STORAGE_KEYS.CUSTOM_PROMPT, '').then((prompt) => {
    // 如果没有自定义 prompt，使用默认 prompt
    if (!prompt) {
      setAtom(promptTemplates.recommendRepos || '')
    }
    else {
      setAtom(prompt)
    }
  })
  return storageAdapter.watch<string>(STORAGE_KEYS.CUSTOM_PROMPT, setAtom)
}

export const writeCustomPromptAtom = atom(
  get => get(customPromptAtom),
  async (_get, set, prompt: string) => {
    set(customPromptAtom, prompt)
    await storageAdapter.set(STORAGE_KEYS.CUSTOM_PROMPT, prompt)
  },
)

export const addModelAtom = atom(
  null,
  async (
    get,
    set,
    model: Omit<ModelConfigData['models'][0], 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const models = get(modelsAtom)
    const newModel = {
      ...model,
      id: `${nanoid8()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await set(modelsAtom, [...models, newModel])
  },
)

export const updateModelAtom = atom(
  null,
  async (
    get,
    set,
    {
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<ModelConfigData['models'][0], 'id' | 'createdAt'>>
    },
  ) => {
    const models = get(modelsAtom)
    const updated = models.map(m =>
      m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m,
    )
    await set(modelsAtom, updated)
  },
)

export const deleteModelAtom = atom(null, async (get, set, id: string) => {
  const models = get(modelsAtom)
  const filtered = models.filter(m => m.id !== id)
  await set(modelsAtom, filtered)

  // 如果删除的是激活模型，清空激活状态
  const activeId = get(activeModelIdAtom)
  if (activeId === id) {
    await set(writeActiveModelIdAtom, '')
  }
})

export const toggleModelAtom = atom(null, async (get, set, id: string) => {
  const models = get(modelsAtom)
  const updated = models.map(m =>
    m.id === id ? { ...m, enabled: !m.enabled, updatedAt: Date.now() } : m,
  )
  await set(modelsAtom, updated)
})
