import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOllama } from 'ollama-ai-provider-v2'

export const CLIENT_CREATOR_MAPPER = {
  volcengine: {
    creator: createDeepSeek,
    fetch: async (url: string, options: Record<string, any>) => {
      if (options?.body) {
        const body = JSON.parse(options.body as string)
        // 暂时无法通过ai-sdk 添加此参数，只对豆包模型添加 thinking 参数
        if (body.model && body.model.includes('doubao')) {
          Object.assign(body, { thinking: { type: 'disabled' } })
        }
        options.body = JSON.stringify(body)
      }
      return await fetch(url, options)
    },
  },
  openrouter: {
    creator: createOpenRouter,
  },
  openai: {
    creator: createOpenAI,
  },
  deepseek: {
    creator: createDeepSeek,
  },
  gemini: {
    creator: createGoogleGenerativeAI,
  },
  anthropic: {
    creator: createAnthropic,
    headers: { 'anthropic-dangerous-direct-browser-access': 'true' },
  },
  kimi: {
    creator: createDeepSeek,
  },
  ollama: {
    creator: createOllama,
  },
}
