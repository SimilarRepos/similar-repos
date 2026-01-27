import type { SimilarReposResult } from '@/types/similar-repos'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { buildPrompt } from '@/configs/prompts'
import { createLanguageModel } from '@/utils/model.'

export class SimilarReposService {
  public async generate(
    repoId: string,
    count: number,
    excludeRepoIds?: string[],
  ): Promise<SimilarReposResult> {
    const [model, providerOptions] = await createLanguageModel()

    if (!model) {
      throw new Error(`Not supported model: ${model}`)
    }

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

    const { output } = await generateText({
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

    return output as SimilarReposResult
  }
}
