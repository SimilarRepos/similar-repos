import type { ModelProvider } from '@/types/model-config'
import type { TestConnRequest, TestConnResult } from '@/types/test-model'
import { generateText } from 'ai'
import { TEST_MODEL_CONTENT } from '@/configs/constants'
import { createLanguageModel, createModelBy } from '@/utils/model.'

export class TestModelService {
  public async test(request: TestConnRequest): Promise<TestConnResult> {
    const messages = [
      {
        role: 'user' as const,
        content: TEST_MODEL_CONTENT,
      },
    ]

    // 已有 id
    if (request.configId) {
      const [model, providerOptions] = await createLanguageModel(
        request.configId,
      )

      const { text } = await generateText({
        model,
        messages,
        providerOptions,
      })
      return { data: text }
    }
    else if (request.config) {
      const [model, providerOptions] = await createModelBy(
        request.config.provider as ModelProvider,
        request.config.modelId,
        request.config.baseUrl || '',
        request.config.apiKey,
      )

      const { text } = await generateText({
        model,
        messages,
        providerOptions,
      })
      return { data: text }
    }
    throw new Error('Illegal test request')
  }
}
