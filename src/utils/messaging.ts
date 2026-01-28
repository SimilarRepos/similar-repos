import type { TestConnRequest, TestConnResult } from '@/types/test-model'
import { defineExtensionMessaging } from '@webext-core/messaging'

export interface ProtocolMap {

  testModelConfig: (data: TestConnRequest) => TestConnResult

  openPage: (data: { url: string, active?: boolean }) => void
}

export const { sendMessage, onMessage }
  = defineExtensionMessaging<ProtocolMap>()
