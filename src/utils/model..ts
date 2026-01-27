import type { ModelProvider } from '@/types/model-config'
import { CLIENT_CREATOR_MAPPER } from '@/configs/model-client'
import { getActiveModel, getByConfigId } from './storage'

export async function createLanguageModel(testModelConfigId?: string) {
  let modelItem

  if (testModelConfigId) {
    modelItem = await getByConfigId(testModelConfigId)
  }
  else {
    modelItem = await getActiveModel()
  }

  if (!modelItem?.provider) {
    return []
  }

  const clientConfig = CLIENT_CREATOR_MAPPER[modelItem.provider] as Record<
    string,
    any
  >
  const provider = clientConfig.creator({
    name: modelItem.provider,
    baseURL: modelItem.baseUrl ?? '',
    ...(modelItem.apiKey && { apiKey: modelItem.apiKey }),
    ...(clientConfig.headers && { headers: clientConfig.headers }),
    ...(clientConfig.fetch && { fetch: clientConfig.fetch }),
  })

  return [
    provider.languageModel(modelItem.modelId),
    { [modelItem.modelId]: provider.options },
  ]
}

export async function createModelBy(
  modelProvider: ModelProvider,
  modelId: string,
  baseUrl: string,
  apiKey: string,
) {
  const clientConfig = CLIENT_CREATOR_MAPPER[modelProvider] as Record<
    string,
    any
  >
  const provider = clientConfig.creator({
    name: modelProvider,
    baseURL: baseUrl ?? '',
    ...(apiKey && { apiKey }),
    ...(clientConfig.headers && { headers: clientConfig.headers }),
    ...(clientConfig.fetch && { fetch: clientConfig.fetch }),
  })

  return [provider.languageModel(modelId), { [modelId]: provider.options }]
}
