import type { ModelConfigItem, ModelProvider } from './model-config'

export interface FormData {
  displayName: string
  provider: ModelProvider | ''
  modelId: string
  apiKey: string
  baseUrl: string
  enabled: boolean
}

export const initialForm: FormData = {
  displayName: '',
  provider: '',
  modelId: '',
  apiKey: '',
  baseUrl: '',
  enabled: true,
}

export function formFromConfig(config: ModelConfigItem): FormData {
  return {
    displayName: config.displayName || '',
    provider: config.provider,
    modelId: config.modelId,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl || '',
    enabled: config.enabled ?? true,
  }
}
