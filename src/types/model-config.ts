import { z } from 'zod'

export const ModelProviderEnum = z.enum([
  'openai',
  'gemini',
  'deepseek',
  'kimi',
  'anthropic',
  'volcengine',
  'openrouter',
  'ollama',
])

export type ModelProvider = z.infer<typeof ModelProviderEnum>
export const modelConfigItemSchema = z.object({
  id: z.string(),
  provider: ModelProviderEnum,
  modelId: z.string().min(1, '模型ID不能为空'),
  apiKey: z.string().min(1, 'API Key不能为空'),
  baseUrl: z.url('请输入有效的URL').optional(),
  displayName: z.string().optional(),
  enabled: z.boolean().default(true),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const modelsSchema = z.array(modelConfigItemSchema)

export const modelConfigDataSchema = z.object({
  models: modelsSchema,
  enabled: z.boolean().default(true),
  similarCount: z.number().default(3),
})

export const modelConfigsSchema = z.object({
  version: z.number(),
  data: modelConfigDataSchema,
})

export type ModelConfigItem = z.infer<typeof modelConfigItemSchema>
export type ModelConfigData = z.infer<typeof modelConfigDataSchema>
export type ModelConfigs = z.infer<typeof modelConfigsSchema>
