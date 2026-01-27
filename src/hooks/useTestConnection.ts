import type { ModelConfigItem } from '@/types/model-config'
import type { TestConnConfig, TestResult } from '@/types/test-model'
import { useState } from 'react'
import { sendMessage } from '@/utils/messaging'

export function useTestConnection() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const test = async (formData: TestConnConfig) => {
    if (!formData.apiKey || !formData.provider) {
      setResult({ success: false, message: 'Missing required fields' })
      return
    }

    setTesting(true)
    setResult({ success: true, message: 'Testing...' })

    try {
      const result = await sendMessage('testModelConfig', { config: formData })

      const success = true
      setResult({
        success,
        message: success ? JSON.stringify(result.data) : 'Connection failed',
        model: formData.modelId,
      })
    }
    catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      })
    }
    finally {
      setTesting(false)
    }
  }

  const reset = () => {
    setTesting(false)
    setResult(null)
  }

  return { testing, result, test, reset }
}

export function useTestConnectionBatch() {
  const [testingIds, setTestingIds] = useState<Set<string>>(() => new Set())
  const [results, setResults] = useState<Record<string, TestResult>>({})

  const test = async (config: ModelConfigItem) => {
    const { id } = config

    setTestingIds(prev => new Set(prev).add(id))
    setResults(prev => ({
      ...prev,
      [id]: { success: true, message: 'Testing...' },
    }))

    try {
      if (!config.apiKey) {
        throw new Error('API Key is required')
      }

      const result = await sendMessage('testModelConfig', {
        configId: config.id,
      })
      const success = true
      setResults(prev => ({
        ...prev,
        [id]: {
          success,
          message: success ? JSON.stringify(result.data) : 'Connection failed',
          model: config.modelId,
        },
      }))
    }
    catch (error) {
      setResults(prev => ({
        ...prev,
        [id]: {
          success: false,
          message: error instanceof Error ? error.message : 'Connection failed',
        },
      }))
    }
    finally {
      setTestingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const getResult = (id: string) => results[id]
  const isTesting = (id: string) => testingIds.has(id)

  const reset = (id?: string) => {
    if (id) {
      setResults((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
    else {
      setResults({})
      setTestingIds(new Set())
    }
  }

  return { test, getResult, isTesting, reset }
}
