import { streamText } from 'ai'
import { buildPrompt } from '@/configs/prompts'
import { logger } from '@/utils/logger'
import { createLanguageModel } from '@/utils/model.'

export class StreamChatService {
  public async generate() {
    const [model, options] = await createLanguageModel()
    if (!model) {
      throw new Error(`Not supported model: ${model}`)
    }

    logger.log(
      `Process using provider: ${model.provider} with model: ${model.modelId}`,
    )

    const messages = [
      {
        role: 'system' as const,
        content: await buildPrompt('temp', {
          context: '',
        }),
      },
      {
        role: 'user' as const,
        content: `\r\n\t${''}`,
      },
    ]

    return await streamText({
      model,
      messages,
      providerOptions: options,
    })
  }
}
