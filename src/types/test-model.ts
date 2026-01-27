export interface TestConnConfig {
  provider: string
  modelId: string
  apiKey: string
  baseUrl?: string
}

export interface TestConnRequest {
  configId?: string // 配置已被保存，有 id 时，直接传递 id 即可
  config?: TestConnConfig
}

export interface TestResult {
  success: boolean
  message?: string
  model?: string
}

export interface TestConnResult {
  data: string
}
