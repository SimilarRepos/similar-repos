import type { ModelProvider } from './model-config'

import claudeIcon from '@/assets/icons/providers/claude.png'
import deepseekIcon from '@/assets/icons/providers/deepseek.png'
import doubaoIcon from '@/assets/icons/providers/doubao.png'
import geminiIcon from '@/assets/icons/providers/gemini.png'
import kimiIcon from '@/assets/icons/providers/kimi.png'
import ollamaIcon from '@/assets/icons/providers/ollama.png'
import openaiIcon from '@/assets/icons/providers/openai.png'
import openrouterIcon from '@/assets/icons/providers/openrouter.png'

export interface ProviderInfo {
  id: ModelProvider
  name: string
  description: string
  icon: string // emoji or icon class
  defaultBaseUrl?: string
  requiresBaseUrl: boolean
  models: ModelInfo[]
}

export interface ModelInfo {
  id: string
  name: string
  description?: string
}

export const MODEL_PROVIDERS: Record<ModelProvider, ProviderInfo> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI 官方 API',
    icon: openaiIcon,
    defaultBaseUrl: 'https://api.openai.com/v1',
    requiresBaseUrl: false,
    models: [
      { id: 'gpt-5.2', name: 'GPT-5.2', description: '' },
      { id: 'gpt-5.1', name: 'GPT-5.1', description: '' },
      { id: 'gpt-5', name: 'GPT-5', description: '' },
      { id: 'gpt-5-mini', name: 'GPT-5 mini', description: '' },
      { id: 'gpt-5-nano', name: 'GPT-5 nano', description: '' },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google 的 AI 模型',
    icon: geminiIcon,
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresBaseUrl: false,
    models: [
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: '' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: '' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: '' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: '' },
      {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite',
        description: '',
      },
    ],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek 深度求索',
    icon: deepseekIcon,
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    requiresBaseUrl: false,
    models: [{ id: 'deepseek-chat', name: 'DeepSeek-V3.2', description: '' }],
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi (Moonshot)',
    description: 'Moonshot AI 的 Kimi 模型',
    icon: kimiIcon,
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    requiresBaseUrl: false,
    models: [
      { id: 'kimi-k2-turbo-preview', name: 'Kimi-k2-turbo', description: '' },
      { id: 'kimi-k2-0905-preview', name: 'Kimi-k2-0905', description: '' },
      { id: 'kimi-k2-0711-preview', name: 'Kimi-k2-0711', description: '' },
    ],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Claude (Anthropic)',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    description: '自定义',
    icon: claudeIcon,
    requiresBaseUrl: true,
    models: [
      { id: 'claude-sonnet-4-5', name: 'Sonnet 4.5', description: '' },
      { id: 'claude-haiku-4-5', name: 'Haiku 4.5', description: '' },
      { id: 'claude-opus-4-5', name: 'Opus 4.5', description: '' },
    ],
  },
  volcengine: {
    id: 'volcengine',
    name: 'Doubao',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    description: '豆包大模型',
    icon: doubaoIcon,
    requiresBaseUrl: true,
    models: [
      { id: 'doubao-seed-1-8-251228', name: 'Seed-1.8', description: '' },
      { id: 'doubao-seed-1-6-251015', name: 'Seed-1.6', description: '' },
      {
        id: 'doubao-seed-1-6-flash-250828',
        name: 'Seed-1.6-flash',
        description: '',
      },
    ],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    description: '兼容 OpenAI API 的服务',
    icon: openrouterIcon,
    requiresBaseUrl: true,
    models: [
      {
        id: 'google/gemini-3-flash-preview',
        name: 'Gemini 3 flash',
        description: '',
      },
      {
        id: 'anthropic/claude-3.7-sonnet',
        name: 'Claude 3.7 Sonnet',
        description: '',
      },
      {
        id: 'anthropic/claude-haiku-4.5',
        name: 'Claude Haiku 4.5',
        description: '',
      },
      { id: 'deepseek/deepseek-v3.2', name: 'Deepseek V3.2', description: '' },
      { id: 'minimax/minimax-m2.1', name: 'MiniMax M2.1', description: '' },
    ],
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    defaultBaseUrl: 'http://localhost:11434/api',
    description: '自定义',
    icon: ollamaIcon,
    requiresBaseUrl: true,
    models: [
      { id: 'qwen3:8b', name: 'qwen3:8b', description: '' },
      { id: 'qwen3:14b', name: 'qwen3:14b', description: '' },
      { id: 'qwen3:30b', name: 'qwen3:30b', description: '' },
      { id: 'qwen3:32b', name: 'qwen3:32b', description: '' },
      { id: 'deepseek-r1:8b', name: 'deepseek-r1:8b', description: '' },
      { id: 'deepseek-r1:14b', name: 'deepseek-r1:14b', description: '' },
      { id: 'deepseek-r1:32b', name: 'deepseek-r1:32b', description: '' },
    ],
  },
}

export function getAllProviders(): ProviderInfo[] {
  return Object.values(MODEL_PROVIDERS)
}

export function getProviderById(id: ModelProvider): ProviderInfo | undefined {
  return MODEL_PROVIDERS[id]
}

export function getProviderModels(providerId: ModelProvider): ModelInfo[] {
  return MODEL_PROVIDERS[providerId]?.models || []
}

export function getModelName(
  providerId: ModelProvider,
  modelId: string,
): string | undefined {
  const models = getProviderModels(providerId)
  return models.find(model => model.id === modelId)?.name
}
