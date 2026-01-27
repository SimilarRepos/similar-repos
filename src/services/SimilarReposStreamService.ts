import type { SimilarReposStreamItem } from '@/types/similar-repos-stream'
import { Output, streamText } from 'ai'
import { z } from 'zod'
import { buildPrompt } from '@/configs/prompts'
import { logger } from '@/utils/logger'
import { createLanguageModel } from '@/utils/model.'

export class SimilarReposStreamService {
  public async* generate(
    repoId: string,
    count: number,
    excludeRepoIds?: string[],
  ): AsyncGenerator<SimilarReposStreamItem, void, unknown> {
    const [model, providerOptions] = await createLanguageModel()

    if (!model) {
      throw new Error(`Not supported model: ${model}`)
    }

    logger.log(
      `Streaming similar repos using provider: ${model.provider} with model: ${model.modelId}`,
    )

    const messages = [
      {
        role: 'user' as const,
        content: await buildPrompt('recommendRepos', {
          repoId,
          repoCount: count,
          excludeRepos: excludeRepoIds || [],
        }),
      },
    ]

    const { partialOutputStream } = await streamText({
      model,
      output: Output.array({
        element: z.object({
          repoUrl: z.string().describe('Full GitHub URL'),
          repoDesc: z.string().describe('Reason for recommendation'),
        }),
      }),
      messages,
      providerOptions,
    })

    let lastOutput: SimilarReposStreamItem[] = []

    for await (const partialOutput of partialOutputStream) {
      logger.log('Recieved LLM partialOutput', partialOutput)
      if (partialOutput.length > lastOutput.length) {
        // Yield only the new items
        for (let i = lastOutput.length; i < partialOutput.length; i++) {
          yield partialOutput[i] as SimilarReposStreamItem
        }
        lastOutput = [...partialOutput]
      }
    }
  }
}
