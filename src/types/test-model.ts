export interface TestConnConfig {
  provider: string
  modelId: string
  apiKey: string
  baseUrl?: string
}

export interface TestConnRequest {
  configId?: string
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
